import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit to backend
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-[#006847]" />,
      title: 'Address',
      content: '45398 Shadowood Dr.\nHammond, LA 70401'
    },
    {
      icon: <Mail className="h-6 w-6 text-[#006847]" />,
      title: 'Email',
      content: 'info@dowurktoday.com',
      link: 'mailto:info@dowurktoday.com'
    },
    {
      icon: <Phone className="h-6 w-6 text-[#006847]" />,
      title: 'Phone',
      content: '(985) 224-5714',
      link: 'tel:+19852245714'
    },
    {
      icon: <Clock className="h-6 w-6 text-[#006847]" />,
      title: 'Office Hours',
      content: 'Mon-Fri: 9:00 AM - 6:00 PM CST'
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook className="h-5 w-5" />, url: 'https://www.facebook.com/DowUrkinc' },
    { name: 'Instagram', icon: <Instagram className="h-5 w-5" />, url: 'https://www.instagram.com/dowurkinc' },
    { name: 'Twitter', icon: <Twitter className="h-5 w-5" />, url: 'https://www.twitter.com/dowurkinc' },
    { name: 'LinkedIn', icon: <Linkedin className="h-5 w-5" />, url: 'https://www.linkedin.com/company/dowurk-inc/' },
    { name: 'YouTube', icon: <Youtube className="h-5 w-5" />, url: 'https://www.youtube.com/channel/UCDFERb6RQLbxlErcPrUA94w' }
  ];

  return (
    <div className="space-y-16" data-testid="contact-page">
      {/* Hero */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center space-x-3">
          <MessageSquare className="h-12 w-12 text-[#006847]" />
          <h1 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions? Need support? Want to partner with us? We'd love to hear from you.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          {contactInfo.map((info, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-[#A4D65E]/20 flex items-center justify-center">
                    {info.icon}
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {info.link ? (
                  <a href={info.link} className="text-gray-700 hover:text-[#006847] whitespace-pre-line">
                    {info.content}
                  </a>
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">{info.content}</p>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Social Media */}
          <Card className="bg-gradient-to-r from-[#A4D65E]/10 to-[#006847]/10">
            <CardHeader>
              <CardTitle className="text-lg">Connect With Us</CardTitle>
              <CardDescription>Follow us on social media</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-[#006847] text-white flex items-center justify-center hover:bg-[#A4D65E] hover:text-black transition"
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="border-2 border-[#A4D65E]">
            <CardHeader>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for reaching out. We'll respond to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="(504) 555-0123"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Question</SelectItem>
                          <SelectItem value="consultation">Book a Consultation</SelectItem>
                          <SelectItem value="service">Schedule a Service</SelectItem>
                          <SelectItem value="feedback">Client Feedback</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us more about how we can help..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <section className="bg-gray-50 rounded-2xl p-12 space-y-8">
        <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How can I join the The DowUrk FramewUrk?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Simply click on "Sign Up" in the navigation menu or <a href="/register" className="text-[#006847] font-semibold hover:underline">click here</a> to create your free account.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is DowUrk only for Louisiana businesses?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">While we primarily serve Louisiana, our resources and AI assistant are available to entrepreneurs nationwide. Our grants and events focus on Louisiana.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How do I get my business listed in the directory?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Create an account, then visit your dashboard to submit your business information. We'll review and approve listings within 48 hours.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How can I partner with DowUrk?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">We're always looking for partners! Fill out the contact form above or email us directly at <a href="mailto:info@dowurktoday.com" className="text-[#006847] font-semibold hover:underline">info@dowurktoday.com</a></p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default Contact;
