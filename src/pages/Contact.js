import React, { useState, useRef,useContext } from 'react';
import './css/Contact.css'; // Import your CSS file
import Loading from './Loading';
import { useToast } from "../context/ToastContext";
import { AuthContext } from '../context/AuthContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false); // New state to track loading
  const form = useRef();
  const { showToast } = useToast();
  const { host } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    })); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setIsLoading(true); // Set loading to true when submitting
  
    try {
      const response = await fetch(`${host}/email/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: `Message from ${formData.name} at Sentiment Sense Contact`,
          email: formData.email,
          body: formData.message,
        }),
      });
  
      // Check if status is 429 (Too Many Requests)
      if (response.status === 429) {
        console.log("Rate limit exceeded. Showing toast.");
        showToast("Too Many requests for today", "warning");
        setIsLoading(false); // Hide loading spinner
        return; // Prevent further execution
      }
  
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
  
      setIsLoading(false); // Hide loading spinner
      showToast('Message sent successfully! You will receive an auto-reply shortly.', 'success');
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } catch (error) {
      setIsLoading(false); // Hide loading spinner
      showToast('Something went wrong. Please try again later.', 'error');
      console.error('Message failed...', error);
    }
  };
  

  return (
    <section className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Please fill out the form below, and we'll get back to you as soon as possible.</p>
      </div>

      <div className="contact-form-container">
        <form ref={form} className="contact-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email address"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we help?"
              required
              ></textarea>
          </div>
              {isLoading && <Loading />}

          <div className="form-footer">
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>

      

      <div className="contact-info">
        <h3>Contact Information</h3>
        <ul>
          <li>
            <strong>Email:</strong> sensesentiment@gmail.com
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Contact;
