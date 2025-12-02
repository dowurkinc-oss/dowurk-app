import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Phone, Globe, Star, Filter } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function BusinessDirectory() {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedParish, setSelectedParish] = useState('all');

  const categories = ['all', 'food', 'technology', 'retail', 'service', 'creative'];
  const parishes = ['all', 'Orleans', 'East Baton Rouge', 'Lafayette', 'Caddo', 'Tangipahoa'];

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    filterBusinesses();
  }, [searchTerm, selectedCategory, selectedParish, businesses]);

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get(`${API}/businesses`);
      setBusinesses(response.data);
      setFilteredBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBusinesses = () => {
    let filtered = businesses;

    if (searchTerm) {
      filtered = filtered.filter(biz => 
        biz.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        biz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(biz => biz.category === selectedCategory);
    }

    if (selectedParish !== 'all') {
      filtered = filtered.filter(biz => biz.parish === selectedParish);
    }

    setFilteredBusinesses(filtered);
  };

  return (
    <div className="space-y-8" data-testid="business-directory">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Louisiana Business Directory</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover and support Black-owned and underrepresented businesses across Louisiana
        </p>
      </div>

      {/* Filters */}
      <Card data-testid="filter-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger data-testid="category-filter">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedParish} onValueChange={setSelectedParish}>
              <SelectTrigger data-testid="parish-filter">
                <SelectValue placeholder="Parish" />
              </SelectTrigger>
              <SelectContent>
                {parishes.map(parish => (
                  <SelectItem key={parish} value={parish}>
                    {parish === 'all' ? 'All Parishes' : parish}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600" data-testid="results-count">
          Showing <span className="font-semibold">{filteredBusinesses.length}</span> business{filteredBusinesses.length !== 1 ? 'es' : ''}
        </p>
      </div>

      {/* Business Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#006847]"></div>
          <p className="mt-4 text-gray-600">Loading businesses...</p>
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <Alert>
          <AlertDescription>
            No businesses found matching your criteria. Try adjusting your filters.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow" data-testid="business-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{business.business_name}</CardTitle>
                    <Badge className="bg-[#A4D65E] text-black hover:bg-[#A4D65E]">
                      {business.category}
                    </Badge>
                  </div>
                  {business.is_verified && (
                    <Badge variant="outline" className="ml-2 border-[#006847] text-[#006847]">
                      Verified
                    </Badge>
                  )}
                </div>
                {business.rating > 0 && (
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm font-semibold">{business.rating}</span>
                    <span className="ml-1 text-sm text-gray-500">({business.review_count} reviews)</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-3">{business.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {business.city}, {business.parish} Parish
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {business.phone}
                  </div>
                  {business.website && (
                    <div className="flex items-center text-gray-600">
                      <Globe className="h-4 w-4 mr-2" />
                      <a 
                        href={business.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#006847] hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                {business.services_offered.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {business.services_offered.slice(0, 3).map((service, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default BusinessDirectory;
