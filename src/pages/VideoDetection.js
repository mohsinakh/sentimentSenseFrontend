import React, { useState ,useContext } from "react";
import axios from "axios";
import { AuthContext } from '../context/AuthContext';

const VideoDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    const { host } = useContext(AuthContext);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setVideoUrl(null);
    setError(""); // Clear previous error
  };

  // Convert video file to base64
  const convertToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Extract base64
      reader.onerror = reject;
    });
  }; 

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a video file.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Convert to base64
      const base64Video = await convertToBase64(selectedFile);

      // Send to backend and get processed video file
      const response = await axios.post(
        `${host}/emotion/detect-from-video/`,
        { base64_video: base64Video },
        { responseType: "blob" } // Expect binary file
      );

      // Convert blob response to downloadable file
      const videoBlob = new Blob([response.data], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);

      // Create a hidden <a> element to trigger download
      const link = document.createElement("a");
      link.href = videoUrl;
      link.setAttribute("download", "processed_video.mp4");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Set video URL for preview
      setVideoUrl(videoUrl);
    } catch (err) {
      setError("Error processing the video.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Internal CSS
  const styles = {
    container: {
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "20px auto",
      padding: "20px",
      background: "#f8f9fa",
      borderRadius: "10px",
      boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    },
    title: {
      color: "#333",
      fontSize: "24px",
      marginBottom: "15px",
    },
    input: {
      marginBottom: "15px",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      width: "100%",
    },
    button: {
      padding: "10px 20px",
      fontSize: "16px",
      borderRadius: "5px",
      backgroundColor: loading ? "#ccc" : "#007bff",
      color: "#fff",
      border: "none",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "0.3s",
    },
    error: {
      color: "red",
      marginTop: "10px",
    },
    videoContainer: {
      marginTop: "20px",
    },
    downloadButton: {
      display: "block",
      margin: "15px auto",
      padding: "10px 15px",
      fontSize: "16px",
      borderRadius: "5px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎥 Video Emotion Detection</h1>

      <input type="file" accept="video/*" onChange={handleFileChange} style={styles.input} />
      <button onClick={handleUpload} disabled={loading} style={styles.button}>
        {loading ? "Processing..." : "Upload & Process Video"}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {videoUrl && (
        <div style={styles.videoContainer}>
          <a href={videoUrl} download="processed_video.mp4" style={styles.downloadButton}>
            📥 Download Processed Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoDetection;
