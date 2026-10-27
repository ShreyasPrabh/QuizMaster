from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Choice, DailyUsageLog, Question, QuizSession, SubTopic, Topic, UserProfile

User = get_user_model()


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 4
    fields = ['text', 'is_correct']


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1
    fields = ['text', 'difficulty', 'explanation']
    show_change_link = True


class SubTopicInline(admin.TabularInline):
    model = SubTopic
    extra = 1
    fields = ['name', 'slug', 'description']
    show_change_link = True


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Player Arcade Profile'
    fk_name = 'user'
    extra = 0
    fields = ['avatar', 'bio', 'current_streak', 'max_streak', 'problems_solved', 'last_active_date']


# Re-register UserAdmin with UserProfile inline and prominent privilege columns
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    inlines = [UserProfileInline]
    list_display = ['username', 'email', 'first_name', 'is_staff', 'is_superuser', 'is_active']
    list_filter = ['is_staff', 'is_superuser', 'is_active']
    actions = ['grant_admin_privileges', 'revoke_admin_privileges']

    @admin.action(description='⚡ Grant Admin & Staff Privileges to selected users')
    def grant_admin_privileges(self, request, queryset):
        updated = queryset.update(is_staff=True, is_superuser=True)
        self.message_user(request, f"Successfully granted Admin & Superuser privileges to {updated} user(s).")

    @admin.action(description='🔒 Revoke Admin Privileges from selected users')
    def revoke_admin_privileges(self, request, queryset):
        updated = queryset.update(is_staff=False, is_superuser=False)
        self.message_user(request, f"Revoked Admin privileges from {updated} user(s).")


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'icon', 'color', 'subtopics_count']
    search_fields = ['name', 'slug', 'description']
    inlines = [SubTopicInline]

    def subtopics_count(self, obj):
        return obj.subtopics.count()
    subtopics_count.short_description = 'Modules'


@admin.register(SubTopic)
class SubTopicAdmin(admin.ModelAdmin):
    list_display = ['name', 'topic', 'slug', 'questions_count']
    list_filter = ['topic']
    search_fields = ['name', 'slug', 'description']
    inlines = [QuestionInline]

    def questions_count(self, obj):
        return obj.questions.count()
    questions_count.short_description = 'Questions'


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['text_preview', 'subtopic', 'difficulty', 'choices_count']
    list_filter = ['difficulty', 'subtopic__topic', 'subtopic']
    search_fields = ['text', 'explanation']
    inlines = [ChoiceInline]

    def text_preview(self, obj):
        return obj.text[:60] + '...' if len(obj.text) > 60 else obj.text
    text_preview.short_description = 'Question'

    def choices_count(self, obj):
        return obj.choices.count()
    choices_count.short_description = 'Choices'


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = ['text', 'question_preview', 'is_correct']
    list_filter = ['is_correct']
    search_fields = ['text', 'question__text']

    def question_preview(self, obj):
        return obj.question.text[:40] if obj.question else '-'
    question_preview.short_description = 'Question'


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'get_email', 'is_staff_status', 'is_superuser_status', 'current_streak', 'max_streak', 'problems_solved', 'last_active_date']
    list_filter = ['user__is_staff', 'user__is_superuser', 'last_active_date']
    search_fields = ['user__username', 'user__email']
    actions = ['grant_admin_privileges', 'revoke_admin_privileges']

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'

    @admin.display(boolean=True, description='Admin / Staff')
    def is_staff_status(self, obj):
        return obj.user.is_staff

    @admin.display(boolean=True, description='Superuser')
    def is_superuser_status(self, obj):
        return obj.user.is_superuser

    @admin.action(description='⚡ Grant Admin & Staff Privileges (Make Admin)')
    def grant_admin_privileges(self, request, queryset):
        count = 0
        for profile in queryset:
            profile.user.is_staff = True
            profile.user.is_superuser = True
            profile.user.save(update_fields=['is_staff', 'is_superuser'])
            count += 1
        self.message_user(request, f"⚡ Successfully granted Full Admin Privileges to {count} user profile(s).")

    @admin.action(description='🔒 Revoke Admin Privileges (Make Standard Player)')
    def revoke_admin_privileges(self, request, queryset):
        count = 0
        for profile in queryset:
            profile.user.is_staff = False
            profile.user.is_superuser = False
            profile.user.save(update_fields=['is_staff', 'is_superuser'])
            count += 1
        self.message_user(request, f"🔒 Revoked Admin Privileges from {count} user profile(s).")


@admin.register(QuizSession)
class QuizSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'subtopic', 'score', 'total_questions', 'difficulty', 'start_time']
    list_filter = ['difficulty', 'start_time']
    search_fields = ['user__username', 'subtopic__name']


@admin.register(DailyUsageLog)
class DailyUsageLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'date', 'questions_attempted', 'questions_correct', 'time_spent_seconds']
    list_filter = ['date']
    search_fields = ['user__username']

