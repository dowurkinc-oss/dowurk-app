import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  User,
  Building2,
  Calendar,
  BookOpen,
  DollarSign,
  MessageSquare,
  ArrowRight,
  Edit,
  Settings
} from 'lucide-react';

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#006847]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const quickActions = [
    {
      title: 'Explore Businesses',
      description: 'Find and connect with Louisiana entrepreneurs',
      icon: <Building2 className="h-6 w-6" />,
      link: '/businesses',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'AI Assistant',
      description: 'Get personalized business guidance',
      icon: <MessageSquare className="h-6 w-6" />,
      link: '/ai-assistant',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Upcoming Events',
      description: 'Join workshops and networking events',
      icon: <Calendar className="h-6 w-6" />,
      link: '/events',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Learning Resources',
      description: 'Access courses and templates',
      icon: <BookOpen className="h-6 w-6" />,
      link: '/resources',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      title: 'Find Grants',
      description: 'Discover funding opportunities',
      icon: <DollarSign className="h-6 w-6" />,
      link: '/grants',
      color: 'bg-red-50 text-red-600'
    }
  ];

  return (
    <div className="space-y-8" data-testid="user-dashboard">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#006847] to-[#005a3c] rounded-2xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.full_name}!</h1>
            <p className="text-lg opacity-90">
              Ready to take your business to the next level?
            </p>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/20">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            {user.phone && (
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            )}
            {user.location && (
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">{user.location}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Account Type</p>
              <Badge className="mt-1 bg-[#A4D65E] text-black">
                {user.user_type?.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>Your engagement with the The DowUrk FramewUrk community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[#006847]">0</div>
                <p className="text-sm text-gray-600 mt-1">Events Attended</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#006847]">0</div>
                <p className="text-sm text-gray-600 mt-1">Resources Accessed</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#006847]">0</div>
                <p className="text-sm text-gray-600 mt-1">Community Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Alert */}
      <Alert className="border-[#A4D65E] bg-green-50">
        <AlertDescription>
          🎉 <strong>Welcome to The DowUrk FramewUrk!</strong> Start by exploring businesses, asking our AI assistant questions, 
          or joining upcoming events. We're here to support your entrepreneurial journey.
        </AlertDescription>
      </Alert>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(action.link)}>
              <CardContent className="p-6">
                <div className={`rounded-full h-12 w-12 flex items-center justify-center mb-4 ${action.color}`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                <div className="flex items-center text-[#006847] font-medium text-sm">
                  Explore <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommended Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
          <CardDescription>Complete these actions to get the most out of The DowUrk FramewUrk</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="h-6 w-6 rounded-full bg-[#A4D65E] flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium">Complete your profile</p>
              <p className="text-sm text-gray-600">Add your bio, interests, and business information</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="h-6 w-6 rounded-full bg-[#A4D65E] flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium">Try the AI Assistant</p>
              <p className="text-sm text-gray-600">Ask questions about starting or growing your business</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="h-6 w-6 rounded-full bg-[#A4D65E] flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
            <div className="flex-1">
              <p className="font-medium">Register for an event</p>
              <p className="text-sm text-gray-600">Join a workshop or networking session</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
