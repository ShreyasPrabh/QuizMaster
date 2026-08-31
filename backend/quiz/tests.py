from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from .models import Choice, Question, SubTopic, Topic, UserProfile

User = get_user_model()


class QuizApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='demo', password='secret123')
        self.profile = self.user.profile
        self.profile.current_streak = 4
        self.profile.max_streak = 8
        self.profile.problems_solved = 12
        self.profile.save()

        self.topic = Topic.objects.create(
            name='Python',
            slug='python',
            icon='Code',
            description='Programming practice',
        )
        self.subtopic = SubTopic.objects.create(
            topic=self.topic,
            name='Loops',
            slug='python-loops',
            description='Practice loop logic',
        )
        self.question = Question.objects.create(
            subtopic=self.subtopic,
            text='What does for i in range(3) do?',
            difficulty='easy',
            explanation='It runs three times.',
        )
        Choice.objects.create(question=self.question, text='Runs 3 times', is_correct=True)
        Choice.objects.create(question=self.question, text='Runs forever', is_correct=False)

    def test_topics_endpoint_returns_nested_data(self):
        response = self.client.get('/api/topics/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['topics'][0]['name'], 'Python')
        self.assertEqual(response.data['topics'][0]['subtopics'][0]['name'], 'Loops')

    def test_user_stats_endpoint_returns_profile_metrics(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/user/stats/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['current_streak'], 4)
        self.assertEqual(response.data['max_streak'], 8)
        self.assertEqual(response.data['problems_solved'], 12)
