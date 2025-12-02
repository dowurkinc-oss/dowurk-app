import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import ChatbotWidget from '@/components/ChatbotWidget';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="https://customer-assets.emergentagent.com/job_equity-focus/artifacts/875dlk3n_dowurk_color_shield.png" 
                alt="DowUrk Logo" 
                className="h-10 w-10"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
                The DowUrk FramewUrk
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-5">
              <Link to="/about" className="text-gray-700 hover:text-[#006847] transition">
                About
              </Link>
              <Link to="/businesses" className="text-gray-700 hover:text-[#006847] transition">
                Businesses
              </Link>
              <Link to="/ai-assistant" className="text-gray-700 hover:text-[#006847] transition">
                AI Assistant
              </Link>
              <Link to="/events" className="text-gray-700 hover:text-[#006847] transition">
                Events
              </Link>
              <Link to="/resources" className="text-gray-700 hover:text-[#006847] transition">
                Resources
              </Link>
              <Link to="/grants" className="text-gray-700 hover:text-[#006847] transition">
                Grants
              </Link>
              <Link to="/blog" className="text-gray-700 hover:text-[#006847] transition">
                Blog
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-[#006847] transition">
                Shop
              </Link>
              <Link to="/donate" className="text-gray-700 hover:text-[#006847] transition font-semibold">
                Donate
              </Link>

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user.full_name}</span>
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleLogout} 
                    variant="outline" 
                    size="sm"
                    className="border-[#006847] text-[#006847] hover:bg-[#006847] hover:text-white"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="border-[#006847] text-[#006847]">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 space-y-3 border-t border-gray-200">
              <Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                About
              </Link>
              <Link to="/businesses" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Businesses
              </Link>
              <Link to="/ai-assistant" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                AI Assistant
              </Link>
              <Link to="/events" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Events
              </Link>
              <Link to="/resources" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Resources
              </Link>
              <Link to="/grants" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Grants
              </Link>
              <Link to="/shop" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Shop
              </Link>
              <Link to="/donate" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Donate
              </Link>
              <Link to="/community" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Community
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                    Login
                  </Link>
                  <Link to="/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img 
                src="https://customer-assets.emergentagent.com/job_equity-focus/artifacts/875dlk3n_dowurk_color_shield.png" 
                alt="DowUrk Shield" 
                className="h-12 w-12 mb-4"
              />
              <h3 className="text-lg font-bold mb-4">DowUrk Inc.</h3>
              <p className="text-gray-400 text-sm mb-4">
                Empowering Louisiana's underrepresented entrepreneurs through technology, community, and opportunity.
              </p>
              <p className="text-sm font-semibold bg-gradient-to-r from-[#A4D65E] to-white bg-clip-text text-transparent">
                Cultivating Originality.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/businesses" className="hover:text-white">Business Directory</Link></li>
                <li><Link to="/ai-assistant" className="hover:text-white">AI Assistant</Link></li>
                <li><Link to="/events" className="hover:text-white">Events</Link></li>
                <li><Link to="/resources" className="hover:text-white">Resources</Link></li>
                <li><Link to="/grants" className="hover:text-white">Grants</Link></li>
                <li><Link to="/shop" className="hover:text-white">Shop</Link></li>
              </ul>\n            </div>
            <div>
              <h4 className="font-semibold mb-3">Get Involved</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/donate" className="hover:text-white">Donate</Link></li>
                <li><Link to="/community" className="hover:text-white">Community</Link></li>
                <li><Link to="/virtual-booths" className="hover:text-white">Virtual Booths</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link to="/register" className="hover:text-white">Join DowUrk</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Connect With Us</h4>
              <p className="text-gray-400 text-sm mb-3">
                45398 Shadowood Dr.<br />
                Hammond, LA 70401<br />
                <a href="mailto:info@dowurktoday.com" className="hover:text-white">info@dowurktoday.com</a>
              </p>
              <div className="flex space-x-3 mt-4">
                <a href="https://www.facebook.com/DowUrkinc" target="_blank" rel="noopener noreferrer" 
                   className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#A4D65E] transition">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/dowurkinc" target="_blank" rel="noopener noreferrer"
                   className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#A4D65E] transition">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://www.twitter.com/dowurkinc" target="_blank" rel="noopener noreferrer"
                   className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#A4D65E] transition">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="https://www.youtube.com/channel/UCDFERb6RQLbxlErcPrUA94w" target="_blank" rel="noopener noreferrer"
                   className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#A4D65E] transition">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://www.linkedin.com/company/dowurk-inc/" target="_blank" rel="noopener noreferrer"
                   className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#A4D65E] transition">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 DowUrk Inc. All rights reserved. | Cultivating Originality.</p>
          </div>
        </div>
      </footer>
      
      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}

export default Layout;
