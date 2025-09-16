from django.db import models
from django.contrib.auth.models import User
from django.db.models import UniqueConstraint


class Profile(models.Model):
  user = models.OneToOneField(User,on_delete=models.CASCADE,related_name='profile')
  avatar = models.ImageField(upload_to='avatars/',default='avatars/default.jpg')
  description = models.TextField(blank=True)
  def __str__(self):
    return self.user.username


class Community(models.Model):
  name = models.CharField(max_length=100,unique=True)
  description = models.TextField(blank=True)
  image = models.ImageField(upload_to='communities/',default="communities/default.jpg")
  members = models.ManyToManyField(User)
  created_time = models.DateTimeField(auto_now_add=True)
  
  def __str__(self):
    return self.name
  
class Post(models.Model):
  title = models.CharField(max_length=100)
  body = models.TextField(blank=True)
  created_time = models.DateTimeField(auto_now_add=True)
  author = models.ForeignKey(User,models.CASCADE)
  community = models.ForeignKey(Community,on_delete=models.CASCADE)
  image = models.ImageField(upload_to='post_images/', blank=True, null=True)

  
  def __str__(self):
    return self.title
  
class Comment(models.Model):
  body = models.TextField()
  created_time = models.DateTimeField(auto_now_add=True)
  author = models.ForeignKey(User,on_delete=models.CASCADE)
  post = models.ForeignKey(Post,on_delete=models.CASCADE)
  
  def __str__(self):
    return str(self.author)

class Vote(models.Model):
  user = models.ForeignKey(User,on_delete=models.CASCADE)
  post = models.ForeignKey(Post,on_delete=models.CASCADE,related_name='votes')
  value = models.SmallIntegerField(choices=[(-1, 'Downvote'), (1, 'Upvote')])
  
  def __str__(self):
    return str(self.user)  
  
  class Meta:
    constraints = [
      UniqueConstraint(fields=['user','post'],name = 'unique_vote_per_user_post')
    ]
