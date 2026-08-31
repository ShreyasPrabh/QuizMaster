from rest_framework import serializers

from .models import Choice, Question, SubTopic, Topic, UserProfile


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct']


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'difficulty', 'explanation', 'code_snippet', 'choices']


class SubTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTopic
        fields = ['id', 'name', 'slug', 'description']


class TopicSerializer(serializers.ModelSerializer):
    subtopics = SubTopicSerializer(many=True, read_only=True)

    class Meta:
        model = Topic
        fields = ['id', 'name', 'slug', 'icon', 'description', 'color', 'subtopics']


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['avatar', 'bio', 'current_streak', 'max_streak', 'problems_solved', 'total_time_spent_seconds']
