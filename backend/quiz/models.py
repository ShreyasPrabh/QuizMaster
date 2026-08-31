from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

class Topic(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    icon = models.CharField(max_length=50, help_text="Lucide icon name, e.g., 'Code', 'Calculator'")
    description = models.TextField(blank=True)
    color = models.CharField(max_length=50, default="from-blue-500 to-indigo-600")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class SubTopic(models.Model):
    topic = models.ForeignKey(Topic, related_name='subtopics', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.topic.name}-{self.name}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.topic.name} - {self.name}"

class Question(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('intermediate', 'Intermediate'),
        ('hard', 'Hard'),
    ]
    
    subtopic = models.ForeignKey(SubTopic, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    code_snippet = models.TextField(blank=True, null=True)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    explanation = models.TextField(blank=True, help_text="Explanation shown after answering")

    def __str__(self):
        return f"{self.subtopic.name} ({self.difficulty}) - {self.text[:30]}..."

class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.text} {'(Correct)' if self.is_correct else ''}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.CharField(max_length=255, default='micah')
    bio = models.TextField(blank=True)
    preferred_topics = models.ManyToManyField(Topic, blank=True)
    current_streak = models.IntegerField(default=0)
    max_streak = models.IntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)
    problems_solved = models.IntegerField(default=0)
    total_time_spent_seconds = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s Profile"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class QuizSession(models.Model):
    user = models.ForeignKey(User, related_name='quiz_sessions', on_delete=models.CASCADE)
    subtopic = models.ForeignKey(SubTopic, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.subtopic.name} ({self.start_time.date()})"

class QuestionAttempt(models.Model):
    session = models.ForeignKey(QuizSession, related_name='attempts', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    is_correct = models.BooleanField()
    timestamp = models.DateTimeField(auto_now_add=True)

class DailyUsageLog(models.Model):
    user = models.ForeignKey(User, related_name='usage_logs', on_delete=models.CASCADE)
    date = models.DateField()
    time_spent_seconds = models.IntegerField(default=0)
    questions_attempted = models.IntegerField(default=0)
    questions_correct = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.username} - {self.date}"
