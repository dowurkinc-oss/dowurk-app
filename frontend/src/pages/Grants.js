import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Calendar, CheckCircle, ExternalLink, Building2 } from 'lucide-react';
import { format } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function Grants() {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrants();
  }, []);

  const fetchGrants = async () => {
    try {
      const response = await axios.get(`${API}/grants`);
      setGrants(response.data);
    } catch (error) {
      console.error('Error fetching grants:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8" data-testid="grants-page">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Grants & Funding Opportunities</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find and apply for grants, loans, and funding opportunities specifically for Louisiana businesses
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#006847]"></div>
          <p className="mt-4 text-gray-600">Loading grants...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grants.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-600">
                No active grants at this time. Check back soon!
              </CardContent>
            </Card>
          ) : (
            grants.map((grant) => (
              <Card key={grant.id} className="hover:shadow-lg transition-shadow" data-testid="grant-card">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-3 md:space-y-0">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{grant.title}</CardTitle>
                      <div className="flex items-center space-x-2 mb-3">
                        <Building2 className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-600 font-semibold">{grant.organization}</span>
                      </div>
                      <CardDescription className="text-base">{grant.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="h-5 w-5 mr-3 text-[#006847]" />
                      <div>
                        <p className="text-sm text-gray-600">Funding Amount</p>
                        <p className="font-semibold">{grant.amount_range}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 mr-3 text-[#006847]" />
                      <div>
                        <p className="text-sm text-gray-600">Application Deadline</p>
                        <p className="font-semibold">
                          {format(new Date(grant.deadline), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-[#006847]" />
                      Eligibility Requirements
                    </h4>
                    <ul className="space-y-2">
                      {grant.eligibility.map((req, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-[#A4D65E] mr-2">•</span>
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {grant.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {grant.categories.map((category, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      {Math.ceil((new Date(grant.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                    </p>
                    <Button 
                      onClick={() => window.open(grant.application_link, '_blank')}
                      className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90"
                      data-testid="apply-button"
                    >
                      Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Grants;
