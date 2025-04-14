import React, { useState, useEffect, useContext, useCallback } from 'react';
import "./css/YoutubeAnalysis.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function YoutubeAnalysis() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [comments, setComments] = useState([]);
  const [allComments, setAllComments] = useState([]); // Store all comments initially
  const [error, setError] = useState("");
  const [angerCount, setAngerCount] = useState(0);
  const [disgustCount, setDisgustCount] = useState(0);
  const [fearCount, setFearCount] = useState(0);
  const [joyCount, setJoyCount] = useState(0);
  const [neutralCount, setNeutralCount] = useState(0);
  const [sadnessCount, setSadnessCount] = useState(0);
  const [surpriseCount, setSurpriseCount] = useState(0);
  const [showChart, setShowChart] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, logout, host } = useContext(AuthContext);
  const [maxComments, setMaxComments] = useState(100);
  const navigate = useNavigate();
  const location = useLocation();

  const extractVideoId = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  };

  const fetchComments = useCallback(async (videoUrl) => {
    setLoading(true);
    setError("");
    setComments([]);
    setAngerCount(0);
    setDisgustCount(0);
    setFearCount(0);
    setJoyCount(0);
    setNeutralCount(0);
    setSadnessCount(0);
    setSurpriseCount(0);

    const videoId = extractVideoId(videoUrl);
    setVideoId(videoId);

    if (!token) {
      setError("Please log in to continue.");
      logout();
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${host}/youtube/fetch-comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ video_url: videoUrl }),
      });

      if (response.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      setAllComments(data.comments); // Store all comments initially
      const filteredComments = data.comments.slice(0, maxComments);
      setComments(filteredComments);

      calculateSentimentCounts(filteredComments); // Calculate sentiment counts for filtered comments
      setLoading(false);
    } catch (error) {
      setError("Error fetching comments. Please check the URL and try again.");
      setLoading(false);
    }
  }, [token, logout, navigate, host, maxComments]);

  // Calculate sentiment counts
  const calculateSentimentCounts = (filteredComments) => {
    let anger = 0;
    let disgust = 0;
    let fear = 0;
    let joy = 0;
    let neutral = 0;
    let sadness = 0;
    let surprise = 0;

    filteredComments.forEach((comment) => {
      switch (comment.sentiment) {
        case 'anger': anger++; break;
        case 'disgust': disgust++; break;
        case 'fear': fear++; break;
        case 'joy': joy++; break;
        case 'neutral': neutral++; break;
        case 'sadness': sadness++; break;
        case 'surprise': surprise++; break;
        default: break;
      }
    });

    setAngerCount(anger);
    setDisgustCount(disgust);
    setFearCount(fear);
    setJoyCount(joy);
    setNeutralCount(neutral);
    setSadnessCount(sadness);
    setSurpriseCount(surprise);
  };

  // Update comments dynamically when maxComments changes
  useEffect(() => {
    const filteredComments = allComments.slice(0, maxComments);
    setComments(filteredComments);
    calculateSentimentCounts(filteredComments);
  }, [maxComments, allComments]);

  useEffect(() => {
    const state = location.state;
    if (state?.videoUrl) {
      setUrl(state.videoUrl);
      fetchComments(state.videoUrl);
    }
  }, [location.state, fetchComments]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchComments(url);
    }
  };

  const handleFocus = () => {
    document.getElementById("youtube-url").select();
  };

  const data = {
    labels: ['Anger', 'Disgust', 'Fear', 'Joy', 'Neutral', 'Sadness', 'Surprise'],
    datasets: [
      {
        label: 'Sentiment Distribution',
        data: [angerCount, disgustCount, fearCount, joyCount, neutralCount, sadnessCount, surpriseCount],
        backgroundColor: ['#dc3545', '#006511', '#4972e4', '#06c833', '#6c757d', '#e68a00', '#5907a1'],
        borderColor: ['#dc3545', '#006511', '#4972e4', '#06c833', '#6c757d', '#e68a00', '#5907a1'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="youtube-comment-analysis">
      <h1><FontAwesomeIcon icon={faYoutube} /> YouTube Comment Analysis</h1>
      <div className="search-bar">
        <input
          id="youtube-url"
          type="text"
          placeholder="Enter YouTube video URL"
          value={url}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={() => fetchComments(url)} className="btn">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {videoId && (
        <div className="video-container">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video preview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {loading && <p>Loading comments...</p>}

      {comments.length > 0 && (
        <div className="sentiment-counts">
          <select value={maxComments} onChange={(e) => setMaxComments(Number(e.target.value))} className='select-dropdown'>
            <option value={10}>10 Comments</option>
            <option value={50}>50 Comments</option>
            <option value={100}>100 Comments</option>
          </select>
          <h3>Sentiment Breakdown</h3>
          <p><strong>Anger:</strong> {angerCount}</p>
          <p><strong>Disgust:</strong> {disgustCount}</p>
          <p><strong>Fear:</strong> {fearCount}</p>
          <p><strong>Joy:</strong> {joyCount}</p>
          <p><strong>Neutral:</strong> {neutralCount}</p>
          <p><strong>Sadness:</strong> {sadnessCount}</p>
          <p><strong>Surprise:</strong> {surpriseCount}</p>
        </div>
      )}

      {comments.length > 0 && (
        <button
          className="analyze-button"
          onClick={() => setShowChart(!showChart)}
        >
          {showChart ? "Hide Chart" : "Show Chart"}
        </button>
      )}

      {showChart && comments.length > 0 && (
        <div className="chart-container">
          <Bar data={data} />
        </div>
      )}

      {comments.length > 0 && (
        <div className="comments">
          <h2>Comments</h2>
          <ul>
            {comments.map((comment, index) => {
              let emoji = "";
              switch(comment.sentiment) {
                case "anger": emoji = "🤬"; break;
                case "disgust": emoji = "🤢"; break;
                case "fear": emoji = "😨"; break;
                case "joy": emoji = "😀"; break;
                case "neutral": emoji = "😐"; break;
                case "sadness": emoji = "😭"; break;
                case "surprise": emoji = "😲"; break;
                default: emoji = "";
              }

              return (
                <li key={index} className="comment-card">
                  <h4>{emoji} {comment.username || "Anonymous"}</h4>
                  <div className={`sentiment-label ${comment.sentiment}`}>
                    {comment.sentiment}
                  </div>
                  <p>{comment.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default YoutubeAnalysis;
