import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto space-y-8" data-testid="privacy-policy-page">
      {/* Hero */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center space-x-3">
          <Shield className="h-12 w-12 text-[#006847]" />
          <h1 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
        </div>
        <p className="text-lg text-gray-600">
          Last Updated: January 15, 2025
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Our Commitment to Your Privacy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none">
          <p>
            At DowUrk Inc. ("we," "our," or "us"), we are committed to protecting your privacy and ensuring 
            the security of your personal information. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you visit our website and use our services.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Eye className="h-6 w-6 text-[#006847]" />
            <CardTitle className="text-xl">Information We Collect</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
            <p className="text-gray-700">
              When you register for an account, we may collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Name and contact information (email, phone number)</li>
              <li>Business information (business name, address, industry)</li>
              <li>Account credentials (username, encrypted password)</li>
              <li>Profile information (bio, interests, photo)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Automatically Collected Information</h3>
            <p className="text-gray-700">
              When you use our website, we automatically collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">AI Interaction Data</h3>
            <p className="text-gray-700">
              When you use our AI assistant:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Conversation history (stored temporarily)</li>
              <li>Questions asked and responses generated</li>
              <li>Feature usage patterns</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-[#006847]" />
            <CardTitle className="text-xl">How We Use Your Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">We use your information to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Provide and maintain our services</li>
            <li>Process your registration and manage your account</li>
            <li>Send you important updates and notifications</li>
            <li>Improve our AI assistant and other features</li>
            <li>Analyze usage patterns to enhance user experience</li>
            <li>Prevent fraud and ensure security</li>
            <li>Comply with legal obligations</li>
            <li>Send marketing communications (with your consent)</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Lock className="h-6 w-6 text-[#006847]" />
            <CardTitle className="text-xl">Data Security</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            We implement appropriate technical and organizational security measures to protect your 
            personal information, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Encryption of sensitive data (passwords, payment information)</li>
            <li>Secure servers and databases</li>
            <li>Regular security audits and monitoring</li>
            <li>Limited access to personal information by authorized personnel only</li>
            <li>Secure communication protocols (HTTPS/SSL)</li>
          </ul>
          <p className="text-gray-700 italic">
            However, no method of transmission over the internet is 100% secure. While we strive to 
            protect your information, we cannot guarantee absolute security.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Cookies and Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            We use cookies and similar tracking technologies to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Remember your preferences and settings</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Provide personalized content and recommendations</li>
            <li>Improve website performance and functionality</li>
          </ul>
          <p className="text-gray-700">
            You can control cookies through your browser settings. However, disabling cookies may 
            limit certain features of our website.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Third-Party Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            We use trusted third-party services to operate our platform:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>OpenAI</strong> - Powers our AI assistant (governed by OpenAI's privacy policy)</li>
            <li><strong>MongoDB Atlas</strong> - Secure database hosting</li>
            <li><strong>Stripe</strong> - Payment processing (if applicable)</li>
            <li><strong>Google Analytics</strong> - Website analytics</li>
          </ul>
          <p className="text-gray-700">
            These services have their own privacy policies and we encourage you to review them.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Your Rights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Access</strong> your personal information</li>
            <li><strong>Correct</strong> inaccurate or incomplete information</li>
            <li><strong>Delete</strong> your account and personal data</li>
            <li><strong>Export</strong> your data in a portable format</li>
            <li><strong>Opt-out</strong> of marketing communications</li>
            <li><strong>Object</strong> to certain data processing activities</li>
          </ul>
          <p className="text-gray-700 mt-4">
            To exercise these rights, please contact us at{' '}
            <a href="mailto:privacy@dowurktoday.com" className="text-[#006847] font-semibold hover:underline">
              privacy@dowurktoday.com
            </a>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Children's Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Our services are not intended for children under 13 years of age. We do not knowingly 
            collect personal information from children under 13. If you believe we have collected 
            information from a child under 13, please contact us immediately.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Changes to This Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify you of any changes by 
            posting the new policy on this page and updating the "Last Updated" date. We encourage you 
            to review this policy periodically.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-[#A4D65E]/10 to-[#006847]/10">
        <CardHeader>
          <CardTitle className="text-xl">Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>DowUrk Inc.</strong></p>
            <p>45398 Shadowood Dr.<br />Hammond, LA 70401</p>
            <p>Email: <a href="mailto:privacy@dowurktoday.com" className="text-[#006847] font-semibold hover:underline">privacy@dowurktoday.com</a></p>
            <p>Phone: 985-351-8873</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-600 pb-8">
        <p>
          <strong>EIN:</strong> 81-3555399 | <strong>501(c)(3) Nonprofit Organization</strong>
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
