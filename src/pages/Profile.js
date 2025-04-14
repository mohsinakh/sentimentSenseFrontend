import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./css/Profile.css"; // Importing the CSS file
import {
  faEnvelope,
  faSmile,
  faUser,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReddit, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { useToast } from "../context/ToastContext"; // Importing toast context
import Loading from "./Loading"; // Import the Loading component

const Profile = () => {
  const { token, host ,logout} = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true); // State for tracking loading status of history
  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchHistory = useCallback(
    async (username) => {
      if (token) {
        try {
          const response = await fetch(`${host}/sentiment/analysis-history`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status===401){
            showToast("Session Timed Out ,You need to log in again...","error")
            logout()
            navigate("/login")
          }

          if (!response.ok) {
            setLoadingHistory(false);
            return;
          }

          const data = await response.json();
          setHistory(data.history || []);
          setLoadingHistory(false); // Set loadingHistory to false once data is fetched

          showToast("Analysis history loaded successfully!", "success");
        } catch (error) {
          console.error("Error fetching analysis history:", error);
          setLoadingHistory(false); // Ensure loading is stopped even in case of error
          showToast("An error occurred while loading the history.", "error");
        }
      }
    },
    // eslint-disable-next-line
    [token]
  );

  useEffect(() => {
    const fetchedUser = JSON.parse(localStorage.getItem("user")) || null;
    if (fetchedUser) {
      setUser(fetchedUser);
      fetchHistory(fetchedUser.username);
    }
  }, [fetchHistory]);

  const sentimentHistory = history.filter(
    (item) => item.analysis_type === "sentiment"
  );
  const youtubeHistory = history.filter(
    (item) => item.analysis_type === "youtube"
  );
  const redditHistory = history.filter(
    (item) => item.analysis_type === "reddit"
  );

  // Handle re-analysis for individual items
  const handleReanalyzeSentiment = (item) => {
    showToast("Re-analyzing sentiment...", "info");
    navigate("/realtime-sentiment-analysis", {
      state: { analysisData: item.analysis_data.text },
    });
  };

  const handleReanalyzeYouTube = (item) => {
    showToast("Re-analyzing YouTube video...", "info");
    navigate("/youtube-analysis", {
      state: { videoUrl: `https://youtu.be/${item.analysis_data.video_id}` },
    });
  };

  const handleReanalyzeReddit = (item) => {
    showToast("Re-analyzing Reddit post...", "info");
    navigate("/reddit-analysis", {
      state: {
        postId: `https://reddit/comments/${item.analysis_data.post_id}`,
      },
    });
  };

  // Function to download JSON
  const downloadJSON = (data, filename) => {
    if (!data || data.length === 0) {
      showToast("No data available for download.", "warning");
      return;
    }

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) {
      showToast("No data available for download.", "warning");
      return;
    }

    const csvRows = [];

    // Extract headers, including nested object keys
    const headers = new Set();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (typeof item[key] === "object" && item[key] !== null) {
          Object.keys(item[key]).forEach((nestedKey) => {
            headers.add(`${key}.${nestedKey}`); // Flatten nested keys
          });
        } else {
          headers.add(key);
        }
      });
    });

    csvRows.push([...headers].join(",")); // Add headers to CSV

    // Extract values, handling nested objects
    data.forEach((item) => {
      const values = [...headers].map((header) => {
        const keys = header.split("."); // Split nested keys
        let value = item;

        keys.forEach((k) => {
          value = value?.[k]; // Traverse the nested object
        });

        if (Array.isArray(value)) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`; // Convert arrays to a readable format
        }

        return value !== undefined
          ? `"${String(value).replace(/"/g, '""')}"`
          : '""'; // Ensure proper escaping
      });

      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle download option selection
  const handleDownload = (format, category) => {
    let data = [];
    switch (category) {
      case "sentiment":
        data = sentimentHistory;
        break;
      case "youtube":
        data = youtubeHistory;
        break;
      case "reddit":
        data = redditHistory;
        break;
      default:
        data = history;
    }

    if (data.length === 0) {
      showToast(`No ${category} history available to download.`, "warning");
      return;
    }

    const filename = `${category}_history.${format}`;
    if (format === "json") {
      downloadJSON(data, filename);
    } else if (format === "csv") {
      downloadCSV(data, filename);
    }
  };

  return (
    <div className="profile-page">
      <h2 className="profile-header">Profile Page</h2>
      {user ? (
        <div className="profile-details">
          <p>
            <FontAwesomeIcon icon={faUser} />
            <strong> Username:</strong> {user.username}
          </p>
          <p>
            <FontAwesomeIcon icon={faEnvelope} />
            <strong> Email:</strong> {user.email}
          </p>

          <div className="history-section">
            <h3>Analysis History</h3>

            {loadingHistory ? (
              <Loading /> // Show loading spinner while history is being fetched
            ) : (
              <div className="history-category-container">
                {sentimentHistory.length > 0 && (
                  <div className="history-category sentiment">
                    <h4>
                      <span className="title">
                        <FontAwesomeIcon icon={faSmile} /> Sentiment Analysis
                      </span>
                      <div className="download-dropdown">
                        <button className="download-button">
                          <FontAwesomeIcon icon={faDownload} />
                        </button>
                        <div className="download-options">
                          <button
                            onClick={() => handleDownload("json", "sentiment")}
                          >
                            JSON
                          </button>
                          <button
                            onClick={() => handleDownload("csv", "sentiment")}
                          >
                            CSV
                          </button>
                        </div>
                      </div>
                    </h4>

                    <div className="analysis-content">
                      {sentimentHistory.map((item, index) => (
                        <div key={index} className="history-item">
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                          <p>
                            <strong>Text:</strong> {item.analysis_data.text}
                          </p>
                          <p>
                            <strong>Sentiment:</strong>{" "}
                            {item.analysis_data.sentiment}
                          </p>
                          <button
                            onClick={() => handleReanalyzeSentiment(item)}
                            className="profile-btn"
                          >
                            Re-analyze Sentiment
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {youtubeHistory.length > 0 && (
                  <div className="history-category youtube">
                    <h4>
                      <span className="title">
                        <FontAwesomeIcon icon={faYoutube} /> YouTube Analysis
                      </span>
                      <div className="download-dropdown">
                        <button className="download-button">
                          <FontAwesomeIcon icon={faDownload} />
                        </button>
                        <div className="download-options">
                          <button
                            onClick={() => handleDownload("json", "youtube")}
                          >
                            JSON
                          </button>
                          <button
                            onClick={() => handleDownload("csv", "youtube")}
                          >
                            CSV
                          </button>
                        </div>
                      </div>
                    </h4>

                    <div className="analysis-content">
                      {youtubeHistory.map((item, index) => (
                        <div key={index} className="history-item">
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                          <p>
                            <strong>Video URL:</strong>{" "}
                            <a
                              href={`https://www.youtube.com/embed/${item.analysis_data.video_id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="profile_link"
                            >
                              View Video
                            </a>
                          </p>
                          <p>
                            <strong>Video Title:</strong>{" "}
                            {item.analysis_data.title}
                          </p>
                          <p>
                            <strong>Comments:</strong>{" "}
                            {item.analysis_data.comments.length} comments
                          </p>
                          <div className="youtube-video">
                            <iframe
                              width="100%"
                              height="315"
                              src={`https://www.youtube.com/embed/${item.analysis_data.video_id}`}
                              frameBorder="0"
                              allowFullScreen
                              title={item.analysis_data.title}
                            ></iframe>
                          </div>
                          <button
                            onClick={() => handleReanalyzeYouTube(item)}
                            className="profile-btn"
                          >
                            Re-analyze YouTube
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {redditHistory.length > 0 && (
                  <div className="history-category reddit">
                    <h4>
                      <span className="title">
                        <FontAwesomeIcon icon={faReddit} /> Reddit Analysis
                      </span>
                      <div className="download-dropdown">
                        <button className="download-button">
                          <FontAwesomeIcon icon={faDownload} />
                        </button>
                        <div className="download-options">
                          <button
                            onClick={() => handleDownload("json", "reddit")}
                          >
                            JSON
                          </button>
                          <button
                            onClick={() => handleDownload("csv", "reddit")}
                          >
                            CSV
                          </button>
                        </div>
                      </div>
                    </h4>

                    <div className="analysis-content">
                      {redditHistory.map((item, index) => (
                        <div key={index} className="history-item">
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                          <p>
                            <strong>Post URL:</strong>{" "}
                            <a
                              href={item.analysis_data.post.url}
                              target="_blank"
                              rel="noreferrer"
                              className="profile_link"
                            >
                              View Post
                            </a>
                          </p>
                          <p>
                            <strong>Subreddit:</strong>{" "}
                            {item.analysis_data.subreddit ||
                              "No Subreddit Data"}
                          </p>
                          <p>
                            <strong>Comments:</strong>{" "}
                            {item.analysis_data.comments.length} comments
                          </p>
                          <div className="reddit-post">
                            {item.analysis_data.post.url ? (
                              item.analysis_data.post.url.match(
                                /\.(jpeg|jpg|gif|png)$/
                              ) ? (
                                <img
                                  src={item.analysis_data.post.url}
                                  alt="Reddit post"
                                  className="reddit-image"
                                />
                              ) : null
                            ) : null}
                          </div>
                          <button
                            onClick={() => handleReanalyzeReddit(item)}
                            className="profile-btn"
                          >
                            Re-analyze Reddit
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {history.length === 0 && !loadingHistory && (
              <p className="no-history">No analysis history found.</p>
            )}
          </div>
        </div>
      ) : (
        <p>
          <Loading />
        </p>
      )}
    </div>
  );
};

export default Profile;
