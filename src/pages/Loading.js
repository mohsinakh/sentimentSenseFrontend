import React from 'react';
import './css/Loading.css';
// import LoadingVideo from '../NotFound.webm'; // Import the video file

const Loading = () => {
  return (
    <div className="loading-container">
      {/* Animation container with two characters and VS text
            <div className="animation-container">
              <video
                className="character-video character-left"
                src={LoadingVideo}
                autoPlay
                loop
                muted
              ></video>
              <div className="vs-text">VS</div>
              <video
                className="character-video character-right"
                src={LoadingVideo}
                autoPlay
                loop
                muted
                style={{ transform: 'scaleX(-1)' }} // Flipping the video for the right character
              ></video>
            </div> */}
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading, please wait...</p>
    </div>
  );
};

export default Loading;
