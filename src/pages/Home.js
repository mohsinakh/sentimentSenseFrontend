import React from "react";
import "./css/Home.css"; // Import the custom CSS
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReddit, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faCamera, faImage, faMagnifyingGlass, faVideoCamera } from "@fortawesome/free-solid-svg-icons"; 
import { useToast } from '../context/ToastContext'; // Import the useToast hook




const Home = () => {

  const { showToast } = useToast(); // Hook to trigger toast notifications

  const handleAnalyzeClick = (platform) => {
    // Display a success message when a button is clicked
    showToast(`${platform} analysis started successfully!`, 'success');
  };


    return (
      <div className="home-container">
        <section className="services" id="services">
          <h2>Our Services</h2>
          <div className="service-items">
  
            {/* YouTube Analysis */}
            <div className="service-link">
              <div className="service-item">
                <FontAwesomeIcon icon={faYoutube} className="service-icon" style={{ color: "red" }} />
                <h3>YouTube Comment Analysis</h3>
                <p>Understand viewer feedback and engagement on your YouTube videos.</p>
                <Link to="/youtube-analysis">
                  <button className="analyze-button" onClick={() => handleAnalyzeClick("YouTube")}>
                    Analyze
                  </button>
                </Link>
              </div>
            </div>
  
            {/* Real-Time Text Analysis */}
            <div className="service-link">
              <div className="service-item">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="service-icon" style={{ color: "#E53935" }} />
                <h3>Real-Time Text Analysis</h3>
                <p>Gain instant insights on how your audience feels in real-time.</p>
                <Link to="/realtime-sentiment-analysis">
                  <button className="analyze-button" onClick={() => handleAnalyzeClick("Real-Time Sentiment")}>
                    Analyze
                  </button>
                </Link>
              </div>
            </div>
  
            {/* Reddit Analysis */}
            <div className="service-link">
              <div className="service-item">
                <FontAwesomeIcon icon={faReddit} className="service-icon" style={{ color: "#E1306C" }} />
                <h3>Reddit Comment Analysis</h3>
                <p>Analyze comments on your Reddit posts for deep audience insights.</p>
                <Link to="/reddit-analysis">
                  <button className="analyze-button" onClick={() => handleAnalyzeClick("Reddit")}>
                    Analyze
                  </button>
                </Link>
              </div>
            </div>
  
            {/* Emotion Detection */}
            <div className="service-link">
              <div className="service-item">
                <FontAwesomeIcon icon={faCamera} className="service-icon" style={{ color: "#E53935" }} />
                <h3>Real-Time Emotion Detection</h3>
                <p>Detect emotions in real-time using facial analysis.</p>
                <Link to="/emotion-detection">
                  <button className="analyze-button" onClick={() => handleAnalyzeClick("Emotion Detection")}>
                    Analyze
                  </button>
                </Link>
              </div>
            </div>
  


          {/* Image Detection */}
          <div className="service-link">
              <div className="service-item">
                <FontAwesomeIcon icon={faImage} className="service-icon" style={{ color: "#E53935" }} />
                <h3>Image Emotion Detection</h3>
                <p>Detect emotions in Image using facial analysis.</p>
                <Link to="/image-detection">
                  <button className="analyze-button" onClick={() => handleAnalyzeClick("Image Detection")}>
                    Analyze
                  </button>
                </Link>
              </div>
            </div>



            {/* Video Detection */}
          <div className="service-link">
              <div className="service-item">
                <FontAwesomeIcon icon={faVideoCamera} className="service-icon" style={{ color: "#E53935" }} />
                <h3>Video Emotion Detection</h3>
                <p>Detect emotions in Videos using facial analysis.</p>
                <Link to="/video-detection">
                  <button className="analyze-button" onClick={() => handleAnalyzeClick("Video Detection")}>
                    Analyze
                  </button>
                </Link>
              </div>
            </div>


          </div>
          <Link to="/contact" className="contact-button">
            Contact Us
          </Link>
        </section>
      </div>
    );
  };
  
  export default Home;
  