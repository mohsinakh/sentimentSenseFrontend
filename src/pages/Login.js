import React, { useState, useContext, useEffect } from 'react';
import "./css/Login.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from './Loading'; // Import the Loading component
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '../context/ToastContext'; // Importing the toast context
import { useGoogleLogin } from '@react-oauth/google'; // Updated import
import googleimg from '../img/google.png'

const Login = () => {
  const { login,host } = useContext(AuthContext); // Access login function from context
  const [formData, setFormData] = useState({ credential: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password
  const navigate = useNavigate();
  const { showToast } = useToast(); // Using the toast context



  
  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (codeResponse) => {
      console.log(codeResponse)
      try {
        // console.log("Google Login Data:", codeResponse); // Log Google data to console
        // console.log(host)
        // Send token to the backend
        setIsLoading(true)
        const response = await fetch(`${host}/auth/google-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: codeResponse.access_token }),
        });
  

        if (response.ok) {
          const data = await response.json(); 
        
        const { access_token, user_info } = data;
          // Use login function from context to store token
          login(access_token);
  
          // Save user info in localStorage
          localStorage.setItem("user", JSON.stringify(user_info));
  
          setIsLoading(false)
          // Show success toast
          showToast(` Redirecting to profile...`, "success");
          console.log(access_token)
          // Redirect to profile or another page
          navigate("/profile");
        } else if (response.status === 401) {
          // If user not found, trigger signup
          showToast("Google User does not exist. Signing up now...", "warning");

          setIsLoading(false)
          navigate('/google-signup', { state: { codeResponse: codeResponse } });
  
        } else {
          // Handle other status codes or failures
          setIsLoading(false)
          showToast( 'Authentication failed', 'error');
        }
  
      } catch (error) {
        console.error("Google login failed:", error);
        showToast("Google login failed. Please try again.", "error");
      }
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
      showToast("Google login failed. Please try again.", "error");
    },
  });




  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const { email, username, password } = JSON.parse(savedUser);
      // If there's no password (from Google login), generate a default or random password
      if (!password) {
        setFormData({ credential: email || username, password: '' }); // You can change 'randomPasswordSet' with something else if needed
      } else {
        setFormData({ credential: email || username, password:"" });
      }
    }
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loading spinner


    console.log("sending login request")
    try {
      const response = await fetch(`${host}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Invalid username/email or password');
      }

      const data = await response.json();
      console.log('Access Token:', data.access_token); // Debug
      console.log('User Data:', data.user); // Debug

      // Use login function from context to store token
      login(data.access_token);

      // Optionally, save the user data in localStorage as well
      localStorage.setItem('user', JSON.stringify(data.user)); 

      // Show success toast
      showToast('Login successful! Redirecting to profile...', 'success');

      // Redirect to profile or another page
      navigate('/profile');
    } catch (err) {
      console.error(err.message);
      setError('Invalid username/email or password'); // Set error message
      showToast('Login failed. Please check your credentials.', 'error'); // Show error toast
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  

  

  return (
    <div className="login-container">
      <h2>Login</h2>
      {isLoading ? (
        <Loading /> // Show loading spinner while processing
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username or Email:</label>
            <input
              type="text"
              name="credential"
              value={formData.credential}
              onChange={handleInputChange}
              required
            />
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
            <p className="forgot-password-link" onClick={() => navigate('/forgot-password')}>
                Forgot Password?
              </p>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button className='btn' type="submit">Login</button>
        </form>
        
      )}

      <div className='google-btn-container'>
          <button className="button-google" onClick={googleLogin}>
              <img src={googleimg} alt="Google Icon" className="google-icon" />
              Login with Google
          </button>
      </div>

      
      <p>
        Don't have an account?{' '}
        <span className="signup-link" onClick={() => navigate('/signup')}>
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default Login;
