import React from 'react';
import './css/PolicyPage.css'; // Create a new CSS file for styling

const PrivacyPolicy = () => {
  return (
    <div className="policy-container">
      <h2>Privacy Policy for Sentiment Sense</h2>
      <p><strong>Effective Date:</strong> 1 January 2026</p>
      <p>At Sentiment Sense, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our services.</p>
      
      <h3>1. Information We Collect</h3>
      <ul>
        <li><strong>Personal Information:</strong> When you sign up for an account, we may ask for information such as your name, email address, and any other data you provide.</li>
        <li><strong>Google Sign-In Information:</strong> If you sign up or log in using Google, we may collect your Google profile information, including your name and email address.</li>
        <li><strong>Usage Data:</strong> We collect data about your usage of the app, including but not limited to device information, log data, and other diagnostic information.</li>
      </ul>

      <h3>2. How We Use Your Information</h3>
      <ul>
        <li>Provide and maintain our services.</li>
        <li>Improve our app and services.</li>
        <li>Communicate with you, including sending updates and promotional materials (if you've opted in).</li>
        <li>Process transactions and provide customer support.</li>
      </ul>

      <h3>3. Data Sharing and Disclosure</h3>
      <p>We do not sell or share your personal information with third parties except:</p>
      <ul>
        <li>With your consent.</li>
        <li>To comply with legal obligations.</li>
        <li>With third-party service providers (e.g., for hosting and analytics) who assist in providing our services.</li>
      </ul>

      <h3>4. Security of Your Data</h3>
      <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

      <h3>5. Your Rights</h3>
      <ul>
        <li>Access, correct, or delete your personal information.</li>
        <li>Withdraw your consent at any time.</li>
        <li>Opt out of promotional emails by clicking the unsubscribe link in our emails.</li>
      </ul>

      <h3>6. Third-Party Links</h3>
      <p>Our app may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.</p>

      <h3>7. Changes to This Privacy Policy</h3>
      <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page.</p>

      <h3>8. Contact Us</h3>
      <p>If you have any questions about this Privacy Policy or your data, please contact us at sensesentiment@gmail.com</p>
    </div>
  );
};

export default PrivacyPolicy;
