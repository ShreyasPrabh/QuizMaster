from collections import defaultdict

from django.contrib.auth import authenticate, get_user_model
from django.db.models import Count, Sum, Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Choice, DailyUsageLog, Question, QuizSession, SubTopic, Topic, UserProfile
from .serializers import (
    ChoiceSerializer,
    ProfileSerializer,
    QuestionSerializer,
    TopicSerializer,
)

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user and return JWT tokens."""
    name = request.data.get('name', '').strip()
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')

    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(Q(email__iexact=email) | Q(username__iexact=email)).exists():
        return Response({'error': 'An account with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    # Use email as username (truncated to 150 chars)
    username = email[:150]
    user = User.objects.create_user(username=username, email=email, password=password)
    if name:
        parts = name.split(' ', 1)
        user.first_name = parts[0]
        user.last_name = parts[1] if len(parts) > 1 else ''
        user.save(update_fields=['first_name', 'last_name'])

    # Ensure profile exists
    profile, _ = UserProfile.objects.get_or_create(user=user)

    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.get_full_name() or name or user.username,
            'avatar': profile.avatar or '🧑‍🎓',
        },
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login with email or username and password."""
    identifier = (request.data.get('email') or request.data.get('username') or '').strip().lower()
    password = request.data.get('password', '')

    if not identifier or not password:
        return Response({'error': 'Please provide both email/username and password.'}, status=status.HTTP_400_BAD_REQUEST)

    # Find user by email or username (case-insensitive)
    user = User.objects.filter(Q(email__iexact=identifier) | Q(username__iexact=identifier)).first()

    if not user or not user.check_password(password):
        return Response({'error': 'Invalid email or password. Please check your credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        return Response({'error': 'This account has been deactivated.'}, status=status.HTTP_403_FORBIDDEN)

    profile, _ = UserProfile.objects.get_or_create(user=user)

    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.get_full_name() or user.first_name or user.username,
            'avatar': profile.avatar or '🧑‍🎓',
        },
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """Return current authenticated user info."""
    user = request.user
    profile, _ = UserProfile.objects.get_or_create(user=user)
    return Response({
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.get_full_name() or user.username,
            'avatar': profile.avatar or '🧑‍🎓',
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def topics_list(request):
    topics = Topic.objects.prefetch_related('subtopics').all()
    serializer = TopicSerializer(topics, many=True)
    return Response({'topics': serializer.data})


@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def questions_list(request):
    subtopic_id = request.query_params.get('subtopic_id')
    difficulty = request.query_params.get('difficulty')

    queryset = Question.objects.select_related('subtopic__topic').prefetch_related('choices')
    if subtopic_id:
        queryset = queryset.filter(subtopic_id=subtopic_id)
    if difficulty:
        queryset = queryset.filter(difficulty=difficulty)

    serializer = QuestionSerializer(queryset, many=True)
    return Response({'questions': serializer.data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_quiz(request):
    subtopic_id = request.data.get('subtopic_id')
    answers = request.data.get('answers', [])

    if not subtopic_id:
        return Response({'error': 'subtopic_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    subtopic = get_object_or_404(SubTopic, pk=subtopic_id)
    question_ids = [item.get('question_id') for item in answers if item.get('question_id')]
    questions = Question.objects.filter(pk__in=question_ids).prefetch_related('choices')
    question_map = {question.id: question for question in questions}

    score = 0
    session = QuizSession.objects.create(
        user=request.user,
        subtopic=subtopic,
        score=0,
        total_questions=len(question_ids),
    )

    for item in answers:
        question_id = item.get('question_id')
        choice_id = item.get('choice_id')
        question = question_map.get(question_id)
        if not question:
            continue

        selected_choice = question.choices.filter(pk=choice_id).first()
        if not selected_choice:
            continue

        is_correct = selected_choice.is_correct
        if is_correct:
            score += 1

        session.attempts.create(
            question=question,
            selected_choice=selected_choice,
            is_correct=is_correct,
        )

    session.score = score
    session.save(update_fields=['score'])

    profile = request.user.profile
    profile.problems_solved += score
    profile.save(update_fields=['problems_solved'])

    usage_log, _ = DailyUsageLog.objects.get_or_create(
        user=request.user,
        date=__import__('django.utils.timezone').utils.timezone.now().date(),
    )
    usage_log.questions_attempted += len(question_ids)
    usage_log.questions_correct += score
    usage_log.save(update_fields=['questions_attempted', 'questions_correct'])

    return Response({
        'score': score,
        'total_questions': len(question_ids),
        'session_id': session.id,
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    profile = request.user.profile
    return Response({
        'username': request.user.username,
        'name': request.user.get_full_name() or request.user.username,
        'email': request.user.email,
        'avatar': profile.avatar,
        'bio': profile.bio,
        'current_streak': profile.current_streak or 1,
        'max_streak': profile.max_streak or 1,
        'problems_solved': profile.problems_solved,
        'total_time_spent_seconds': profile.total_time_spent_seconds,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics(request):
    profile = request.user.profile

    usage_logs = DailyUsageLog.objects.filter(user=request.user).order_by('date')
    solved_by_difficulty = list(
        QuizSession.objects.filter(user=request.user)
        .values('subtopic__topic__name')
        .annotate(total=Count('id'), score=Sum('score'))
    )

    daily_activity = [
        {
            'date': log.date.isoformat(),
            'questions_correct': log.questions_correct,
            'questions_attempted': log.questions_attempted,
            'time_spent_seconds': log.time_spent_seconds,
        }
        for log in usage_logs
    ]

    return Response({
        'profile': {
            'current_streak': profile.current_streak,
            'max_streak': profile.max_streak,
            'problems_solved': profile.problems_solved,
        },
        'daily_activity': daily_activity,
        'solved_by_difficulty': solved_by_difficulty,
        'total_usage_seconds': sum(log.time_spent_seconds for log in usage_logs),
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def profile_update(request):
    profile = request.user.profile
    data = request.data
    user = request.user

    if 'name' in data and data['name']:
        name_str = data['name'].strip()
        parts = name_str.split(' ', 1)
        user.first_name = parts[0]
        user.last_name = parts[1] if len(parts) > 1 else ''
        user.save(update_fields=['first_name', 'last_name'])

    if 'email' in data and data['email']:
        user.email = data['email'].strip()
        user.save(update_fields=['email'])

    if 'avatar' in data:
        profile.avatar = data['avatar']
    if 'bio' in data:
        profile.bio = data['bio']
    if 'preferred_topics' in data:
        topic_ids = data['preferred_topics']
        profile.preferred_topics.set(Topic.objects.filter(id__in=topic_ids))

    profile.save(update_fields=['avatar', 'bio'])

    return Response({
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.get_full_name() or user.username,
            'avatar': profile.avatar or '🧑‍🎓',
        },
        'avatar': profile.avatar,
        'bio': profile.bio,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def leaderboard_view(request):
    profiles = UserProfile.objects.select_related('user').all().order_by('-problems_solved', '-current_streak')[:50]
    
    leaders = []
    medals = ['🥇', '🥈', '🥉']
    for idx, p in enumerate(profiles):
        is_me = (request.user.is_authenticated and request.user.id == p.user.id)
        avatar_clean = p.avatar if (p.avatar and len(p.avatar) <= 2) else '🧑‍🎓'
        user_name = p.user.get_full_name() or p.user.username
        
        leaders.append({
            'rank': idx + 1,
            'name': user_name,
            'avatar': avatar_clean,
            'streak': p.current_streak or 0,
            'points': (p.problems_solved or 0) * 10,
            'medal': medals[idx] if idx < 3 else None,
            'isCurrentUser': is_me
        })

    response = Response({'leaderboard': leaders})
    # Fast Edge Caching: Cache for 30s so leaderboard loads in milliseconds
    response['Cache-Control'] = 'public, max-age=15, s-maxage=30, stale-while-revalidate=60'
    return response
