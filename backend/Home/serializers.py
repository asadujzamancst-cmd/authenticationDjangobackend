from rest_framework import serializers
from .models import User
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.crypto import get_random_string



class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=128, min_length=6, write_only=True)
    is_superuser = serializers.BooleanField(default=False)
    is_staff = serializers.BooleanField(default=False)

    class Meta:
        model = User
        fields = ['email', 'username', 'full_name', 'date_of_birth', 'gender', 'password', 'is_superuser', 'is_staff']  


    def validate(self, attrs):
        email = attrs.get('email', '')
        username = attrs.get('username', '')

        if not username.isalnum():
            raise serializers.ValidationError(
                    self.default_error_messages)

        return attrs
    
    def create(self, validated_data):
        # Use django's built-in create_user method to create a new user
        user = User.objects.create_user(                
            email=validated_data['email'],
            username=validated_data['username'],
            full_name=validated_data.get('full_name', ''),
            date_of_birth=validated_data.get('date_of_birth', None),
            gender=validated_data.get('gender', ''),
            password=validated_data['password'],        
            is_superuser=validated_data.get('is_superuser', False),
            is_staff=validated_data.get('is_staff', False)

        )
        
        user.set_password(validated_data['password'])
        user.save()
        return user
    

class LoginSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    username = serializers.CharField(max_length=255, min_length=3)
    tokens = serializers.SerializerMethodField()
    def get_tokens(self,obj):
        user = User.objects.get(username=obj['username'])
        return user.tokens
    class Meta:
        model = User
        fields = ['username', 'password', 'tokens']
    def validate(self, attrs):
        username = attrs.get('username', '')
        password = attrs.get('password', '')

        # Check if the user exists
        if not User.objects.filter(username=username).exists():
            raise AuthenticationFailed('User not found')
        user = auth.authenticate(username=username, password=password)

        #Check if the password is correct
        if user is None:
            raise AuthenticationFailed('Incorrect password')
        if not user.is_active:
            raise AuthenticationFailed('User is deactivated')
        if not user.is_authorized:
            raise AuthenticationFailed('User is not authorized. Please contact admin.')
        return {
            'username': user.username,  
            'tokens': user.tokens(),
            'email': user.email
        }                 


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except Exception as e:
            raise serializers.ValidationError('Bad token')


class passwordResetSerializer(serializers.Serializer):
    email =serializers.EmailField()



    def validate_email(self, value):
        user = User.objects.filter(email=value).first()
        if user is None:
            raise serializers.ValidationError("User with this email does not exist.")
        return value
    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        # Here you would typically generate a password reset token and send an email
        # For simplicity, we'll just return the user object
        otp = get_random_string(length=6, allowed_chars='0123456789')
        user.login_token = otp
        user.save()
        
        return {'user': user, 'otp': otp}