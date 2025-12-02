import { Facebook, Twitter, Linkedin, Link2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function SocialShare({ url, title, description }) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = encodeURIComponent(url || window.location.href);
  const shareTitle = encodeURIComponent(title || 'Check this out on The DowUrk FramewUrk!');
  const shareText = encodeURIComponent(description || '');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 font-semibold">Share:</span>
      
      <a 
        href={shareLinks.facebook} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-blue-50 transition"
        title="Share on Facebook"
      >
        <Facebook className="h-5 w-5 text-blue-600" />
      </a>
      
      <a 
        href={shareLinks.twitter} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-sky-50 transition"
        title="Share on Twitter"
      >
        <Twitter className="h-5 w-5 text-sky-500" />
      </a>
      
      <a 
        href={shareLinks.linkedin} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-blue-50 transition"
        title="Share on LinkedIn"
      >
        <Linkedin className="h-5 w-5 text-blue-700" />
      </a>
      
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-full hover:bg-gray-100 transition"
        title="Copy link"
      >
        {copied ? (
          <Check className="h-5 w-5 text-green-600" />
        ) : (
          <Link2 className="h-5 w-5 text-gray-600" />
        )}
      </button>
    </div>
  );
}

export default SocialShare;
