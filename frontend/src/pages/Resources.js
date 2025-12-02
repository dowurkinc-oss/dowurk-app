import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Video, FileText, Download, Eye, Star, ExternalLink } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function Resources() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const categories = ['all', 'business_planning', 'marketing', 'finance', 'legal', 'technology'];
  const types = ['all', 'video', 'article', 'course', 'template', 'tool', 'podcast'];

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [selectedCategory, selectedType, resources]);

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${API}/resources`);
      setResources(response.data);
      setFilteredResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(res => res.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(res => res.resource_type === selectedType);
    }

    setFilteredResources(filtered);
  };

  const getResourceIcon = (type) => {
    const icons = {
      video: <Video className="h-6 w-6 text-[#006847]" />,
      article: <FileText className="h-6 w-6 text-[#006847]" />,
      course: <BookOpen className="h-6 w-6 text-[#006847]" />,
      template: <Download className="h-6 w-6 text-[#006847]" />,
      podcast: <Video className="h-6 w-6 text-[#006847]" />,
      tool: <Star className="h-6 w-6 text-[#006847]" />
    };
    return icons[type] || <BookOpen className="h-6 w-6 text-[#006847]" />;
  };

  return (
    <div className="space-y-8" data-testid="resources-page">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Learning Library</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Access courses, templates, guides, and resources to build and grow your business
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Resources</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger data-testid="category-filter">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger data-testid="type-filter">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {types.map(type => (
                <SelectItem key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#006847]"></div>
          <p className="mt-4 text-gray-600">Loading resources...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow" data-testid="resource-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div>{getResourceIcon(resource.resource_type)}</div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{resource.title}</CardTitle>
                      <div className="flex space-x-2 mb-3">
                        <Badge className="bg-[#A4D65E] text-black">{resource.resource_type}</Badge>
                        <Badge variant="outline">
                          {resource.category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {resource.featured && (
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  )}
                </div>
                <CardDescription className="text-base">{resource.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {resource.views} views
                    </div>
                    {resource.downloads > 0 && (
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {resource.downloads} downloads
                      </div>
                    )}
                  </div>
                </div>

                {resource.url && (
                  <Button 
                    onClick={() => window.open(resource.url, '_blank')}
                    className="w-full bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90"
                    data-testid="access-button"
                  >
                    Access Resource <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                )}

                {resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.slice(0, 4).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
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

export default Resources;
