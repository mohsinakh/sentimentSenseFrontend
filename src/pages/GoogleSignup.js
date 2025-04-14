import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './css/Signup.css';
import { useToast } from "../context/ToastContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import Loading from "./Loading";

const GoogleSignup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const { login, host } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { codeResponse } = location.state || {}; // Get the Google token from the location state

  // Regex for username and password validation
  const usernameRegex = /^[a-z0-9]+$/; // No uppercase, no whitespace
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Strong password

  // Check if email or username is already registered
  const handleCheckUser = async () => {
    try {
      const response = await fetch(`${host}/auth/check-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: codeResponse.access_token,
          email: codeResponse?.email || "",
          username: username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          available: false,
          error: data.error || "Unknown error occurred",
        };
      }

      if (data.message === "Username and email are available") {
        return { available: true };
      } else {
        return {
          available: false,
          error: data.error || "Unknown error occurred",
        };
      }
    } catch (error) {
      console.error("Error checking user:", error);
      showToast("Error validating username and email.", "error");
      return {
        available: false,
        error: "Error validating username and email.",
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      showToast("Username and password are required.", "error");
      return;
    }

    // Validate username and password using regex
    if (!usernameRegex.test(username)) {
      showToast(
        "Username cannot contain uppercase letters or whitespace.",
        "error"
      );
      return;
    }

    if (!passwordRegex.test(password)) {
      showToast(
        "Password must be at least 8 characters long, include a number, an uppercase letter, and a special character.",
        "error"
      );
      return;
    }

    setIsLoading(true);

    // Validate username and email before signing up
    const checkUserResult = await handleCheckUser();
    if (!checkUserResult.available) {
      showToast(checkUserResult.error, "error"); // Show error message from the result
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${host}/auth/google-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: codeResponse.access_token,
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user_info));
        showToast("Signup successful! You are now logged in.", "success");
        navigate("/profile");
      } else {
        showToast(data.detail || "Google signup failed", "error");
      }
    } catch (error) {
      console.error("Google signup failed:", error);
      showToast("Failed to sign up with Google", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Google Sign-Up</h2>
      {isLoading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            
          </div>
          <div>
                      <label>Password:</label>
                      <div className="password-container">
                        <input
                          type={showPassword ? "text" : "password"} // Toggle between text and password input type
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <span 
                          className="password-toggle-icon"
                          onClick={() => setShowPassword(!showPassword)} // Toggle the password visibility
                        >
                          {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />} {/* Show eye icon depending on the state */}
                        </span>
                      </div>
                    </div>
          
          <button type="submit" className="signup-button">Complete Sign-Up</button>
        </form>
      )}
    </div>
  );
};

export default GoogleSignup;
