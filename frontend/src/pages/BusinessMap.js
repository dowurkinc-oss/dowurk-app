import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Globe, Mail, Navigation, Filter, Star } from 'lucide-react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom green marker
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Louisiana center coordinates
const LA_CENTER = [31.0, -91.9];

// Parish coordinates with actual locations
const PARISH_COORDS = {
  'Orleans': [29.95, -90.07],
  'East Baton Rouge': [30.45, -91.15],
  'Caddo': [32.50, -93.75],
  'Lafayette': [30.22, -92.02],
  'Calcasieu': [30.23, -93.34],
  'Jefferson': [29.70, -90.15],
  'Tangipahoa': [30.63, -90.48],
  'St. Tammany': [30.38, -89.98],
  'Ouachita': [32.48, -92.13],
  'Rapides': [31.18, -92.48],
  'Terrebonne': [29.38, -90.77],
  'Bossier': [32.62, -93.60],
  'Lincoln': [32.60, -92.65],
  'Natchitoches': [31.70, -93.10]
};

function BusinessMap() {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    filterBusinesses();
  }, [searchTerm, selectedCategory, businesses]);

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get(`${API}/businesses`);
      // Add coordinates to each business
      const businessesWithCoords = response.data.map(b => ({
        ...b,
        coordinates: PARISH_COORDS[b.parish] || LA_CENTER
      }));
      setBusinesses(businessesWithCoords);
      setFilteredBusinesses(businessesWithCoords);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBusinesses = () => {
    let filtered = businesses;

    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.parish.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => b.category === selectedCategory);
    }

    setFilteredBusinesses(filtered);
  };

  const categories = ['all', ...new Set(businesses.map(b => b.category))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-bold">
          <span className="bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
            Interactive Louisiana Business Map
          </span>
        </h1>
        <p className="text-xl text-gray-600">
          Discover {filteredBusinesses.length} businesses across the Pelican State
        </p>
      </motion.div>

      {/* Search & Filter */}
      <Card className="border-2 border-[#A4D65E] relative z-10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Find Businesses Near You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search by business name, city, or parish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="relative z-[100]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="relative z-[100]">
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <Card className="border-2 border-[#A4D65E] overflow-hidden">
            <CardContent className="p-0">
              {!loading && (
                <MapContainer 
                  center={LA_CENTER} 
                  zoom={7} 
                  style={{ height: '600px', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {filteredBusinesses.map((business) => (
                    <Marker 
                      key={business.id}
                      position={business.coordinates}
                      icon={greenIcon}
                      eventHandlers={{
                        click: () => setSelectedBusiness(business)
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <h3 className="font-bold text-[#006847] mb-1">{business.business_name}</h3>
                          <Badge className="mb-2 bg-[#A4D65E] text-black text-xs">
                            {business.category}
                          </Badge>
                          <p className="text-xs text-gray-600 mb-2">{business.description}</p>
                          <div className="space-y-1 text-xs">
                            <p><strong>Location:</strong> {business.city}, {business.parish}</p>
                            {business.phone && <p><strong>Phone:</strong> {business.phone}</p>}
                          </div>
                          {business.website && (
                            <a 
                              href={business.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#006847] hover:underline text-xs mt-2 inline-block"
                            >
                              Visit Website →
                            </a>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </CardContent>
          </Card>
          
          {/* Map Instructions */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Navigation className="h-4 w-4 mr-2" />
              How to Use the Map
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Zoom:</strong> Use mouse wheel or +/- buttons</li>
              <li>• <strong>Pan:</strong> Click and drag to move around Louisiana</li>
              <li>• <strong>View Business:</strong> Click green pins for details</li>
              <li>• <strong>Filter:</strong> Use search or category dropdown above</li>
              <li>• <strong>Navigate:</strong> Click "Get Directions" in popup for Google Maps</li>
            </ul>
          </div>
        </div>

        {/* Selected Business Panel */}
        <div className="lg:col-span-1">
          {selectedBusiness ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-2 border-[#A4D65E] sticky top-24">
                <CardHeader className="bg-gradient-to-r from-[#A4D65E]/10 to-[#006847]/10">
                  <div className="flex items-start justify-between">
                    <Badge className="bg-[#A4D65E] text-black mb-2">
                      {selectedBusiness.category}
                    </Badge>
                    {selectedBusiness.is_verified && (
                      <Badge variant="outline" className="border-green-600 text-green-600">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{selectedBusiness.business_name}</CardTitle>
                  <p className="text-sm text-gray-600">{selectedBusiness.owner_name}</p>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <p className="text-sm text-gray-700">{selectedBusiness.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-5 w-5 text-[#006847] flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p>{selectedBusiness.address}</p>
                        <p>{selectedBusiness.city}, {selectedBusiness.parish} {selectedBusiness.zip_code}</p>
                      </div>
                    </div>
                    
                    {selectedBusiness.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-5 w-5 text-[#006847]" />
                        <a href={`tel:${selectedBusiness.phone}`} className="text-sm hover:text-[#A4D65E]">
                          {selectedBusiness.phone}
                        </a>
                      </div>
                    )}
                    
                    {selectedBusiness.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-[#006847]" />
                        <a href={`mailto:${selectedBusiness.email}`} className="text-sm hover:text-[#A4D65E]">
                          {selectedBusiness.email}
                        </a>
                      </div>
                    )}
                    
                    {selectedBusiness.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-[#006847]" />
                        <a 
                          href={selectedBusiness.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm hover:text-[#A4D65E]"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}

                    {selectedBusiness.rating > 0 && (
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                        <span className="text-sm font-semibold">
                          {selectedBusiness.rating} ({selectedBusiness.review_count} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedBusiness.services_offered && selectedBusiness.services_offered.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Services:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedBusiness.services_offered.map((service, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-[#A4D65E] to-[#006847]"
                    onClick={() => window.open(
                      `https://www.google.com/maps/dir//${selectedBusiness.address}, ${selectedBusiness.city}, LA`,
                      '_blank'
                    )}
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="border-2 border-gray-200 h-full flex items-center justify-center sticky top-24">
              <CardContent className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Click a green pin on the map</p>
                <p className="text-xs text-gray-400">to see business details and get directions</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Businesses', value: businesses.length, icon: '🏢' },
          { label: 'Parishes Covered', value: new Set(businesses.map(b => b.parish)).size, icon: '🗺️' },
          { label: 'Categories', value: new Set(businesses.map(b => b.category)).size, icon: '📊' },
          { label: 'Showing Now', value: filteredBusinesses.length, icon: '📍' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-[#006847]">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default BusinessMap;