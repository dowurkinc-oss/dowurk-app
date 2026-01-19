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
  DollarSign, Search, FileText, Calendar, CheckCircle2, 
  AlertCircle, Clock, ArrowRight, Loader2, Sparkles,
  Building, MapPin, Award, Target, TrendingUp, Shield
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/ai-hub`;
const SOS_API = `${BACKEND_URL}/api/la-sos`;

function AIGrants() {
  const [activeTab, setActiveTab] = useState('match');
  const [loading, setLoading] = useState(false);
  const [grantMatches, setGrantMatches] = useState(null);
  const [deadlines, setDeadlines] = useState(null);
  const [applicationContent, setApplicationContent] = useState(null);
  const [businessVerification, setBusinessVerification] = useState(null);
  
  // Form state
  const [businessProfile, setBusinessProfile] = useState({
    business_name: '',
    category: '',
    parish: '',
    description: '',
    organization_type: 'for-profit',
    certifications: []
  });
  
  const [selectedGrant, setSelectedGrant] = useState(null);

  const parishes = [
    'Acadia', 'Allen', 'Ascension', 'Assumption', 'Avoyelles', 'Beauregard',
    'Bienville', 'Bossier', 'Caddo', 'Calcasieu', 'Caldwell', 'Cameron',
    'Catahoula', 'Claiborne', 'Concordia', 'De Soto', 'East Baton Rouge',
    'East Carroll', 'East Feliciana', 'Evangeline', 'Franklin', 'Grant',
    'Iberia', 'Iberville', 'Jackson', 'Jefferson', 'Jefferson Davis',
    'Lafayette', 'Lafourche', 'La Salle', 'Lincoln', 'Livingston', 'Madison',
    'Morehouse', 'Natchitoches', 'Orleans', 'Ouachita', 'Plaquemines',
    'Pointe Coupee', 'Rapides', 'Red River', 'Richland', 'Sabine',
    'St. Bernard', 'St. Charles', 'St. Helena', 'St. James', 'St. John the Baptist',
    'St. Landry', 'St. Martin', 'St. Mary', 'St. Tammany', 'Tangipahoa',
    'Tensas', 'Terrebonne', 'Union', 'Vermilion', 'Vernon', 'Washington',
    'Webster', 'West Baton Rouge', 'West Carroll', 'West Feliciana', 'Winn'
  ];

  const categories = [
    'Food & Beverage', 'Retail', 'Technology', 'Healthcare', 'Professional Services',
    'Construction', 'Manufacturing', 'Transportation', 'Education', 'Entertainment',
    'Agriculture', 'Real Estate', 'Finance', 'Non-Profit', 'Other'
  ];

  const certifications = [
    { id: 'minority', label: 'Minority-Owned Business' },
    { id: 'women', label: 'Women-Owned Business' },
    { id: 'veteran', label: 'Veteran-Owned Business' },
    { id: 'disabled', label: 'Disability-Owned Business' },
    { id: 'lgbtq', label: 'LGBTQ+-Owned Business' },
    { id: 'hubzone', label: 'HUBZone Certified' },
    { id: '8a', label: 'SBA 8(a) Certified' },
    { id: 'dbe', label: 'Disadvantaged Business Enterprise (DBE)' }
  ];

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const fetchDeadlines = async () => {
    try {
      const response = await axios.get(`${API}/grants/deadlines`);
      setDeadlines(response.data);
    } catch (error) {
      console.error('Error fetching deadlines:', error);
    }
  };

  const findMatchingGrants = async () => {
    if (!businessProfile.business_name || !businessProfile.category || !businessProfile.parish) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/grants/match`, businessProfile);
      setGrantMatches(response.data);
    } catch (error) {
      console.error('Error finding grants:', error);
      alert('Failed to find matching grants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateApplication = async (grant) => {
    setSelectedGrant(grant);
    setLoading(true);
    try {
      const response = await axios.post(`${API}/grants/apply`, {
        grant_id: grant.id,
        grant_title: grant.title,
        grant_organization: grant.organization,
        amount_range: grant.amount_range,
        business_name: businessProfile.business_name,
        business_description: businessProfile.description,
        business_category: businessProfile.category,
        city: 'Louisiana',
        parish: businessProfile.parish,
        section: 'full'
      });
      setApplicationContent(response.data);
      setActiveTab('apply');
    } catch (error) {
      console.error('Error generating application:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyBusiness = async () => {
    setLoading(true);
    try {
      // First search for the business
      const searchResponse = await axios.post(`${SOS_API}/search`, {
        entity_name: businessProfile.business_name
      });
      
      if (searchResponse.data.results && searchResponse.data.results.length > 0) {
        const business = searchResponse.data.results[0];
        // Then verify for grant eligibility
        const verifyResponse = await axios.post(`${SOS_API}/verify-for-grant`, {
          entity_number: business.entity_number,
          entity_type_id: 1
        });
        setBusinessVerification(verifyResponse.data);
      } else {
        setBusinessVerification({
          success: false,
          message: "Business not found in Louisiana Secretary of State records. This may mean the business is not yet registered or is registered under a different name."
        });
      }
    } catch (error) {
      console.error('Error verifying business:', error);
      setBusinessVerification({
        success: false,
        message: "Unable to verify business at this time. Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCertification = (certId) => {
    setBusinessProfile(prev => ({
      ...prev,
      certifications: prev.certifications.includes(certId)
        ? prev.certifications.filter(c => c !== certId)
        : [...prev.certifications, certId]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">AI Grant Matching</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find grants you qualify for and get AI-powered assistance with your applications
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="match">
            <Search className="h-4 w-4 mr-2" />
            Find Grants
          </TabsTrigger>
          <TabsTrigger value="verify">
            <Shield className="h-4 w-4 mr-2" />
            Verify Business
          </TabsTrigger>
          <TabsTrigger value="deadlines">
            <Calendar className="h-4 w-4 mr-2" />
            Deadlines
          </TabsTrigger>
          <TabsTrigger value="apply" disabled={!applicationContent}>
            <FileText className="h-4 w-4 mr-2" />
            Application
          </TabsTrigger>
        </TabsList>

        {/* Find Grants Tab */}
        <TabsContent value="match" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tell Us About Your Business</CardTitle>
              <CardDescription>
                We'll match you with grants based on your business profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    placeholder="Your registered business name"
                    value={businessProfile.business_name}
                    onChange={(e) => setBusinessProfile(prev => ({
                      ...prev,
                      business_name: e.target.value
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Business Category *</Label>
                  <Select 
                    value={businessProfile.category}
                    onValueChange={(value) => setBusinessProfile(prev => ({
                      ...prev,
                      category: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parish">Parish *</Label>
                  <Select 
                    value={businessProfile.parish}
                    onValueChange={(value) => setBusinessProfile(prev => ({
                      ...prev,
                      parish: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parish" />
                    </SelectTrigger>
                    <SelectContent>
                      {parishes.map((parish) => (
                        <SelectItem key={parish} value={parish}>{parish}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="org_type">Organization Type</Label>
                  <Select 
                    value={businessProfile.organization_type}
                    onValueChange={(value) => setBusinessProfile(prev => ({
                      ...prev,
                      organization_type: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="for-profit">For-Profit</SelectItem>
                      <SelectItem value="non-profit">Non-Profit</SelectItem>
                      <SelectItem value="cooperative">Cooperative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your business does, your target market, and your goals..."
                  value={businessProfile.description}
                  onChange={(e) => setBusinessProfile(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <Label>Certifications (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        businessProfile.certifications.includes(cert.id)
                          ? 'border-[#006847] bg-[#006847]/5'
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => toggleCertification(cert.id)}
                    >
                      <Checkbox checked={businessProfile.certifications.includes(cert.id)} />
                      <span className="text-sm">{cert.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={findMatchingGrants}
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Finding Matching Grants...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Find Matching Grants
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Grant Results */}
          {grantMatches && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {grantMatches.matches?.length || 0} Grants Found
                </h2>
                <Badge className="bg-[#A4D65E] text-black">
                  Match Score: {grantMatches.overall_match_score}%
                </Badge>
              </div>

              {grantMatches.matches?.map((grant, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          {grant.title}
                          <Badge className="ml-2 bg-green-100 text-green-800">
                            {grant.match_score}% Match
                          </Badge>
                        </CardTitle>
                        <CardDescription>{grant.organization}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#006847]">
                          {grant.amount_range}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{grant.why_good_fit}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {grant.eligibility?.map((req, i) => (
                        <Badge key={i} variant="outline">{req}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Deadline: {grant.deadline || 'Rolling'}
                      </div>
                      <Button 
                        onClick={() => generateApplication(grant)}
                        className="bg-[#006847] hover:bg-[#005238]"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Application
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* AI Recommendations */}
              {grantMatches.recommendations && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <strong>AI Recommendations:</strong>
                    <ul className="mt-2 space-y-1">
                      {grantMatches.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm">{rec}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </TabsContent>

        {/* Verify Business Tab */}
        <TabsContent value="verify" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-[#006847]" />
                Louisiana Business Verification
              </CardTitle>
              <CardDescription>
                Verify your business registration with the Louisiana Secretary of State
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <Building className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  Many grants require businesses to be registered and in good standing with the Louisiana Secretary of State. 
                  Use this tool to verify your business status before applying.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="verify_name">Business Name</Label>
                <Input
                  id="verify_name"
                  placeholder="Enter your registered business name"
                  value={businessProfile.business_name}
                  onChange={(e) => setBusinessProfile(prev => ({
                    ...prev,
                    business_name: e.target.value
                  }))}
                />
              </div>

              <Button 
                onClick={verifyBusiness}
                disabled={loading || !businessProfile.business_name}
                className="w-full bg-[#006847] hover:bg-[#005238]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Verify Business
                  </>
                )}
              </Button>

              {/* Verification Results */}
              {businessVerification && (
                <Card className={`mt-4 ${businessVerification.is_grant_eligible ? 'border-green-500' : 'border-yellow-500'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {businessVerification.is_grant_eligible ? (
                        <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
                      )}
                      Verification Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {businessVerification.success ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-500">Business Name</Label>
                            <p className="font-semibold">{businessVerification.business_name}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Entity Number</Label>
                            <p className="font-semibold">{businessVerification.entity_number}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Status</Label>
                            <p className="font-semibold">{businessVerification.business_details?.status}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Annual Report Status</Label>
                            <p className="font-semibold">{businessVerification.business_details?.annual_report_status}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Eligibility Score</Label>
                          <div className="flex items-center space-x-4">
                            <Progress value={businessVerification.eligibility_score} className="flex-1" />
                            <span className="font-bold text-lg">{businessVerification.eligibility_score}%</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Eligibility Criteria</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(businessVerification.eligibility_criteria || {}).map(([key, value]) => (
                              <div key={key} className="flex items-center space-x-2">
                                {value ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                                )}
                                <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {businessVerification.recommendations?.length > 0 && (
                          <Alert className="bg-yellow-50 border-yellow-200">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <AlertDescription>
                              <strong>Recommendations:</strong>
                              <ul className="mt-2 space-y-1">
                                {businessVerification.recommendations.map((rec, i) => (
                                  <li key={i} className="text-sm">{rec}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}
                      </>
                    ) : (
                      <Alert className="bg-yellow-50 border-yellow-200">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription>{businessVerification.message}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deadlines Tab */}
        <TabsContent value="deadlines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-[#006847]" />
                Upcoming Grant Deadlines
              </CardTitle>
              <CardDescription>
                Don't miss these funding opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deadlines?.upcoming_deadlines?.map((deadline, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg mb-3 ${
                    deadline.status === 'closing_soon' 
                      ? 'bg-red-50 border border-red-200' 
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      deadline.status === 'closing_soon' 
                        ? 'bg-red-100' 
                        : 'bg-green-100'
                    }`}>
                      <Clock className={`h-5 w-5 ${
                        deadline.status === 'closing_soon' 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{deadline.title}</h4>
                      <p className="text-sm text-gray-500">Deadline: {deadline.deadline}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      deadline.status === 'closing_soon' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }>
                      {deadline.days_remaining} days left
                    </Badge>
                  </div>
                </div>
              ))}

              {deadlines?.tips && (
                <Alert className="mt-4 bg-blue-50 border-blue-200">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <strong>Tips for Success:</strong>
                    <ul className="mt-2 space-y-1">
                      {deadlines.tips.map((tip, i) => (
                        <li key={i} className="text-sm">• {tip}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Application Tab */}
        <TabsContent value="apply" className="space-y-6">
          {applicationContent && (
            <>
              <Card className="bg-gradient-to-r from-[#006847] to-[#A4D65E] text-white">
                <CardContent className="py-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Application for: {selectedGrant?.title}
                  </h2>
                  <p className="text-white/90">
                    AI-generated application content - review and customize before submitting
                  </p>
                </CardContent>
              </Card>

              {/* Executive Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Executive Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={applicationContent.executive_summary || ''}
                    rows={6}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Problem Statement */}
              <Card>
                <CardHeader>
                  <CardTitle>Problem Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={applicationContent.problem_statement || ''}
                    rows={6}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Proposed Solution */}
              <Card>
                <CardHeader>
                  <CardTitle>Proposed Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={applicationContent.solution || ''}
                    rows={6}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Budget Narrative */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Narrative</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={applicationContent.budget_narrative || ''}
                    rows={6}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Impact Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Impact Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={applicationContent.impact_metrics || ''}
                    rows={6}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button variant="outline">
                  Save Draft
                </Button>
                <Button className="bg-[#006847] hover:bg-[#005238]">
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AIGrants;
