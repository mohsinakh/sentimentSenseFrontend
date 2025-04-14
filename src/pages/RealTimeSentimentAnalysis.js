import React, { useState, useContext, useEffect, useCallback } from 'react';
import './css/RealTimeSentimentAnalysis.css';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

function RealTimeSentimentAnalysis() {
  const { token,logout,host } = useContext(AuthContext);
  const { state } = useLocation(); // Get the passed data from navigate
  const analysisData = state?.analysisData; // This contains the text for sentiment analysis
  const [text, setText] = useState(analysisData || ""); // Use the passed text or default to empty
  const [sentiment, setSentiment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Stable definition of handleAnalyze using useCallback
  const handleAnalyze = useCallback(async () => {
    if (!token) {
      logout();
      setError("You must be logged in to analyze sentiment.");
      return;
    }

    setLoading(true);
    setError("");
    setSentiment("");

    try {
      const response = await fetch(`${host}/sentiment/analyze-sentiment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({ text:text }),
      });

      if(response.status === 401){
        logout();
      }

      if (!response.ok) {
        throw new Error("Failed to analyze sentiment");
      }

      const data = await response.json();
      setSentiment(data.sentiment);
    } catch (error) {
      setError("Error analyzing sentiment. Please try again.");
    } finally {
      setLoading(false);
    }
    //eslint-disable-next-line
  }, [token, text ,logout]); // Dependencies: token and text

  // Handle Enter key press to trigger the analysis
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the newline from being added
      handleAnalyze();
    }
  };

  // UseEffect to re-trigger the analysis after navigation
  useEffect(() => {
    if (analysisData) {
      setText(analysisData); // Update the text with passed data when available
      setTimeout(() => handleAnalyze(), 500); // Automatically analyze the sentiment after receiving the text
    }
    //eslint-disable-next-line
  }, [analysisData]); // Dependencies: analysisData and handleAnalyze



  const getSentimentEmoji = (sentiment) => {
    switch(sentiment) {
      case "anger": return "🤬";
      case "disgust": return "🤢";
      case "fear": return "😨";
      case "joy": return "😀";
      case "neutral": return "😐";
      case "sadness": return "😭";
      case "surprise": return "😲";
      default: return "";
    }
  };
  


  return (
    <div className="sentiment-page">
      <h1>Real-Time Sentiment Analysis</h1>
      <p>Enter your text below to analyze its sentiment:</p>

      <div className="input-container">
        <textarea
          placeholder="Type your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)} // Only updates the text state, no auto-analysis
          onKeyDown={handleKeyPress} // Trigger analysis when Enter key is pressed
          className="sentiment-input"
        ></textarea>
        <button
          onClick={handleAnalyze}
          className="analyze-button"
          disabled={loading || !text.trim()} // Disable the button if loading or text is empty
        >
          {loading ? "Analyzing..." : "Analyze Sentiment"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {sentiment && (
        <div className="sentiment-result">
          <p>
            Sentiment: <strong>{getSentimentEmoji(sentiment)}   {sentiment} </strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default RealTimeSentimentAnalysis;
