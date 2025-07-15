from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly,IsAuthenticated


from .serializers import (
    ProfileSerializer,
    PostSerializer,
    CommentSerializer,
    PostVoteSerializer,
    CommunitySerializer,
    UserSerializer
)
from .models import Profile,Post, Comment, Community, Vote

class ProfileView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        profile = user.profile
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request, username):
        user = get_object_or_404(User, username=username)
        if request.user != user:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)

        profile = user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            

class RegisterUserView(generics.CreateAPIView):
    serializer_class = UserSerializer


class CommunityListView(APIView):
    def get(self, request):
        communities = Community.objects.all()
        serializer = CommunitySerializer(communities, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CommunitySerializer(data=request.data)
        if serializer.is_valid():
            community = serializer.save()
            return Response(CommunitySerializer(community).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostListView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        
        data['author'] = request.user.id

        serializer = PostSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            post = serializer.save(author=request.user)
            return Response(PostSerializer(post, context={'request': request}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetailView(APIView):
    def get(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data)

    def delete(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        if post.author != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CommentListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        comment = Comment.objects.filter(post__pk=pk)
        serializer = CommentSerializer(comment, many=True)
        return Response(serializer.data)

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        serializer = CommentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            comment = serializer.save(author=request.user, post=post)
            return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostVoteView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        serializer = PostVoteSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            vote = serializer.save()
            return Response(PostVoteSerializer(vote).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SearchUser(APIView):
    def get(self,request):
        q = request.GET.get('q','')
        users = User.objects.filter(username__icontains=q)
        serializer=UserSerializer(users,many=True)
        return Response(serializer.data) 