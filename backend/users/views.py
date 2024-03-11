from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import action
from rest_framework import permissions, status
from rest_framework.permissions import BasePermission
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from users.models import User
from users.serializers import UserSerializer


class IsAccountOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.id == request.user.id


class AccountViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return (permissions.AllowAny(),)

        return (
            permissions.IsAuthenticated(),
            IsAccountOwner(),
        )

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            User.objects.create_user(**serializer.validated_data)
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    @action(detail=False, methods=["POST"], url_name="login")
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            user = User.objects.get(username=username)
            return Response({"token": token.key, "id": user.id})

        return Response({"error": "Invalid credentials"}, status=401)

    @action(
        detail=False,
        methods=["POST"],
        url_name="logout",
        permission_classes=[permissions.IsAuthenticated],
    )
    def logout(self, request):
        try:
            request.user.auth_token.delete()
        except (AttributeError, ObjectDoesNotExist):
            return Response(
                {"detail": "Authentication Token Missing or Invalid"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return Response(status=status.HTTP_200_OK)
