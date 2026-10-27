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
    admin_quizzes_overview,
    admin_create_quiz,
    admin_delete_quiz,
    admin_create_subtopic,
    admin_delete_subtopic,
    admin_create_question,
    admin_delete_question,
    admin_users_list,
    admin_toggle_user_privilege,
    admin_grant_privilege,
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
    # Admin Quiz Management Endpoints
    path('admin/quizzes/', admin_quizzes_overview, name='admin-quizzes-overview'),
    path('admin/quizzes/create/', admin_create_quiz, name='admin-create-quiz'),
    path('admin/quizzes/<str:topic_id>/delete/', admin_delete_quiz, name='admin-delete-quiz'),
    path('admin/subtopics/create/', admin_create_subtopic, name='admin-create-subtopic'),
    path('admin/subtopics/<str:subtopic_id>/delete/', admin_delete_subtopic, name='admin-delete-subtopic'),
    path('admin/questions/create/', admin_create_question, name='admin-create-question'),
    path('admin/questions/<int:question_id>/delete/', admin_delete_question, name='admin-delete-question'),
    # Admin Privilege Endpoints
    path('admin/users/', admin_users_list, name='admin-users-list'),
    path('admin/users/<int:user_id>/toggle-admin/', admin_toggle_user_privilege, name='admin-toggle-user-privilege'),
    path('admin/grant-privilege/', admin_grant_privilege, name='admin-grant-privilege'),
]

