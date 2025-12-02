import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Store, Package, TrendingUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

function Shop() {
  const [cart, setCart] = useState([]);

  const merchCategories = [
    { name: 'Apparel', icon: '👕', items: 8, description: 'T-shirts, hoodies, and branded clothing' },
    { name: 'Accessories', icon: '🎒', description: 'Bags, hats, and lifestyle accessories', items: 12 },
    { name: 'Office & Tech', icon: '💻', description: 'Notebooks, stickers, and tech gear', items: 6 },
    { name: 'Books & Media', icon: '📚', description: 'Educational materials and resources', items: 4 }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'DowUrk Shield T-Shirt',
      description: 'Premium cotton tee with embroidered DowUrk shield logo',
      price: 29.99,
      image: 'https://customer-assets.emergentagent.com/job_equity-focus/artifacts/875dlk3n_dowurk_color_shield.png',
      category: 'Apparel'
    },
    {
      id: 2,
      name: 'Cultivating Originality Hoodie',
      description: 'Comfortable hoodie with signature tagline',
      price: 49.99,
      image: 'https://customer-assets.emergentagent.com/job_equity-focus/artifacts/875dlk3n_dowurk_color_shield.png',
      category: 'Apparel'
    },
    {
      id: 3,
      name: 'Entrepreneur Starter Kit',
      description: 'Business planner, pen set, and motivational cards',
      price: 39.99,
      image: 'https://customer-assets.emergentagent.com/job_equity-focus/artifacts/875dlk3n_dowurk_color_shield.png',
      category: 'Office & Tech'
    },
    {
      id: 4,
      name: 'DowUrk Tote Bag',
      description: 'Eco-friendly canvas tote with DowUrk branding',
      price: 24.99,
      image: 'https://customer-assets.emergentagent.com/job_equity-focus/artifacts/875dlk3n_dowurk_color_shield.png',
      category: 'Accessories'
    }
  ];

  return (
    <div className="space-y-12" data-testid="shop-page">
      {/* Hero */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center space-x-3">
          <Store className="h-12 w-12 text-[#006847]" />
          <h1 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
              DowUrk Shop
            </span>
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Support DowUrk Inc. and wear your entrepreneurial pride with our exclusive merchandise
        </p>
      </section>

      {/* Coming Soon Alert */}
      <Card className="border-2 border-[#A4D65E] bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-8 text-center space-y-4">
          <Package className="h-16 w-16 text-[#006847] mx-auto" />
          <h2 className="text-2xl font-bold">Shop Coming Soon!</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            We're preparing an amazing collection of DowUrk merchandise and products. 
            Sign up below to be notified when we launch!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 border rounded-lg w-full sm:w-64"
            />
            <Button className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90 w-full sm:w-auto">
              Notify Me
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Preview */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Shop Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {merchCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="text-5xl mb-3 text-center">{category.icon}</div>
                <CardTitle className="text-center">{category.name}</CardTitle>
                <CardDescription className="text-center">{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="secondary">{category.items} Items</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Featured Products (Preview)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100 flex items-center justify-center p-8">
                <img src={product.image} alt={product.name} className="w-32 h-32 object-contain" />
              </div>
              <CardHeader>
                <Badge className="w-fit mb-2 bg-[#A4D65E] text-black">{product.category}</Badge>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold text-[#006847]">${product.price}</div>
                <Button disabled className="w-full" variant="outline">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Virtual Booths CTA */}
      <Card className="bg-gradient-to-r from-[#006847] to-[#005a3c] text-white">
        <CardHeader className="text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4" />
          <CardTitle className="text-3xl mb-3">Interested in Selling Your Products?</CardTitle>
          <CardDescription className="text-white/90 text-lg">
            Join our Virtual Booths marketplace and reach customers across Louisiana and beyond
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link to="/virtual-booths">
            <Button size="lg" variant="secondary" className="bg-white text-[#006847] hover:bg-gray-100">
              Learn About Virtual Booths <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default Shop;
