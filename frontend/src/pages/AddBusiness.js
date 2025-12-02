import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const BUSINESS_CATEGORIES = [
  'food', 'retail', 'service', 'professional', 'health', 
  'creative', 'technology', 'education', 'beauty', 'construction'
];

const LOUISIANA_PARISHES = [
  'Acadia', 'Allen', 'Ascension', 'Assumption', 'Avoyelles', 'Beauregard',
  'Bienville', 'Bossier', 'Caddo', 'Calcasieu', 'Caldwell', 'Cameron',
  'Catahoula', 'Claiborne', 'Concordia', 'De Soto', 'East Baton Rouge',
  'East Carroll', 'East Feliciana', 'Evangeline', 'Franklin', 'Grant',
  'Iberia', 'Iberville', 'Jackson', 'Jefferson', 'Jefferson Davis',
  'Lafayette', 'Lafourche', 'La Salle', 'Lincoln', 'Livingston',
  'Madison', 'Morehouse', 'Natchitoches', 'Orleans', 'Ouachita',
  'Plaquemines', 'Pointe Coupee', 'Rapides', 'Red River', 'Richland',
  'Sabine', 'St. Bernard', 'St. Charles', 'St. Helena', 'St. James',
  'St. John the Baptist', 'St. Landry', 'St. Martin', 'St. Mary',
  'St. Tammany', 'Tangipahoa', 'Tensas', 'Terrebonne', 'Union',
  'Vermilion', 'Vernon', 'Washington', 'Webster', 'West Baton Rouge',
  'West Carroll', 'West Feliciana', 'Winn'
];

const CERTIFICATIONS = [
  'Minority Business Enterprise (MBE)',
  'Women Business Enterprise (WBE)',
  'Disadvantaged Business Enterprise (DBE)',
  'Small Business Enterprise (SBE)',
  '8(a) Business Development Program',
  'HUBZone Certified',
  'Veteran-Owned Small Business (VOSB)',
  'Service-Disabled Veteran-Owned Small Business (SDVOSB)',
  'LGBT Business Enterprise (LGBTBE)',
  'Disability-Owned Business Enterprise (DOBE)',
  'B Corporation Certified',
  'Louisiana Hudson Initiative Certified'
];

function AddBusiness() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    business_name: '',
    owner_name: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    category: '',
    description: '',
    address: '',
    city: '',
    parish: '',
    zip_code: '',
    website: '',
    organization_type: 'for-profit',
    certifications: [],
    social_media: { facebook: '', instagram: '', linkedin: '', twitter: '' },
    hours_of_operation: '',
    services_offered: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialMedia = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      social_media: { ...prev.social_media, [platform]: value }
    }));
  };

  const handleCertificationToggle = (cert) => {
    setFormData(prev => {
      const isSelected = prev.certifications.includes(cert);
      return {
        ...prev,
        certifications: isSelected
          ? prev.certifications.filter(c => c !== cert)
          : [...prev.certifications, cert]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!user) {
      setError('You must be logged in to add a business');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const servicesArray = formData.services_offered.split(',').map(s => s.trim()).filter(Boolean);
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/businesses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          services_offered: servicesArray,
          user_id: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit business');
      }

      setSuccess(true);
      setTimeout(() => navigate('/businesses'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <AlertCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="text-gray-600 mb-6">You must be logged in to add your business to the directory.</p>
        <Button onClick={() => navigate('/login')} className="bg-gradient-to-r from-[#A4D65E] to-[#006847]">
          Login / Sign Up
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <motion.div 
        className="max-w-2xl mx-auto text-center py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <CheckCircle2 className="h-20 w-20 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Business Submitted Successfully!</h2>
        <p className="text-gray-600 mb-2">Your business listing is pending approval.</p>
        <p className="text-sm text-gray-500">Our team will review it shortly. Redirecting to directory...</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <Building2 className="h-12 w-12 text-[#006847]" />
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
              Add Your Business
            </span>
          </h1>
        </div>
        <p className="text-xl text-gray-600">Join Louisiana's premier business directory</p>
      </motion.div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Tell us about your business or organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="business_name">Business/Organization Name *</Label>
                <Input
                  id="business_name"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="owner_name">Owner/Contact Name *</Label>
                <Input
                  id="owner_name"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(555) 555-5555"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organization_type">Organization Type *</Label>
                <Select value={formData.organization_type} onValueChange={(value) => setFormData(prev => ({ ...prev, organization_type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="for-profit">For-Profit Company</SelectItem>
                    <SelectItem value="non-profit">Non-Profit Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your business, products, or services..."
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="parish">Parish *</Label>
                <Select value={formData.parish} onValueChange={(value) => setFormData(prev => ({ ...prev, parish: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parish" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {LOUISIANA_PARISHES.map(parish => (
                      <SelectItem key={parish} value={parish}>{parish}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="zip_code">ZIP Code *</Label>
                <Input
                  id="zip_code"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>Official Certifications (Optional)</CardTitle>
            <CardDescription>Select any nationally recognized certifications your business holds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert} className="flex items-start space-x-2">
                  <Checkbox
                    id={cert}
                    checked={formData.certifications.includes(cert)}
                    onCheckedChange={() => handleCertificationToggle(cert)}
                  />
                  <label htmlFor={cert} className="text-sm leading-tight cursor-pointer">
                    {cert}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="hours_of_operation">Hours of Operation</Label>
              <Input
                id="hours_of_operation"
                name="hours_of_operation"
                placeholder="Mon-Fri: 9am-6pm"
                value={formData.hours_of_operation}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="services_offered">Services Offered (comma-separated)</Label>
              <Input
                id="services_offered"
                name="services_offered"
                placeholder="Service 1, Service 2, Service 3"
                value={formData.services_offered}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input
                id="facebook"
                placeholder="https://facebook.com/yourbusiness"
                value={formData.social_media.facebook}
                onChange={(e) => handleSocialMedia('facebook', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/yourbusiness"
                value={formData.social_media.instagram}
                onChange={(e) => handleSocialMedia('instagram', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/company/yourbusiness"
                value={formData.social_media.linkedin}
                onChange={(e) => handleSocialMedia('linkedin', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter/X URL</Label>
              <Input
                id="twitter"
                placeholder="https://twitter.com/yourbusiness"
                value={formData.social_media.twitter}
                onChange={(e) => handleSocialMedia('twitter', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90 px-12"
            size="lg"
          >
            {loading ? 'Submitting...' : 'Submit Business for Approval'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddBusiness;