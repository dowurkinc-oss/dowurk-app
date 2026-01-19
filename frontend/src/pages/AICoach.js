import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target, Rocket, TrendingUp, RefreshCw, CheckCircle2, Circle,
  Calendar, Award, Sparkles, ArrowRight, Loader2, BookOpen,
  MessageSquare, ChevronRight, Star, Zap, Clock
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/ai-hub`;

function AICoach() {
  const [activeTab, setActiveTab] = useState('start');
  const [businessStage, setBusinessStage] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [coachingSession, setCoachingSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [microCourse, setMicroCourse] = useState(null);
  const [checkinData, setCheckinData] = useState({
    completed_tasks: [],
    challenges_faced: [],
    wins: [],
    questions: []
  });

  const challengeOptions = [
    'Finding customers',
    'Managing finances',
    'Marketing on a budget',
    'Legal compliance',
    'Hiring employees',
    'Scaling operations',
    'Work-life balance',
    'Access to funding',
    'Building a team',
    'Technology adoption'
  ];

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${API}/coach/topics`);
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const startCoachingSession = async () => {
    if (!businessStage || !businessDescription) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/coach/session`, {
        business_stage: businessStage,
        business_description: businessDescription,
        current_challenges: challenges
      });
      setCoachingSession(response.data);
      setActiveTab('session');
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Failed to start coaching session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateMicroCourse = async () => {
    if (!selectedTopic) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API}/coach/micro-course`, {
        topic: selectedTopic,
        business_stage: businessStage || 'launch'
      });
      setMicroCourse(response.data);
    } catch (error) {
      console.error('Error generating course:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitCheckin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/coach/checkin`, {
        session_id: coachingSession?.session_id || 'demo',
        ...checkinData
      });
      // Update session with checkin results
      setCoachingSession(prev => ({
        ...prev,
        last_checkin: response.data
      }));
      setActiveTab('session');
    } catch (error) {
      console.error('Error submitting checkin:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChallenge = (challenge) => {
    setChallenges(prev => 
      prev.includes(challenge) 
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-[#A4D65E] to-[#006847] rounded-xl">
            <Target className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">AI Business Coach</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get personalized coaching, set goals, track milestones, and receive weekly accountability check-ins
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="start">
            <Rocket className="h-4 w-4 mr-2" />
            Start
          </TabsTrigger>
          <TabsTrigger value="session" disabled={!coachingSession}>
            <Target className="h-4 w-4 mr-2" />
            Session
          </TabsTrigger>
          <TabsTrigger value="checkin" disabled={!coachingSession}>
            <Calendar className="h-4 w-4 mr-2" />
            Check-in
          </TabsTrigger>
          <TabsTrigger value="learn">
            <BookOpen className="h-4 w-4 mr-2" />
            Learn
          </TabsTrigger>
        </TabsList>

        {/* Start New Session */}
        <TabsContent value="start" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Start Your Coaching Journey</CardTitle>
              <CardDescription>
                Tell us about your business and we'll create a personalized coaching plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Business Stage Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">What stage is your business in?</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { value: 'launch', label: 'Launch', icon: Rocket, desc: 'Starting or planning to start' },
                    { value: 'growth', label: 'Growth', icon: TrendingUp, desc: 'Scaling and expanding' },
                    { value: 'pivot', label: 'Pivot', icon: RefreshCw, desc: 'Changing direction' }
                  ].map((stage) => (
                    <Card 
                      key={stage.value}
                      className={`cursor-pointer transition-all ${
                        businessStage === stage.value 
                          ? 'border-2 border-[#006847] bg-[#006847]/5' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setBusinessStage(stage.value)}
                    >
                      <CardContent className="pt-6 text-center">
                        <stage.icon className={`h-8 w-8 mx-auto mb-2 ${
                          businessStage === stage.value ? 'text-[#006847]' : 'text-gray-400'
                        }`} />
                        <h3 className="font-semibold">{stage.label}</h3>
                        <p className="text-sm text-gray-500">{stage.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Business Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">
                  Describe your business
                </Label>
                <Textarea
                  id="description"
                  placeholder="What does your business do? Who are your customers? What makes you unique?"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Challenges */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">What challenges are you facing?</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {challengeOptions.map((challenge) => (
                    <div
                      key={challenge}
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        challenges.includes(challenge)
                          ? 'border-[#006847] bg-[#006847]/5'
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => toggleChallenge(challenge)}
                    >
                      <Checkbox checked={challenges.includes(challenge)} />
                      <span className="text-sm">{challenge}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={startCoachingSession} 
                disabled={loading || !businessStage || !businessDescription}
                className="w-full bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Your Coaching Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start AI Coaching Session
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Session */}
        <TabsContent value="session" className="space-y-6">
          {coachingSession && (
            <>
              {/* Health Score */}
              <Card className="bg-gradient-to-r from-[#006847] to-[#A4D65E] text-white">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Business Health Score</h3>
                      <p className="text-white/80 text-sm">Based on your current progress and activities</p>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-bold">{coachingSession.health_score || 75}</div>
                      <div className="text-sm text-white/80">out of 100</div>
                    </div>
                  </div>
                  <Progress 
                    value={coachingSession.health_score || 75} 
                    className="mt-4 h-3 bg-white/20"
                  />
                </CardContent>
              </Card>

              {/* Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-[#006847]" />
                    Your Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{coachingSession.assessment}</p>
                </CardContent>
              </Card>

              {/* Priorities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5 text-yellow-500" />
                    Top Priorities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {coachingSession.priorities?.map((priority, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-6 w-6 rounded-full bg-[#006847] text-white flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{priority}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 30-Day Action Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-[#A4D65E]" />
                    30-Day Action Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(coachingSession.action_plan || {}).map(([week, actions], index) => (
                      <Card key={week} className="bg-gray-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            Week {index + 1}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {actions?.map((action, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <Circle className="h-4 w-4 mt-0.5 text-gray-400" />
                                <span className="text-sm">{action}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Motivational Message */}
              <Alert className="bg-[#A4D65E]/10 border-[#A4D65E]">
                <Sparkles className="h-4 w-4 text-[#006847]" />
                <AlertDescription className="text-[#006847] font-medium">
                  {coachingSession.motivational_message}
                </AlertDescription>
              </Alert>

              <div className="flex justify-center">
                <Button 
                  onClick={() => setActiveTab('checkin')}
                  className="bg-[#006847] hover:bg-[#005238]"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Complete Weekly Check-in
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* Weekly Check-in */}
        <TabsContent value="checkin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-[#006847]" />
                Weekly Accountability Check-in
              </CardTitle>
              <CardDescription>
                Reflect on your progress and get personalized feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Completed Tasks */}
              <div className="space-y-2">
                <Label className="font-semibold">What tasks did you complete this week?</Label>
                <Textarea
                  placeholder="List the tasks you accomplished..."
                  onChange={(e) => setCheckinData(prev => ({
                    ...prev,
                    completed_tasks: e.target.value.split('\n').filter(t => t.trim())
                  }))}
                  rows={3}
                />
              </div>

              {/* Wins */}
              <div className="space-y-2">
                <Label className="font-semibold flex items-center">
                  <Award className="mr-2 h-4 w-4 text-yellow-500" />
                  What wins did you have?
                </Label>
                <Textarea
                  placeholder="Celebrate your successes, big or small..."
                  onChange={(e) => setCheckinData(prev => ({
                    ...prev,
                    wins: e.target.value.split('\n').filter(t => t.trim())
                  }))}
                  rows={3}
                />
              </div>

              {/* Challenges */}
              <div className="space-y-2">
                <Label className="font-semibold">What challenges did you face?</Label>
                <Textarea
                  placeholder="What obstacles or difficulties came up..."
                  onChange={(e) => setCheckinData(prev => ({
                    ...prev,
                    challenges_faced: e.target.value.split('\n').filter(t => t.trim())
                  }))}
                  rows={3}
                />
              </div>

              {/* Questions */}
              <div className="space-y-2">
                <Label className="font-semibold">Any questions for your AI coach?</Label>
                <Textarea
                  placeholder="What would you like guidance on..."
                  onChange={(e) => setCheckinData(prev => ({
                    ...prev,
                    questions: e.target.value.split('\n').filter(t => t.trim())
                  }))}
                  rows={3}
                />
              </div>

              <Button 
                onClick={submitCheckin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#A4D65E] to-[#006847]"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Check-in...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Submit Weekly Check-in
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Hub */}
        <TabsContent value="learn" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-[#006847]" />
                Micro-Courses
              </CardTitle>
              <CardDescription>
                Quick, actionable lessons tailored to your business stage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Topic Selection */}
              <div className="space-y-3">
                <Label className="font-semibold">Choose a topic to learn</Label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic..." />
                  </SelectTrigger>
                  <SelectContent>
                    {topics && Object.entries(topics).map(([stage, topicList]) => (
                      <div key={stage}>
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                          {stage} Stage
                        </div>
                        {topicList.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={generateMicroCourse}
                  disabled={loading || !selectedTopic}
                  className="w-full bg-[#006847] hover:bg-[#005238]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Course...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate Micro-Course
                    </>
                  )}
                </Button>
              </div>

              {/* Generated Course */}
              {microCourse && (
                <div className="space-y-4 mt-6">
                  <div className="bg-gradient-to-r from-[#006847] to-[#A4D65E] text-white p-6 rounded-lg">
                    <Badge className="bg-white/20 text-white mb-2">
                      {microCourse.duration_minutes} min course
                    </Badge>
                    <h2 className="text-2xl font-bold mb-2">{microCourse.title}</h2>
                    <p className="text-white/90">{microCourse.description}</p>
                  </div>

                  {/* Objectives */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Learning Objectives</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {microCourse.objectives?.map((obj, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <CheckCircle2 className="h-5 w-5 text-[#A4D65E] mt-0.5" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Lessons */}
                  <div className="space-y-3">
                    {microCourse.lessons?.map((lesson, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <span className="h-6 w-6 rounded-full bg-[#006847] text-white flex items-center justify-center text-sm mr-2">
                              {i + 1}
                            </span>
                            {lesson.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 mb-3">{lesson.content}</p>
                          <div className="bg-[#A4D65E]/10 p-3 rounded-lg">
                            <p className="text-sm font-medium text-[#006847]">
                              Key Takeaway: {lesson.key_takeaway}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Exercise */}
                  {microCourse.exercise && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Zap className="mr-2 h-5 w-5 text-blue-600" />
                          Practical Exercise
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-semibold mb-2">{microCourse.exercise.title}</h4>
                        <p className="text-gray-700 mb-2">{microCourse.exercise.instructions}</p>
                        <p className="text-sm text-blue-600">
                          Expected Outcome: {microCourse.exercise.expected_outcome}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AICoach;
