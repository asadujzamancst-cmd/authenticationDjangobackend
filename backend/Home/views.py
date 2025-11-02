from django.shortcuts import render
from rest_framework import generics,status
from rest_framework.response import Response
from .serializers import *
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes   
from django.core.mail import send_mail
from django.core.exceptions import ValidationError
from django.shortcuts import redirect
from django.contrib import messages as message
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.views.generic import DetailView
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)

        is_superuser = serializer.validated_data.get('is_superuser', False)
        is_staff = serializer.validated_data.get('is_staff', False)
        serializer.save()
        user_data = serializer.data
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class LoginApiView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(username=serializer.validated_data['username'])

        if user.is_authorized:
            response_data = serializer.validated_data
            response_data["details"] = "Login Successful"

        #GEnerate a refresh token and set it for the user
            refresh = RefreshToken.for_user(user)
            user.refresh_token = str(refresh)
            user.save()
            response = Response(response_data, status=status.HTTP_200_OK)
            response.set_cookie('refresh_token', str(refresh), httponly=True)
            return response
        else:
            return Response({"details": "User not authorized"}, status=status.HTTP_401_UNAUTHORIZED)
        
class LogoutApiView(generics.GenericAPIView):
    authentication_classes = []
    serializer_class = LogoutSerializer
    @permission_classes([AllowAny])
    #permission_classes = (permissions.IsAuthenticated,)
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        response = Response()
        response.delete_cookie('refresh_token')
        response.data = {
            'details': 'Logout successful'
        }
        return response

# For seending otp via email for password reset
class PasswordResetOTPEmailView(generics.GenericAPIView):
    serializer_class = passwordResetSerializer

    def create(self,request,*args,**kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        data =serializer.save()

        #Generate a unique confirmation url for your local server
        confirmation_url_password_reset = f"http://localhost:3000/password-reset-confirm/{data['uid']}/{data['token']}/"
        #Send the email with the confirmation url
        subject = "Password Reset OTP"
        message = f'Use the following link to reset your password: {data["otp"]}\n\n'
        message += f'\n\nAlternatively, you can use the following link to reset your password: {confirmation_url_password_reset}'
        from_email = "webaster@example.com"
        recipient_list = [email]
        send_mail(subject, message, from_email, recipient_list)
        return Response({'details': 'Password reset OTP sent to email'}, status=status.HTTP_200_OK) 
    


class PasswordResetConfirmView(generics.GenericAPIView):
    model = User
    template_name = 'password_reset_confirm.html'
    context_object_name = 'user'

    def get_object(self,queryset=None):
        email =self.request.GET.get('email')
        otp = self.request.GET.get('otp')

        if not email or not otp:
            raise ValidationError("Email and OTP are required")
        user = User.objects.filter(email=email, login_token=otp).first()
        if user is None:
            raise ValidationError("Invalid email or OTP")
        return user
    def post(self,request,*args,**kwargs):
        user = self.get_object()
        new_password = request.data.get('new_password')
        user.set_password(new_password)
        user.save()

        message.success(request, 'Password has been reset successfully.')
        return redirect("Home:login")
    


class TokenLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        token = request.data.get('token')


        user =User.objects.filter(username=username, login_token=token).first()
        if user is not None:
            user.login_token = None
            user.save()
            response = Response({"details": "Login successful"}, status=status.HTTP_200_OK)
            response.set_cookie('refresh_token', user.refresh_token, httponly=True)
            return response
        else:
            return Response({"details": "Invalid token or username"}, status=status.HTTP_401_UNAUTHORIZED)
        



class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "is_authorized": user.is_authorized,
        })