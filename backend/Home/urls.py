from django.urls import path
from . import views

app_name = "Home"

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginApiView.as_view(), name='login'),  # <--- fixed
    path('logout/', views.LogoutApiView.as_view(), name='logout'),
    path('password-reset/', views.PasswordResetOTPEmailView.as_view(), name='password_reset'),
    path('password-reset-confirm/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),

]
