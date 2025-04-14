import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Signup.css';
import Loading from './Loading'; // Import the Loading component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '../context/ToastContext'; // Importing the toast context
import { useGoogleLogin } from '@react-oauth/google'; // Assuming you're using react-oauth/google package for Google login
import {AuthContext} from '../context/AuthContext';
import googleimg from "../img/google.png"



const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for showing/hiding confirm password
  const [passwordError, setPasswordError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast(); // Using the toast context
  const {host } = useContext(AuthContext); 

  // Password validation regex
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  
  // Email validation regex for Gmail
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const usernameRegex = /^[a-z0-9]+$/; // No uppercase, no whitespace
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      // Password strength validation
      if (!passwordRegex.test(value)) {
        setPasswordError('Password must be at least 8 characters, including a number and a special character.');
      } else {
        setPasswordError('');
      }

      // Check if passwords match
      if (value !== formData.confirmPassword) {
        setPasswordMatchError('Passwords do not match.');
      } else {
        setPasswordMatchError('');
      }
    }

    if (name === 'confirmPassword') {
      // Check if passwords match
      if (value !== formData.password) {
        setPasswordMatchError('Passwords do not match.');
      } else {
        setPasswordMatchError('');
      }
    }

    if (name === 'email') {
      // Email validation for Gmail addresses
      if (!emailRegex.test(value)) {
        setEmailError('Please enter a valid Gmail address.');
      } else {
        setEmailError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    // Validate fields
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (passwordError || passwordMatchError || emailError) {
      setError('Please fix the errors above.');
      return;
    }

    // Validate username and password using regex
    if (!usernameRegex.test(formData.username)) {
      showToast('Username cannot contain uppercase letters or whitespace.', 'error');
      return;
    }
    setIsLoading(true); // Show loading spinner before making requests




    try {
      // First, check if the username or email already exists
      const checkResponse = await fetch(`${host}/auth/check-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: formData.username, email: formData.email }),
      });

      const checkData = await checkResponse.json();
      if (checkData.error) {
        setError(checkData.error);
        setIsLoading(false); // Hide loading spinner
        return;
      }

      // Send a POST request to the backend to register the user
      const response = await fetch(`${host}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Store user data in localStorage after successful signup
        const userData = { username: formData.username, email: formData.email, password: formData.password }; // Modify according to your user data
        localStorage.setItem('user', JSON.stringify(userData));

        // Show success toast
        showToast('Sign up successful! Please log in.', 'success');

        // Navigate to login page
        navigate('/login');
      } else {
        // Handle registration error
        const data = await response.json();
        setError(data.detail || 'Registration failed');
        showToast(data.detail || 'Registration failed', 'error'); // Show error toast
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to register, please try again.');
      showToast('Failed to register, please try again.', 'error'); // Show error toast
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };


  
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      
      // Navigate to the GoogleSignup page with the token
      navigate('/google-signup', { state: { codeResponse: tokenResponse } });
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      showToast('Google login failed. Please try again.', 'error');
    },
  });


  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {isLoading ? (
        <Loading /> // Show loading spinner while processing
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
          <div>
            <label>Password:</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"} // Toggle between text and password input type
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <span 
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)} // Toggle the password visibility
              >
                {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />} {/* Show eye icon depending on the state */}
              </span>
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>

          <div>
            <label>Confirm Password:</label>
            <div className="password-container">
              <input
                type={showConfirmPassword ? "text" : "password"} // Toggle between text and password input type
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <span 
                className="password-toggle-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle the password visibility
              >
                {showConfirmPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />} {/* Show eye icon depending on the state */}
              </span>
            </div>
            {passwordMatchError && <p className="error-message">{passwordMatchError}</p>}
          </div>

          {error && <p className="error-message">{error}</p>}
          <button className="signup-button" type="submit">Sign Up</button>
        </form>
      )}
            <div className='google-btn-container'>
          <button className="button-google" onClick={googleLogin}>
              <img src={googleimg} alt="Google Icon" className="google-icon" />
              Signup with Google
          </button>
      </div>
      <p>
        Already have an account?{' '}
        <span className="login-button" onClick={() => navigate('/login')}>Login</span>
      </p>
    </div>
  );
};

export default Signup;
