import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, UserPlus, Handshake, Calendar, MessageSquare,
  Star, MapPin, Briefcase, Target, Loader2, Sparkles,
  Heart, Award, TrendingUp, Clock, ArrowRight
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/ai-hub`;

function AICommunity() {
  const [activeTab, setActiveTab] = useState('mentors');
  const [loading, setLoading] = useState(false);
  const [mentorMatches, setMentorMatches] = useState(null);
  const [collaborators, setCollaborators] = useState(null);
  const [peerGroup, setPeerGroup] = useState(null);
  const [events, setEvents] = useState(null);

  // Form state
  const [mentorProfile, setMentorProfile] = useState({
    full_name: '',
    business_stage: 'launch',
    industry: '',
    goals: [],
    challenges: [],
    location: 'Louisiana'
  });

  const [collaboratorProfile, setCollaboratorProfile] = useState({
    full_name: '',
    business_name: '',
    category: '',
    collaboration_type: 'partner',
    skills: [],
    needs: []
  });

  const industries = [
    'Technology', 'Food & Beverage', 'Retail', 'Healthcare', 'Professional Services',
    'Construction', 'Manufacturing', 'Transportation', 'Education', 'Entertainment',
    'Agriculture', 'Real Estate', 'Finance', 'Creative Services', 'Other'
  ];

  const collaborationTypes = [
    { value: 'partner', label: 'Business Partner', icon: Handshake },
    { value: 'supplier', label: 'Supplier/Vendor', icon: Briefcase },
    { value: 'customer', label: 'Potential Customer', icon: Users },
    { value: 'investor', label: 'Investor', icon: TrendingUp },
    { value: 'co-founder', label: 'Co-Founder', icon: UserPlus }
  ];

  const goalOptions = [
    'Increase revenue', 'Expand to new markets', 'Build a team',
    'Secure funding', 'Improve operations', 'Develop new products',
    'Build brand awareness', 'Establish partnerships'
  ];

  const challengeOptions = [
    'Finding customers', 'Managing finances', 'Marketing',
    'Hiring talent', 'Scaling operations', 'Legal compliance',
    'Work-life balance', 'Technology adoption'
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/community/networking-events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const findMentors = async () => {
    if (!mentorProfile.full_name || !mentorProfile.industry) {
      alert('Please fill in your name and industry');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/community/mentors`, mentorProfile);
      setMentorMatches(response.data);
    } catch (error) {
      console.error('Error finding mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const findCollaborators = async () => {
    if (!collaboratorProfile.full_name || !collaboratorProfile.business_name) {
      alert('Please fill in your name and business name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/community/collaborate`, collaboratorProfile);
      setCollaborators(response.data);
    } catch (error) {
      console.error('Error finding collaborators:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPeerGroup = async (focus) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/community/peer-group`, {
        group_focus: focus
      });
      setPeerGroup(response.data);
    } catch (error) {
      console.error('Error creating peer group:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGoal = (goal) => {
    setMentorProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const toggleChallenge = (challenge) => {
    setMentorProfile(prev => ({
      ...prev,
      challenges: prev.challenges.includes(challenge)
        ? prev.challenges.filter(c => c !== challenge)
        : [...prev.challenges, challenge]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
            <Users className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">Community Intelligence</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          AI-powered networking to connect you with mentors, collaborators, and peer entrepreneurs
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mentors">
            <Heart className="h-4 w-4 mr-2" />
            Find Mentors
          </TabsTrigger>
          <TabsTrigger value="collaborate">
            <Handshake className="h-4 w-4 mr-2" />
            Collaborate
          </TabsTrigger>
          <TabsTrigger value="peers">
            <Users className="h-4 w-4 mr-2" />
            Peer Groups
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
        </TabsList>

        {/* Find Mentors Tab */}
        <TabsContent value="mentors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-pink-500" />
                Find Your Perfect Mentor
              </CardTitle>
              <CardDescription>
                Our AI matches you with experienced mentors based on your goals and challenges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mentor_name">Your Name *</Label>
                  <Input
                    id="mentor_name"
                    placeholder="Your full name"
                    value={mentorProfile.full_name}
                    onChange={(e) => setMentorProfile(prev => ({
                      ...prev,
                      full_name: e.target.value
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">Your Industry *</Label>
                  <Select 
                    value={mentorProfile.industry}
                    onValueChange={(value) => setMentorProfile(prev => ({
                      ...prev,
                      industry: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stage">Business Stage</Label>
                  <Select 
                    value={mentorProfile.business_stage}
                    onValueChange={(value) => setMentorProfile(prev => ({
                      ...prev,
                      business_stage: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="launch">Launch (Starting out)</SelectItem>
                      <SelectItem value="growth">Growth (Scaling up)</SelectItem>
                      <SelectItem value="pivot">Pivot (Changing direction)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, Parish"
                    value={mentorProfile.location}
                    onChange={(e) => setMentorProfile(prev => ({
                      ...prev,
                      location: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>What are your goals? (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {goalOptions.map((goal) => (
                    <div
                      key={goal}
                      className={`p-3 rounded-lg border cursor-pointer transition-all text-center text-sm ${
                        mentorProfile.goals.includes(goal)
                          ? 'border-[#006847] bg-[#006847]/5 text-[#006847]'
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => toggleGoal(goal)}
                    >
                      {goal}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>What challenges are you facing?</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {challengeOptions.map((challenge) => (
                    <div
                      key={challenge}
                      className={`p-3 rounded-lg border cursor-pointer transition-all text-center text-sm ${
                        mentorProfile.challenges.includes(challenge)
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => toggleChallenge(challenge)}
                    >
                      {challenge}
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={findMentors}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Finding Your Matches...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Find Mentor Matches
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Mentor Results */}
          {mentorMatches && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Your Mentor Matches</h2>
              
              {mentorMatches.matches?.map((mentor, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl">
                          {mentor.name?.charAt(0) || 'M'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold">{mentor.name}</h3>
                            <p className="text-gray-500">{mentor.industry} • {mentor.experience_years} years experience</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {mentor.match_score}% Match
                          </Badge>
                        </div>
                        
                        <p className="mt-2 text-gray-600">{mentor.bio}</p>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          {mentor.expertise?.map((skill, i) => (
                            <Badge key={i} variant="outline">{skill}</Badge>
                          ))}
                        </div>

                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {mentor.location}
                        </div>

                        <p className="mt-3 text-sm text-[#006847] font-medium">
                          {mentor.why_good_match}
                        </p>

                        <div className="mt-4 flex space-x-3">
                          <Button className="bg-[#006847] hover:bg-[#005238]">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Request Introduction
                          </Button>
                          <Button variant="outline">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {mentorMatches.mentorship_tips && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <strong>Mentorship Tips:</strong>
                    <ul className="mt-2 space-y-1">
                      {mentorMatches.mentorship_tips.map((tip, i) => (
                        <li key={i} className="text-sm">• {tip}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </TabsContent>

        {/* Collaborate Tab */}
        <TabsContent value="collaborate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Handshake className="mr-2 h-5 w-5 text-purple-500" />
                Find Collaboration Opportunities
              </CardTitle>
              <CardDescription>
                Connect with other entrepreneurs for partnerships, suppliers, or customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Your Name *</Label>
                  <Input
                    placeholder="Your full name"
                    value={collaboratorProfile.full_name}
                    onChange={(e) => setCollaboratorProfile(prev => ({
                      ...prev,
                      full_name: e.target.value
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Business Name *</Label>
                  <Input
                    placeholder="Your business name"
                    value={collaboratorProfile.business_name}
                    onChange={(e) => setCollaboratorProfile(prev => ({
                      ...prev,
                      business_name: e.target.value
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Business Category</Label>
                  <Select 
                    value={collaboratorProfile.category}
                    onValueChange={(value) => setCollaboratorProfile(prev => ({
                      ...prev,
                      category: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>What type of collaboration are you looking for?</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {collaborationTypes.map((type) => (
                    <Card
                      key={type.value}
                      className={`cursor-pointer transition-all ${
                        collaboratorProfile.collaboration_type === type.value
                          ? 'border-2 border-purple-500 bg-purple-50'
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setCollaboratorProfile(prev => ({
                        ...prev,
                        collaboration_type: type.value
                      }))}
                    >
                      <CardContent className="pt-4 text-center">
                        <type.icon className={`h-8 w-8 mx-auto mb-2 ${
                          collaboratorProfile.collaboration_type === type.value
                            ? 'text-purple-500'
                            : 'text-gray-400'
                        }`} />
                        <p className="text-sm font-medium">{type.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Button 
                onClick={findCollaborators}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Finding Opportunities...
                  </>
                ) : (
                  <>
                    <Handshake className="mr-2 h-5 w-5" />
                    Find Collaborators
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Collaborator Results */}
          {collaborators && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Collaboration Opportunities</h2>
              
              {collaborators.matches?.map((collab, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {collab.name?.charAt(0) || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold">{collab.name}</h3>
                          <p className="text-gray-500">{collab.business}</p>
                          <Badge className="mt-1" variant="outline">{collab.category}</Badge>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">
                        {collab.match_score}% Match
                      </Badge>
                    </div>
                    
                    <p className="mt-3 text-gray-600">{collab.collaboration_opportunity}</p>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-500">Their Skills</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {collab.skills?.map((skill, i) => (
                            <Badge key={i} className="bg-green-100 text-green-800">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-500">Looking For</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {collab.needs?.map((need, i) => (
                            <Badge key={i} className="bg-blue-100 text-blue-800">{need}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-3">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Peer Groups Tab */}
        <TabsContent value="peers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-[#006847]" />
                Join a Peer Accountability Group
              </CardTitle>
              <CardDescription>
                Connect with entrepreneurs at similar stages for mutual support and accountability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { focus: 'marketing', title: 'Marketing Mastermind', desc: 'Focus on growing your brand and customer base' },
                  { focus: 'funding', title: 'Funding Focus', desc: 'Navigate grants, loans, and investor relations' },
                  { focus: 'operations', title: 'Operations Excellence', desc: 'Streamline processes and scale efficiently' },
                  { focus: 'growth', title: 'Growth Accelerator', desc: 'Strategies for rapid business expansion' },
                  { focus: 'launch', title: 'Launch Pad', desc: 'For entrepreneurs just starting out' },
                  { focus: 'leadership', title: 'Leadership Circle', desc: 'Develop your leadership and management skills' }
                ].map((group) => (
                  <Card 
                    key={group.focus}
                    className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                    onClick={() => createPeerGroup(group.focus)}
                  >
                    <CardContent className="pt-6 text-center">
                      <div className="h-12 w-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-[#A4D65E] to-[#006847] flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-bold">{group.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{group.desc}</p>
                      <Button className="mt-4 w-full" variant="outline">
                        Join Group
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Peer Group Results */}
          {peerGroup && (
            <Card>
              <CardHeader>
                <CardTitle>Your Peer Group</CardTitle>
                <CardDescription>{peerGroup.group_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{peerGroup.group_description}</p>
                
                <div className="space-y-3">
                  <Label>Group Members</Label>
                  {peerGroup.members?.map((member, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar>
                        <AvatarFallback className="bg-[#006847] text-white">
                          {member.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.business}</p>
                      </div>
                      <Badge variant="outline">{member.stage}</Badge>
                    </div>
                  ))}
                </div>

                {peerGroup.meeting_schedule && (
                  <Alert className="bg-green-50 border-green-200">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      <strong>Meeting Schedule:</strong> {peerGroup.meeting_schedule}
                    </AlertDescription>
                  </Alert>
                )}

                {peerGroup.discussion_topics && (
                  <div className="space-y-2">
                    <Label>Suggested Discussion Topics</Label>
                    <ul className="space-y-1">
                      {peerGroup.discussion_topics.map((topic, i) => (
                        <li key={i} className="text-sm text-gray-600">• {topic}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-[#006847]" />
                Networking Events
              </CardTitle>
              <CardDescription>
                AI-recommended events based on your profile and goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {events?.recommended_events?.map((event, index) => (
                <Card key={index} className="mb-4 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className="mb-2" variant="outline">{event.type}</Badge>
                        <h3 className="text-lg font-bold">{event.title}</h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {event.date}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-[#006847]">{event.match_reason}</p>
                      </div>
                      <Button className="bg-[#006847] hover:bg-[#005238]">
                        Register
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {events?.networking_tips && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <strong>Networking Tips:</strong>
                    <ul className="mt-2 space-y-1">
                      {events.networking_tips.map((tip, i) => (
                        <li key={i} className="text-sm">• {tip}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AICommunity;
