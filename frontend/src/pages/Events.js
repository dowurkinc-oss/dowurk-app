import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeBadgeColor = (type) => {
    const colors = {
      workshop: 'bg-blue-100 text-blue-800',
      training: 'bg-purple-100 text-purple-800',
      networking: 'bg-green-100 text-green-800',
      webinar: 'bg-orange-100 text-orange-800',
      conference: 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8" data-testid="events-page">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Events & Training</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join workshops, networking events, and training programs designed for Louisiana entrepreneurs
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#006847]"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {events.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-600">
                No upcoming events at this time. Check back soon!
              </CardContent>
            </Card>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow" data-testid="event-card">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-3 md:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-2xl">{event.title}</CardTitle>
                        <Badge className={getEventTypeBadgeColor(event.event_type)}>
                          {event.event_type}
                        </Badge>
                      </div>
                      <CardDescription className="text-base">{event.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 mr-3 text-[#006847]" />
                      <div>
                        <p className="font-semibold">
                          {format(new Date(event.start_time), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-5 w-5 mr-3 text-[#006847]" />
                      <div>
                        <p className="font-semibold">
                          {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-3 text-[#006847]" />
                      <p>{event.location}</p>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="h-5 w-5 mr-3 text-[#006847]" />
                      <p>
                        {event.attendees.length} {event.max_attendees ? `/ ${event.max_attendees}` : ''} attending
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-gray-600">Organized by: <span className="font-semibold">{event.organizer}</span></p>
                    {event.registration_link && (
                      <Button 
                        onClick={() => window.open(event.registration_link, '_blank')}
                        className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90"
                        data-testid="register-button"
                      >
                        Register Now <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Events;
