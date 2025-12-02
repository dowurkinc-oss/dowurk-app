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
                DowUrk H.U.B.
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
              <h3 className="text-lg font-bold mb-4">DowUrk H.U.B.</h3>
              <p className="text-gray-400 text-sm">
                Empowering Louisiana's underrepresented entrepreneurs through technology, community, and opportunity.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/businesses" className="hover:text-white">Business Directory</Link></li>
                <li><Link to="/ai-assistant" className="hover:text-white">AI Assistant</Link></li>
                <li><Link to="/events" className="hover:text-white">Events</Link></li>
                <li><Link to="/resources" className="hover:text-white">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">About</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About DowUrk</a></li>
                <li><a href="#" className="hover:text-white">Our Mission</a></li>
                <li><a href="#" className="hover:text-white">Partners</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Connect</h4>
              <p className="text-gray-400 text-sm mb-3">45398 Shadowood Dr.<br />Hammond, LA 70401</p>
              <p className="text-gray-400 text-sm">info@dowurktoday.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 DowUrk Inc. All rights reserved. | Cultivating Originality.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
