import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { Users, MessageSquare, ThumbsUp, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function CommunityFeed() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState('announcement');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [posting, setPosting] = useState(false);

  const postTypes = [
    { value: 'announcement', label: 'Announcement', emoji: '📢' },
    { value: 'collaboration', label: 'Collaboration Request', emoji: '🤝' },
    { value: 'question', label: 'Question', emoji: '❓' },
    { value: 'resource', label: 'Resource Share', emoji: '📂' },
    { value: 'success_story', label: 'Success Story', emoji: '🎉' },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostTitle || !newPostContent) return;

    setPosting(true);
    try {
      const response = await axios.post(
        `${API}/posts`,
        {
          title: newPostTitle,
          content: newPostContent,
          post_type: newPostType,
          tags: []
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPosts([response.data, ...posts]);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostType('announcement');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setPosting(false);
    }
  };

  const getPostTypeBadge = (type) => {
    const postType = postTypes.find(pt => pt.value === type);
    return postType ? `${postType.emoji} ${postType.label}` : type;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8" data-testid="community-feed">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Community Feed</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connect with fellow entrepreneurs, share success stories, and collaborate on opportunities
        </p>
      </div>

      {/* Create Post Card */}
      {user ? (
        <Card data-testid="create-post-card">
          <CardHeader>
            <CardTitle>Share with the Community</CardTitle>
            <CardDescription>Post announcements, questions, or success stories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Post Type</label>
              <Select value={newPostType} onValueChange={setNewPostType}>
                <SelectTrigger data-testid="post-type-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {postTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.emoji} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                placeholder="Give your post a title..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                data-testid="post-title-input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                placeholder="Share your thoughts, questions, or updates..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={4}
                data-testid="post-content-input"
              />
            </div>

            <Button
              onClick={handleCreatePost}
              disabled={posting || !newPostTitle || !newPostContent}
              className="w-full bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90"
              data-testid="post-submit-btn"
            >
              {posting ? 'Posting...' : 'Post to Community'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertDescription>
            <strong>Login required:</strong> Please <a href="/login" className="text-[#006847] underline">log in</a> to post to the community feed.
          </AlertDescription>
        </Alert>
      )}

      {/* Posts Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#006847]"></div>
            <p className="mt-4 text-gray-600">Loading community posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-600">
              No posts yet. Be the first to share something with the community!
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow" data-testid="post-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-gray-700">{post.user_name}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
                    <Badge variant="secondary">{getPostTypeBadge(post.post_type)}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>

                <div className="flex items-center space-x-6 pt-4 border-t text-gray-600">
                  <button className="flex items-center space-x-2 hover:text-[#006847] transition">
                    <ThumbsUp className="h-5 w-5" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-[#006847] transition">
                    <MessageSquare className="h-5 w-5" />
                    <span>{post.comments.length}</span>
                  </button>
                </div>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {post.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default CommunityFeed;
