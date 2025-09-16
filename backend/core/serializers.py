from django.db.models import Sum
from django.contrib.auth.models import User

from rest_framework import serializers

from .models import Profile,Community, Comment, Post, Vote


class ProfileSerializer(serializers.ModelSerializer):
    date_joined = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = ['user','avatar','description','date_joined']

    def get_posts(self,obj):
        posts = obj.user.posts.all()
        return PostSerializer(posts,many=True).data
    
    def get_date_joined(self,obj):
        return obj.user.date_joined

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'password', 'avatar','date_joined']

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
        post = validated_data['post']
        value = validated_data['value']

        vote,created = Vote.objects.get_or_create(user=user,post=post,defaults={'value': value})
        if not created:
            if vote.value==value:
                vote.delete()
                return None
            else:
                vote.value = value
                vote.save()
                return vote
            
        vote.value = value
        vote.save()
        return vote

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)  
    vote_score = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False)
    user_vote = serializers.SerializerMethodField()
    comment_counter = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'body', 'created_time', 'author', 'community', 'vote_score','user_vote' ,'image','comment_counter']
        read_only_fields = ['author', 'created_time']
 

    def get_vote_score(self, obj):
        return obj.votes.aggregate(score=Sum('value'))['score'] or 0
    
    def get_user_vote(self,obj):
        user = self.context['request'].user
        if user.is_authenticated:
            vote = obj.votes.filter(user=user).first()
            return vote.value if vote else 0
        return 0

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'body', 'created_time', 'author', 'post']
        read_only_fields = ['author', 'post', 'created_time']



class CommunitySerializer(serializers.ModelSerializer):
    user_counter = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    posts = PostSerializer(many=True,read_only=True,source='post_set')
    class Meta:
        model = Community
        fields = ['id', 'name', 'image','description','created_time','user_counter','is_member','posts']
    
    def get_user_counter(self,obj):
        return obj.members.count()
    
    def get_is_member(self,obj):
        user = self.context["request"].user
        if user.is_authenticated:
            return obj.members.filter(id=user.id).exists()
        return False

class CommunityDetailserializer(serializers.ModelSerializer):
    posts = PostSerializer(many=True,read_only=True,source='post_set')
    class Meta:
        model = Community
        fields = ['id', 'name', 'description', 'image', 'posts']
