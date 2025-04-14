import React, { useState ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import "./css/Login.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const {host} = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${host}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });


      if (!response.ok) {
        showToast("User doesn not exist with this email, Please signup ...","error")
        setIsLoading(false)
        return
      }

      const data = await response.json();
      showToast(data.message, 'success'); // Show success message from the API
      setIsLoading(false);
      navigate('/login'); // Redirect to login after sending the reset link
    } catch (error) {
      console.error(error);
      showToast('Failed to send password reset link. Please try again.', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className='login-container'>
    <div className="password-container ">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading} className='btn'>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
    </div>
  );
};

export default ForgotPassword;
