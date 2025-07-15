from django.contrib import admin

from .models import Profile,Community,Post,Comment,Vote

admin.site.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
  fields = ['__all__']

admin.site.register(Community)
class CommunityAdmin(admin.ModelAdmin):
  fields = ['__all__']
  
admin.site.register(Post)
class PostAdmin(admin.ModelAdmin):
  fields = ['__all__']

admin.site.register(Comment)
class CommentAdmin(admin.ModelAdmin):
  list_display = ['author','body','post']
  fields = ['__all__']
  
admin.site.register(Vote)
class VoteAdmin(admin.ModelAdmin):
  fields = ['__all__']
  
  

  