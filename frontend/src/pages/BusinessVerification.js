import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Search, Shield, CheckCircle2, AlertCircle, Building,
  FileText, User, MapPin, Calendar, Loader2, ArrowRight,
  BadgeCheck, XCircle, Clock, ExternalLink, Sparkles
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const SOS_API = `${BACKEND_URL}/api/la-sos`;

function BusinessVerification() {
  const [activeTab, setActiveTab] = useState('search');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [businessDetails, setBusinessDetails] = useState(null);
  const [nameAvailability, setNameAvailability] = useState(null);
  const [certificateValidation, setCertificateValidation] = useState(null);
  const [formationGuide, setFormationGuide] = useState(null);

  // Form state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('entity');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [proposedName, setProposedName] = useState('');
  const [certificateId, setCertificateId] = useState('');
  const [entityNumber, setEntityNumber] = useState('');
  const [entityTypeId, setEntityTypeId] = useState('1');

  const searchBusinesses = async () => {
    if (searchType === 'entity' && !searchQuery) {
      alert('Please enter a business name to search');
      return;
    }
    if (searchType === 'officer' && !lastName) {
      alert('Please enter at least a last name to search');
      return;
    }

    setLoading(true);
    try {
      const payload = searchType === 'entity' 
        ? { entity_name: searchQuery }
        : { first_name: firstName, last_name: lastName };
      
      const response = await axios.post(`${SOS_API}/search`, payload);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching businesses:', error);
      alert('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const lookupBusiness = async (entNumber, typeId = '1') => {
    setLoading(true);
    try {
      const response = await axios.post(`${SOS_API}/lookup`, {
        entity_number: entNumber || entityNumber,
        entity_type_id: parseInt(typeId || entityTypeId)
      });
      setBusinessDetails(response.data);
      setActiveTab('details');
    } catch (error) {
      console.error('Error looking up business:', error);
      alert('Lookup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkNameAvailability = async () => {
    if (!proposedName) {
      alert('Please enter a proposed business name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${SOS_API}/check-name`, {
        business_name: proposedName
      });
      setNameAvailability(response.data);
    } catch (error) {
      console.error('Error checking name:', error);
      alert('Name check failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateCertificate = async () => {
    if (!certificateId) {
      alert('Please enter a certificate ID');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${SOS_API}/validate-certificate`, {
        certificate_id: certificateId
      });
      setCertificateValidation(response.data);
    } catch (error) {
      console.error('Error validating certificate:', error);
      alert('Validation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFormationGuide = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SOS_API}/formation-guide`);
      setFormationGuide(response.data);
    } catch (error) {
      console.error('Error fetching guide:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-[#006847] to-[#A4D65E] rounded-xl">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">Louisiana Business Verification</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Verify business registrations, check name availability, and validate certificates 
          with official Louisiana Secretary of State data
        </p>
        <Badge className="bg-[#006847]">
          <BadgeCheck className="h-4 w-4 mr-1" />
          Powered by Louisiana SOS Commercial API
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="search">
            <Search className="h-4 w-4 mr-2" />
            Search
          </TabsTrigger>
          <TabsTrigger value="details" disabled={!businessDetails}>
            <Building className="h-4 w-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger value="name-check">
            <FileText className="h-4 w-4 mr-2" />
            Name Check
          </TabsTrigger>
          <TabsTrigger value="certificate">
            <BadgeCheck className="h-4 w-4 mr-2" />
            Certificate
          </TabsTrigger>
          <TabsTrigger value="formation" onClick={fetchFormationGuide}>
            <Sparkles className="h-4 w-4 mr-2" />
            Formation Guide
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5 text-[#006847]" />
                Search Louisiana Businesses
              </CardTitle>
              <CardDescription>
                Search by business name or by officer/agent name
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex space-x-4">
                <Button
                  variant={searchType === 'entity' ? 'default' : 'outline'}
                  onClick={() => setSearchType('entity')}
                  className={searchType === 'entity' ? 'bg-[#006847]' : ''}
                >
                  <Building className="mr-2 h-4 w-4" />
                  By Business Name
                </Button>
                <Button
                  variant={searchType === 'officer' ? 'default' : 'outline'}
                  onClick={() => setSearchType('officer')}
                  className={searchType === 'officer' ? 'bg-[#006847]' : ''}
                >
                  <User className="mr-2 h-4 w-4" />
                  By Officer/Agent Name
                </Button>
              </div>

              {searchType === 'entity' ? (
                <div className="space-y-2">
                  <Label htmlFor="business_search">Business Name</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="business_search"
                      placeholder="Enter business name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchBusinesses()}
                    />
                    <Button 
                      onClick={searchBusinesses}
                      disabled={loading}
                      className="bg-[#006847] hover:bg-[#005238]"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      placeholder="First name (optional)"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchBusinesses()}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button 
                      onClick={searchBusinesses}
                      disabled={loading}
                      className="w-full bg-[#006847] hover:bg-[#005238]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchResults && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Search Results
                  <Badge className="ml-2">{searchResults.result_count} found</Badge>
                </CardTitle>
                <CardDescription>
                  Token Type: {searchResults.token_type}
                  {searchResults.note && <span className="ml-2 text-orange-500">({searchResults.note})</span>}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {searchResults.results?.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.results.map((result, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-[#006847]/10 rounded-lg">
                            <Building className="h-5 w-5 text-[#006847]" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{result.name}</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Badge variant="outline">{result.entity_type}</Badge>
                              {result.city && (
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {result.city}
                                </span>
                              )}
                              {result.type_name && <span>{result.type_name}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={
                            result.status?.toLowerCase() === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }>
                            {result.status || 'Unknown'}
                          </Badge>
                          <Button 
                            size="sm"
                            onClick={() => lookupBusiness(result.entity_number, '1')}
                            className="bg-[#006847] hover:bg-[#005238]"
                          >
                            View Details
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No businesses found matching your search criteria.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          {businessDetails && businessDetails.success && (
            <>
              <Card className={`border-2 ${businessDetails.is_good_standing ? 'border-green-500' : 'border-yellow-500'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center">
                        {businessDetails.name}
                        {businessDetails.is_good_standing && (
                          <Badge className="ml-2 bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Good Standing
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Entity #{businessDetails.entity_number} • {businessDetails.entity_type}
                      </CardDescription>
                    </div>
                    <Badge className={
                      businessDetails.status?.toLowerCase() === 'active'
                        ? 'bg-green-500'
                        : 'bg-gray-500'
                    }>
                      {businessDetails.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-gray-500">Business Type</Label>
                      <p className="font-semibold">{businessDetails.business_type || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-gray-500">Registration Date</Label>
                      <p className="font-semibold">{businessDetails.registration_date || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-gray-500">Annual Report Status</Label>
                      <p className="font-semibold">{businessDetails.annual_report_status || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Registered Agents */}
                  {businessDetails.agents?.length > 0 && (
                    <div>
                      <h3 className="font-bold mb-3 flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Registered Agent(s)
                      </h3>
                      <div className="space-y-2">
                        {businessDetails.agents.map((agent, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-semibold">{agent.name}</p>
                            <p className="text-sm text-gray-500">
                              {agent.address}, {agent.city}, {agent.state} {agent.zip}
                            </p>
                            {agent.appointment_date && (
                              <p className="text-xs text-gray-400">
                                Appointed: {agent.appointment_date}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Officers */}
                  {businessDetails.officers?.length > 0 && (
                    <div>
                      <h3 className="font-bold mb-3 flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Officers
                      </h3>
                      <div className="grid md:grid-cols-2 gap-2">
                        {businessDetails.officers.map((officer, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-semibold">{officer.name}</p>
                            <Badge variant="outline" className="mt-1">{officer.titles}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Addresses */}
                  {businessDetails.addresses?.length > 0 && (
                    <div>
                      <h3 className="font-bold mb-3 flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        Business Addresses
                      </h3>
                      <div className="space-y-2">
                        {businessDetails.addresses.map((addr, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <Badge variant="outline" className="mb-1">{addr.type}</Badge>
                            <p className="text-sm">
                              {addr.address1} {addr.address2}
                            </p>
                            <p className="text-sm text-gray-500">
                              {addr.city}, {addr.state} {addr.zip}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Name Check Tab */}
        <TabsContent value="name-check" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-[#006847]" />
                Check Business Name Availability
              </CardTitle>
              <CardDescription>
                Verify if your proposed business name is available for registration in Louisiana
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="proposed_name">Proposed Business Name</Label>
                <div className="flex space-x-2">
                  <Input
                    id="proposed_name"
                    placeholder="Enter your proposed business name..."
                    value={proposedName}
                    onChange={(e) => setProposedName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && checkNameAvailability()}
                  />
                  <Button 
                    onClick={checkNameAvailability}
                    disabled={loading}
                    className="bg-[#006847] hover:bg-[#005238]"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check'}
                  </Button>
                </div>
              </div>

              {nameAvailability && (
                <Alert className={nameAvailability.is_available ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}>
                  {nameAvailability.is_available ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  )}
                  <AlertDescription>
                    <strong>{nameAvailability.business_name}</strong>
                    <p className="mt-1">{nameAvailability.recommendation}</p>
                    <p className="text-xs text-gray-500 mt-2">{nameAvailability.disclaimer}</p>
                  </AlertDescription>
                </Alert>
              )}

              {nameAvailability?.similar_names?.length > 0 && (
                <div className="mt-4">
                  <Label>Similar Existing Names</Label>
                  <div className="space-y-2 mt-2">
                    {nameAvailability.similar_names.map((name, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>{name.name}</span>
                        <Badge variant="outline">{name.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {nameAvailability?.next_steps && (
                <div className="mt-4">
                  <Label>Next Steps</Label>
                  <ul className="mt-2 space-y-1">
                    {nameAvailability.next_steps.map((step, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 text-[#006847]" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificate Tab */}
        <TabsContent value="certificate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BadgeCheck className="mr-2 h-5 w-5 text-[#006847]" />
                Validate Business Certificate
              </CardTitle>
              <CardDescription>
                Verify the authenticity of a Louisiana business certificate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certificate_id">Certificate ID</Label>
                <div className="flex space-x-2">
                  <Input
                    id="certificate_id"
                    placeholder="Enter certificate ID (e.g., 12345_67890)"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && validateCertificate()}
                  />
                  <Button 
                    onClick={validateCertificate}
                    disabled={loading}
                    className="bg-[#006847] hover:bg-[#005238]"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Validate'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Note: Replace # with _ in the certificate ID
                </p>
              </div>

              {certificateValidation && (
                <Card className={certificateValidation.is_valid ? 'border-green-500' : 'border-red-500'}>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      {certificateValidation.is_valid ? (
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                      ) : (
                        <XCircle className="h-12 w-12 text-red-500" />
                      )}
                      <div>
                        <h3 className="font-bold text-lg">
                          {certificateValidation.is_valid ? 'Certificate Valid' : 'Certificate Invalid'}
                        </h3>
                        <p className="text-gray-500">{certificateValidation.validation_message}</p>
                      </div>
                    </div>
                    
                    {certificateValidation.is_valid && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-500">Entity Name</Label>
                          <p className="font-semibold">{certificateValidation.entity_name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Entity Number</Label>
                          <p className="font-semibold">{certificateValidation.entity_number}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Certificate Date</Label>
                          <p className="font-semibold">{certificateValidation.certificate_date}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Formation Guide Tab */}
        <TabsContent value="formation" className="space-y-6">
          {formationGuide && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-[#006847]" />
                    {formationGuide.title}
                  </CardTitle>
                  <CardDescription>
                    Step-by-step guide to forming your Louisiana business
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formationGuide.steps?.map((step, index) => (
                      <div key={index} className="flex space-x-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-[#006847] to-[#A4D65E] flex items-center justify-center text-white font-bold">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{step.title}</h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                          {step.cost && (
                            <Badge variant="outline" className="mt-1">
                              Cost: {step.cost}
                            </Badge>
                          )}
                          {step.costs && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {Object.entries(step.costs).map(([type, cost]) => (
                                <Badge key={type} variant="outline">
                                  {type}: {cost}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {step.url && (
                            <a 
                              href={step.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-[#006847] hover:underline flex items-center mt-1"
                            >
                              Learn more <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Helpful Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {formationGuide.resources?.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <h4 className="font-bold text-[#006847]">{resource.name}</h4>
                        <p className="text-sm text-gray-600">{resource.description}</p>
                        <span className="text-xs text-gray-400 flex items-center mt-2">
                          Visit site <ExternalLink className="h-3 w-3 ml-1" />
                        </span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Alert className="bg-[#006847]/10 border-[#006847]">
                <Sparkles className="h-4 w-4 text-[#006847]" />
                <AlertDescription>
                  <strong>{formationGuide.ai_assistance}</strong>
                </AlertDescription>
              </Alert>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default BusinessVerification;
