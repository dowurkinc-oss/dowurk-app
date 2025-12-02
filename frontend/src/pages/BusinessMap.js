import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Globe, ExternalLink, Building2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Louisiana parish coordinates (approximate centers)
const PARISH_COORDS = {
  'Orleans': { lat: 29.95, lng: -90.07 },
  'East Baton Rouge': { lat: 30.45, lng: -91.15 },
  'Caddo': { lat: 32.50, lng: -93.75 },
  'Lafayette': { lat: 30.22, lng: -92.02 },
  'Calcasieu': { lat: 30.23, lng: -93.34 },
  'Jefferson': { lat: 29.70, lng: -90.15 },
  'Tangipahoa': { lat: 30.63, lng: -90.48 },
  'St. Tammany': { lat: 30.38, lng: -89.98 },
  'Ouachita': { lat: 32.48, lng: -92.13 },
  'Rapides': { lat: 31.18, lng: -92.48 }
};

function BusinessMap() {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get(`${API}/businesses`);
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getParishPosition = (parish) => {
    return PARISH_COORDS[parish] || { lat: 30.5, lng: -91.5 }; // Default to center LA
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">
          <span className="bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
            Louisiana Business Map
          </span>
        </h1>
        <p className="text-xl text-gray-600">
          Explore {businesses.length} businesses across the Pelican State
        </p>
      </div>

      {/* Visual Map Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="border-2 border-[#A4D65E] overflow-hidden">
            <CardContent className="p-0">
              <div className="relative bg-gradient-to-br from-blue-50 to-green-50 h-[600px] overflow-hidden">
                {/* Louisiana Outline SVG */}
                <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full opacity-20">
                  <path d="M 50 150 Q 100 100 200 120 T 350 150 Q 340 200 280 220 T 100 210 Z" 
                        fill="#006847" stroke="#A4D65E" strokeWidth="2" />
                </svg>
                
                {/* Business Pins */}
                {businesses.map((business, index) => {
                  const pos = getParishPosition(business.parish);
                  const x = ((pos.lng + 94) / 4) * 100; // Normalize to 0-100%
                  const y = ((32 - pos.lat) / 3) * 100;
                  
                  return (
                    <motion.div
                      key={business.id}
                      className="absolute cursor-pointer group"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.01 }}
                      whileHover={{ scale: 1.5, zIndex: 10 }}
                      onClick={() => setSelectedBusiness(business)}
                    >
                      <MapPin className="h-8 w-8 text-[#006847] drop-shadow-lg" fill="#A4D65E" />
                      <div className="absolute hidden group-hover:block bg-white p-2 rounded shadow-lg -top-12 left-6 w-48 text-xs z-20">
                        <p className="font-semibold">{business.business_name}</p>
                        <p className="text-gray-600">{business.city}, {business.parish}</p>
                      </div>
                    </motion.div>
                  );
                })}
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-5 w-5 text-[#006847]" fill="#A4D65E" />
                    <span className="font-semibold">{businesses.length} Businesses</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Click pins for details</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Business Details */}
        <div className="lg:col-span-1">
          {selectedBusiness ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-2 border-[#A4D65E] sticky top-24">
                <CardHeader className="bg-gradient-to-r from-[#A4D65E]/10 to-[#006847]/10">
                  <Badge className="w-fit mb-2 bg-[#A4D65E] text-black">
                    {selectedBusiness.category}
                  </Badge>
                  <CardTitle className="text-xl">{selectedBusiness.business_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
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
                  
                  {selectedBusiness.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-[#006847]" />
                      <a 
                        href={selectedBusiness.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm hover:text-[#A4D65E] flex items-center"
                      >
                        Visit Website <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedBusiness.description}
                  </p>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-[#A4D65E] to-[#006847]"
                    onClick={() => window.location.href = `/businesses`}
                  >
                    View Full Directory
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="border-2 border-gray-200 h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Click a pin on the map to see business details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Businesses', value: businesses.length },
          { label: 'Parishes Covered', value: new Set(businesses.map(b => b.parish)).size },
          { label: 'Categories', value: new Set(businesses.map(b => b.category)).size },
          { label: 'Cities', value: new Set(businesses.map(b => b.city)).size }
        ].map((stat, i) => (
          <Card key={i} className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-[#006847]">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default BusinessMap;
