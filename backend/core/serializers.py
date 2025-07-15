from django.db.models import Sum
from django.contrib.auth.models import User

from rest_framework import serializers

from .models import Profile,Community, Comment, Post, Vote


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user','avatar','description']

    def get_posts(self,obj):
        posts = obj.user.posts.all()
        return PostSerializer(posts,many=True).data

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'password', 'avatar']

    def get_avatar(self, obj):
        try:
            profile = obj.profile  
            if profile.avatar:
                return profile.avatar.url  
        except Profile.DoesNotExist:
            pass
        return "/media/avatars/default.jpg"


    def create(self, validated_data):
        user = User(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user

class PostVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'post', 'value']
        read_only_fields = ['user']

    def create(self, validated_data):
        user = self.context['request'].user
        return Vote.objects.create(user=user, **validated_data)


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)  
    vote_score = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False)

    class Meta:
        model = Post
        fields = ['id', 'title', 'body', 'created_time', 'author', 'community', 'vote_score', 'image']
        read_only_fields = ['author', 'created_time']

    def get_vote_score(self, obj):
        return obj.votes.aggregate(score=Sum('value'))['score'] or 0

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'body', 'created_time', 'author', 'post']
        read_only_fields = ['author', 'post', 'created_time']


class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = ['id', 'name', 'description']
