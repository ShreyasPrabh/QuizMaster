from collections import defaultdict

from django.contrib.auth import authenticate, get_user_model
from django.db.models import Count, Sum, Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .models import Choice, DailyUsageLog, Question, QuizSession, SubTopic, Topic, UserProfile
from .serializers import (
    ChoiceSerializer,
    ProfileSerializer,
    QuestionSerializer,
    TopicSerializer,
)

User = get_user_model()

class SafeJWTAuthentication(JWTAuthentication):
    """
    Custom JWT Authentication that allows unauthenticated/anonymous access
    if an invalid or expired token is passed to safe read-only methods.
    """
    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except AuthenticationFailed:
            if request.method in ('GET', 'HEAD', 'OPTIONS'):
                return None
            raise

DEFAULT_AVATAR = '👾'

def get_clean_avatar(avatar_val):
    if not avatar_val or avatar_val in ['micah', 'bottts', 'identicon', 'avataaars', 'default'] or len(avatar_val) > 8:
        return DEFAULT_AVATAR
    if ('🐱' in avatar_val and '👤' in avatar_val) or avatar_val == '👤':
        return '🐱'
    return avatar_val


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
        return Response({'error': 'An account with this email already exists. Please log in.'}, status=status.HTTP_400_BAD_REQUEST)

    # Use email as username (truncated to 150 chars)
    username = email[:150]
    user = User(username=username, email=email)
    user.set_password(password)  # Hashes password using Django's PBKDF2/SHA-256
    if name:
        parts = name.split(' ', 1)
        user.first_name = parts[0]
        user.last_name = parts[1] if len(parts) > 1 else ''
    try:
        user.save()
    except Exception:
        return Response({'error': 'An account with this email already exists. Please log in.'}, status=status.HTTP_400_BAD_REQUEST)

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
            'avatar': get_clean_avatar(profile.avatar),
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
            'avatar': get_clean_avatar(profile.avatar),
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
            'avatar': get_clean_avatar(profile.avatar),
        }
    })


@api_view(['GET'])
@authentication_classes([SafeJWTAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def topics_list(request):
    topics = Topic.objects.prefetch_related('subtopics').all()
    serializer = TopicSerializer(topics, many=True)
    return Response({'topics': serializer.data})


@api_view(['GET'])
@authentication_classes([SafeJWTAuthentication])
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
    topic_name = request.data.get('topic_name') or 'General Knowledge'
    module_title = request.data.get('module_title') or 'Module'
    difficulty = request.data.get('difficulty', 'intermediate')
    raw_score = request.data.get('score')
    raw_total = request.data.get('total_questions')
    answers = request.data.get('answers', [])

    score = 0
    total_questions = 0

    if raw_score is not None:
        try:
            score = max(0, int(raw_score))
        except (ValueError, TypeError):
            score = 0
    if raw_total is not None:
        try:
            total_questions = max(0, int(raw_total))
        except (ValueError, TypeError):
            total_questions = max(score, 1)

    if raw_score is None and answers:
        question_ids = [item.get('question_id') for item in answers if item.get('question_id')]
        questions = Question.objects.filter(pk__in=question_ids).prefetch_related('choices')
        question_map = {question.id: question for question in questions}
        total_questions = len(question_ids)
        for item in answers:
            question_id = item.get('question_id')
            choice_id = item.get('choice_id')
            q = question_map.get(question_id)
            if not q:
                continue
            choice = q.choices.filter(pk=choice_id).first()
            if choice and choice.is_correct:
                score += 1

    # Ensure SubTopic exists in DB for this QuizSession
    subtopic = None
    if subtopic_id:
        try:
            subtopic = SubTopic.objects.filter(pk=subtopic_id).first()
        except Exception:
            subtopic = None
    if not subtopic and topic_name:
        try:
            topic, _ = Topic.objects.get_or_create(name=topic_name, defaults={'icon': 'BookOpen', 'description': topic_name})
            subtopic, _ = SubTopic.objects.get_or_create(topic=topic, name=module_title, defaults={'description': module_title})
        except Exception:
            pass
    if not subtopic:
        subtopic = SubTopic.objects.first()

    session = None
    if subtopic:
        try:
            session = QuizSession.objects.create(
                user=request.user,
                subtopic=subtopic,
                score=score,
                total_questions=total_questions,
            )
            # Keep only the most recent 10 sessions in database, delete older ones
            excess_ids = list(
                QuizSession.objects.filter(user=request.user)
                .order_by('-start_time')
                .values_list('id', flat=True)[10:]
            )
            if excess_ids:
                QuizSession.objects.filter(id__in=excess_ids).delete()
        except Exception as e:
            print('Could not save QuizSession to DB:', e)

    profile, _ = UserProfile.objects.get_or_create(user=request.user)

    increment_solved = total_questions if total_questions > 0 else (score if score > 0 else 1)
    profile.problems_solved = (profile.problems_solved or 0) + increment_solved

    from django.utils import timezone
    today = timezone.now().date()

    if not profile.last_active_date:
        profile.current_streak = 1
    elif profile.last_active_date == today:
        if not profile.current_streak or profile.current_streak == 0:
            profile.current_streak = 1
    else:
        diff_days = (today - profile.last_active_date).days
        if diff_days == 1:
            profile.current_streak = (profile.current_streak or 0) + 1
        elif diff_days > 1:
            profile.current_streak = 1

    profile.last_active_date = today

    if (profile.current_streak or 0) > (profile.max_streak or 0):
        profile.max_streak = profile.current_streak

    profile.save(update_fields=['problems_solved', 'current_streak', 'max_streak', 'last_active_date'])

    try:
        usage_log, _ = DailyUsageLog.objects.get_or_create(
            user=request.user,
            date=today,
        )
        usage_log.questions_attempted = (usage_log.questions_attempted or 0) + total_questions
        usage_log.questions_correct = (usage_log.questions_correct or 0) + score
        usage_log.save(update_fields=['questions_attempted', 'questions_correct'])
    except Exception:
        pass

    usage_att = DailyUsageLog.objects.filter(user=request.user).aggregate(Sum('questions_attempted'))['questions_attempted__sum'] or 0
    usage_cor = DailyUsageLog.objects.filter(user=request.user).aggregate(Sum('questions_correct'))['questions_correct__sum'] or 0
    total_solved = max(profile.problems_solved or 0, usage_att)
    accuracy = round((usage_cor / usage_att) * 100) if usage_att > 0 else 0
    sessions_count = QuizSession.objects.filter(user=request.user).count()
    quizzes_completed = max(sessions_count, 1)

    total_xp = (usage_cor * 25) + (quizzes_completed * 50)
    xp_needed = 200
    level = (total_xp // xp_needed) + 1
    xp_in_level = total_xp % xp_needed
    coins = 100 + (usage_cor * 10) + (quizzes_completed * 20)

    return Response({
        'score': score,
        'total_questions': total_questions,
        'problems_solved': total_solved,
        'correct_solved': usage_cor,
        'accuracy': accuracy,
        'current_streak': profile.current_streak,
        'max_streak': profile.max_streak,
        'quizzes_completed': quizzes_completed,
        'total_xp': total_xp,
        'level': level,
        'xp_in_level': xp_in_level,
        'xp_needed': xp_needed,
        'coins': coins,
        'session_id': session.id if session else None,
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)

    from django.utils import timezone
    today = timezone.now().date()
    if profile.last_active_date:
        diff = (today - profile.last_active_date).days
        if diff > 1 and profile.current_streak > 0:
            profile.current_streak = 0
            profile.save(update_fields=['current_streak'])

    usage_att = DailyUsageLog.objects.filter(user=request.user).aggregate(Sum('questions_attempted'))['questions_attempted__sum'] or 0
    usage_cor = DailyUsageLog.objects.filter(user=request.user).aggregate(Sum('questions_correct'))['questions_correct__sum'] or 0
    total_solved = max(profile.problems_solved or 0, usage_att)
    accuracy = round((usage_cor / usage_att) * 100) if usage_att > 0 else 0

    sessions_count = QuizSession.objects.filter(user=request.user).count()
    quizzes_completed = max(sessions_count, 1 if total_solved > 0 else 0)

    total_xp = (usage_cor * 25) + (quizzes_completed * 50)
    xp_needed = 200
    level = (total_xp // xp_needed) + 1
    xp_in_level = total_xp % xp_needed
    coins = 100 + (usage_cor * 10) + (quizzes_completed * 20)

    best_session = QuizSession.objects.filter(user=request.user).order_by('-score').first()
    high_score = (best_session.score * 100) if best_session else (usage_cor * 100)

    return Response({
        'username': request.user.username,
        'name': request.user.get_full_name() or request.user.first_name or request.user.username,
        'email': request.user.email,
        'avatar': get_clean_avatar(profile.avatar),
        'bio': profile.bio,
        'current_streak': profile.current_streak or 0,
        'max_streak': profile.max_streak or 0,
        'problems_solved': total_solved,
        'correct_solved': usage_cor,
        'accuracy': accuracy,
        'quizzes_completed': quizzes_completed,
        'total_xp': total_xp,
        'level': level,
        'xp_in_level': xp_in_level,
        'xp_needed': xp_needed,
        'coins': coins,
        'high_score': high_score,
        'total_time_spent_seconds': profile.total_time_spent_seconds,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)

    usage_logs = DailyUsageLog.objects.filter(user=request.user).order_by('date')
    sessions_qs = QuizSession.objects.filter(user=request.user).select_related('subtopic', 'subtopic__topic').order_by('-start_time')[:10]

    sessions_data = []
    for s in sessions_qs:
        topic_name = s.subtopic.topic.name if (s.subtopic and s.subtopic.topic) else 'General Knowledge'
        module_name = s.subtopic.name if s.subtopic else 'Quiz Module'
        tot = s.total_questions if s.total_questions > 0 else max(s.score, 10)
        pct = round((s.score / tot) * 100) if tot > 0 else 0
        sessions_data.append({
            'id': s.id,
            'topic': topic_name,
            'module': module_name,
            'difficulty': 'intermediate',
            'total': tot,
            'correct': s.score,
            'percent': pct,
            'score': s.score * 100,
            'date': s.start_time.strftime('%b %d, %Y') if s.start_time else 'Today',
            'timestamp': s.start_time.isoformat() if s.start_time else None,
        })

    usage_att = DailyUsageLog.objects.filter(user=request.user).aggregate(Sum('questions_attempted'))['questions_attempted__sum'] or 0
    usage_cor = DailyUsageLog.objects.filter(user=request.user).aggregate(Sum('questions_correct'))['questions_correct__sum'] or 0
    total_solved = max(profile.problems_solved or 0, usage_att)
    accuracy = round((usage_cor / usage_att) * 100) if usage_att > 0 else 0
    quizzes_completed = max(len(sessions_data), 1 if total_solved > 0 else 0)

    total_xp = (usage_cor * 25) + (quizzes_completed * 50)
    level = (total_xp // 200) + 1
    xp_in_level = total_xp % 200

    difficulty_counts = {
        'easy': 0,
        'intermediate': 0,
        'hard': 0,
    }
    for s in sessions_data:
        diff = s.get('difficulty', 'intermediate').lower()
        if diff in difficulty_counts:
            difficulty_counts[diff] += 1
        else:
            difficulty_counts['intermediate'] += 1

    return Response({
        'stats': {
            'problems_solved': total_solved,
            'correct_solved': usage_cor,
            'accuracy': accuracy,
            'quizzes_completed': quizzes_completed,
            'current_streak': profile.current_streak or 0,
            'max_streak': profile.max_streak or 0,
            'total_xp': total_xp,
            'level': level,
            'xp_in_level': xp_in_level,
            'xp_needed': 200,
        },
        'sessions': sessions_data,
        'difficulty_counts': difficulty_counts,
        'daily_activity': [
            {
                'date': log.date.isoformat(),
                'questions_correct': log.questions_correct,
                'questions_attempted': log.questions_attempted,
                'time_spent_seconds': log.time_spent_seconds,
            }
            for log in usage_logs
        ],
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def profile_update(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    data = request.data
    user = request.user

    if 'name' in data and data['name']:
        name_str = data['name'].strip()
        parts = name_str.split(' ', 1)
        user.first_name = parts[0]
        user.last_name = parts[1] if len(parts) > 1 else ''
        user.save(update_fields=['first_name', 'last_name'])

    if 'avatar' in data:
        profile.avatar = get_clean_avatar(data['avatar'])
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
            'avatar': get_clean_avatar(profile.avatar),
        },
        'avatar': get_clean_avatar(profile.avatar),
        'bio': profile.bio,
    })


@api_view(['GET'])
@authentication_classes([SafeJWTAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def leaderboard_view(request):
    timeframe = request.GET.get('timeframe', 'all').lower()
    profiles = UserProfile.objects.select_related('user').all().order_by('-problems_solved', '-current_streak')[:50]
    
    usage_map = {
        item['user']: item
        for item in DailyUsageLog.objects.values('user').annotate(
            total_att=Sum('questions_attempted'),
            total_cor=Sum('questions_correct')
        )
    }

    leaders = []
    medals = ['👑 1ST', '🥈 2ND', '🥉 3RD']
    for idx, p in enumerate(profiles):
        is_me = (request.user.is_authenticated and request.user.id == p.user.id)
        avatar_clean = get_clean_avatar(p.avatar)
        user_name = p.user.get_full_name() or p.user.first_name or p.user.username
        
        usage = usage_map.get(p.user.id)
        att = usage['total_att'] if usage else 0
        cor = usage['total_cor'] if usage else 0
        accuracy = round((cor / att) * 100) if att > 0 else (100 if (p.problems_solved or 0) > 0 else 0)
        points = (p.problems_solved or 0) * 100 + (p.current_streak or 0) * 25

        leaders.append({
            'rank': idx + 1,
            'id': p.user.id,
            'name': user_name,
            'avatar': avatar_clean,
            'streak': p.current_streak or 0,
            'accuracy': accuracy,
            'points': points,
            'medal': medals[idx] if idx < 3 else f"{idx + 1}TH",
            'isCurrentUser': is_me,
        })

    leaders.sort(key=lambda x: (x['points'], x['streak']), reverse=True)
    for idx, l in enumerate(leaders):
        l['rank'] = idx + 1
        l['medal'] = medals[idx] if idx < 3 else f"{idx + 1}TH"

    response = Response({'leaderboard': leaders})
    response['Cache-Control'] = 'public, max-age=5, s-maxage=10, stale-while-revalidate=30'
    return response

