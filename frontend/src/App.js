import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import MetricsDashboard from "./components/MetricsDashboard";
import DocsViewer from "./components/DocsViewer";
import AIBusinessAssistant from "./components/AIBusinessAssistant";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="App-header">
        <a
          className="App-link"
          href="https://emergent.sh"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="https://avatars.githubusercontent.com/in/1201222?s=120&u=2686cf91179bbafbc7a71bfbc43004cf9ae1acea&v=4" alt="Emergent" />
        </a>
        <h1 className="text-3xl font-bold text-gray-900 mt-5">DowUrk AI</h1>
        <p className="mt-2 text-gray-600">The AI Operating System for Underserved Entrepreneurs</p>
        
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link 
            to="/register" 
            className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg"
          >
            Get Started Free
          </Link>
          <Link 
            to="/login" 
            className="inline-block px-8 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold text-lg"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link 
            to="/ai-assistant" 
            className="inline-block px-6 py-2 text-purple-600 hover:text-purple-700 transition-colors text-sm"
          >
            🤖 Try AI Assistant
          </Link>
          <Link 
            to="/metrics" 
            className="inline-block px-6 py-2 text-blue-600 hover:text-blue-700 transition-colors text-sm"
          >
            📊 View Metrics
          </Link>
          <Link 
            to="/docs" 
            className="inline-block px-6 py-2 text-indigo-600 hover:text-indigo-700 transition-colors text-sm"
          >
            📚 Resources
          </Link>
        </div>

        <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🤖 AI Business Planning</h3>
            <p className="text-sm text-gray-600">Get expert AI guidance for your business journey</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 Fundraising Strategy</h3>
            <p className="text-sm text-gray-600">Complete roadmap to $1B valuation with pitch deck framework</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔒 Security Implementation</h3>
            <p className="text-sm text-gray-600">Enterprise-grade security features ready for SOC 2</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Metrics Dashboard</h3>
            <p className="text-sm text-gray-600">Track progress toward unicorn status</p>
          </div>
        </div>
      </header>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-assistant" element={<AIBusinessAssistant />} />
          <Route path="/metrics" element={<MetricsDashboard />} />
          <Route path="/docs" element={<DocsViewer />} />
          <Route path="/docs/:docId" element={<DocsViewer />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
