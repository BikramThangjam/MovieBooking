from .models import *
from .serializers import *
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
import json
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.
class SignUpView(APIView):
    def post(self, req):
        data = json.loads(req.body)
        userExist = User.objects.filter(username=data["username"])      
        if not userExist:
            serializer = SignUpSerializer(data=data)
            
            if serializer.is_valid():
                user = serializer.save()
                return JsonResponse({"message": "Account has been created"})
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST, safe=False)
        
        return JsonResponse({"message": "Account already exist"}, status=status.HTTP_400_BAD_REQUEST)

class SignInView(APIView):
    def post(self, req):
        data = json.loads(req.body)  
        serializer = LoginSerializer(data=data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }) 
        return JsonResponse({"message":"Invalid username or password"}, status=status.HTTP_400_BAD_REQUEST)