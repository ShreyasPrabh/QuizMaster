from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    analytics,
    leaderboard_view,
    login_view,
    me_view,
    profile_update,
    questions_list,
    register,
    submit_quiz,
    topics_list,
    user_stats,
)

urlpatterns = [
    # Dedicated Auth Endpoints
    path('auth/register/', register, name='auth-register'),
    path('auth/login/', login_view, name='auth-login'),
    path('auth/me/', me_view, name='auth-me'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    # App Features
    path('topics/', topics_list, name='topics-list'),
    path('questions/', questions_list, name='questions-list'),
    path('quiz/submit/', submit_quiz, name='quiz-submit'),
    path('leaderboard/', leaderboard_view, name='leaderboard'),
    path('user/stats/', user_stats, name='user-stats'),
    path('analytics/', analytics, name='analytics'),
    path('profile/', profile_update, name='profile-update'),
]
