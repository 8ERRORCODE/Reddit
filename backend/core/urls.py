from django.urls import path
from .views import ProfileView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    SearchUser,ProfileView,CommunityListView,
    PostListView,PostDetailView,CommentListCreateView,
    PostVoteView,RegisterUserView,CommunityBoard,
    CommunityJoinLeaveView,CommunityDetailView
    )

urlpatterns = [
    path('communities/',CommunityListView.as_view()),
    path('posts/',PostListView.as_view()),
    path('posts/<int:pk>/',PostDetailView.as_view()),
    path('posts/<int:pk>/comments/',CommentListCreateView.as_view()),
    path('vote/',PostVoteView.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('profile/<str:username>/', ProfileView.as_view(), name='profile-detail'),
    path('search-users/',SearchUser.as_view(),name='search-users'),
    path('communityboard',CommunityBoard.as_view(),name="CommunityBoard"),
    path('communities/<int:pk>/join-leave',CommunityJoinLeaveView.as_view(),name='communityjoinleaveview'),
    path('communities/<int:pk>/',CommunityDetailView.as_view(),name='communitydetailview')
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

