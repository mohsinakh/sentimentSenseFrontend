import React from 'react';
import { Link } from 'react-router-dom';
import './css/NotFound.css';
import NotFoundVideo from '../NotFound.webm'; // Import the video file

const NotFound = () => {
  return (
    <div className="not-found-container">
      {/* Animation container with two characters and VS text */}
      <div className="animation-container">
        <video
          className="character-video character-left"
          src={NotFoundVideo}
          autoPlay
          loop
          muted
        ></video>
        <div className="vs-text">VS</div>
        <video
          className="character-video character-right"
          src={NotFoundVideo}
          autoPlay
          loop
          muted
          style={{ transform: 'scaleX(-1)' }} // Flipping the video for the right character
        ></video>
      </div>

      {/* Page content */}
      <h1 className="not-found-title">404 - Page Not Found</h1>
      <p className="not-found-description">
        Oops! The page you're looking for doesn't exist. It seems like our characters are too busy fighting to help you out!
      </p>
      <Link to="/" className="home-button">Return to Home</Link>
    </div>
  );
};

export default NotFound;
