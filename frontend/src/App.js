import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import MetricsDashboard from "./components/MetricsDashboard";
import DocsViewer from "./components/DocsViewer";

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
        
        <div className="mt-8 space-x-4">
          <Link 
            to="/metrics" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📊 View Metrics Dashboard
          </Link>
          <Link 
            to="/docs" 
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            📚 Strategic Resources
          </Link>
        </div>

        <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 Fundraising Strategy</h3>
            <p className="text-sm text-gray-600">Complete roadmap to $1B valuation with pitch deck framework</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔒 Security Implementation</h3>
            <p className="text-sm text-gray-600">Enterprise-grade security features ready for SOC 2</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Competitive Analysis</h3>
            <p className="text-sm text-gray-600">Deep market intelligence and positioning framework</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
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
          <Route path="/metrics" element={<MetricsDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
