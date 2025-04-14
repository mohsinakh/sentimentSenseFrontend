import React, { useRef, useState, useEffect,useContext } from "react";
import "./css/EmotionDetection.css";
import { AuthContext } from "../context/AuthContext";


const EmotionDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentEmotions, setCurrentEmotions] = useState([]);
  const [displayedEmotions, setDisplayedEmotions] = useState([]);
  const [processedImage, setProcessedImage] = useState(null);
  const [error, setError] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const ws = useRef(null);
  const wsReady = useRef(false);
  const retryTimeout = useRef(null);
  const emotionTimeout = useRef(null);
  const latestEmotions = useRef([]);
  const {host} = useContext(AuthContext)
  const wshost = host.startsWith("https") 
  ? host.replace("https", "wss") 
  : host.replace("http", "ws");

  
  // Cleanup effects
  useEffect(() => {
    const videoElement = videoRef.current;
    
    return () => {
      if (ws.current) ws.current.close();
      if (videoElement?.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
      }
      clearTimeout(retryTimeout.current);
      clearTimeout(emotionTimeout.current);
    };
  }, []);

  // Emotion display effect
  useEffect(() => {
    if (currentEmotions.length > 0) {
      latestEmotions.current = currentEmotions;
      setDisplayedEmotions(currentEmotions);
      
      // Clear any existing timeout
      clearTimeout(emotionTimeout.current);
      
      // Set new timeout to maintain display
      emotionTimeout.current = setTimeout(() => {
        setDisplayedEmotions([]);
      }, 2000); // Show emotions for 2 seconds
    }
  }, [currentEmotions]);

  const startDetection = async () => {
    try {
      setIsDetecting(true);
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      initializeWebSocket();
    } catch (err) {
      setError("Webcam access required");
      stopDetection();
    }
  };

  const initializeWebSocket = () => {
    ws.current = new WebSocket(`${wshost}/emotion/detection/`);

    ws.current.onopen = () => {
      console.log("WebSocket connection established.");
      wsReady.current = true;
      startFrameSending();
    };

    ws.current.onmessage = handleMessage;
    ws.current.onerror = handleWebSocketError;
    ws.current.onclose = handleWebSocketClose;
  };
  

  const startFrameSending = () => {
    let lastSentTime = 0;
    const frameInterval = 100; // Send frames every 100ms (10 FPS)
  
    const sendFrame = () => {
      if (!wsReady.current) return;
  
      const now = Date.now();
      if (now - lastSentTime < frameInterval) {
        requestAnimationFrame(sendFrame);
        return;
      }
  
      const canvas = canvasRef.current;
      const video = videoRef.current;
  
      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
  
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size > 0 && wsReady.current) {
              try {
                ws.current.send(blob);
                lastSentTime = now;
              } catch (sendError) {
                console.error("Error sending frame:", sendError);
                setError("Error sending frame");
                stopDetection();
              }
            }
          },
          "image/jpeg",
          0.7
        );
      }
      requestAnimationFrame(sendFrame);
    };
    requestAnimationFrame(sendFrame);
  };
  

  const handleMessage = (event) => {
    if (event.data instanceof Blob) {
      setProcessedImage(URL.createObjectURL(event.data));
    } else {
      try {
        const data = JSON.parse(event.data);
        setCurrentEmotions(data.emotions);
      } catch (err) {
        console.error("Error parsing message data:", err);
        setError("Error parsing emotion data");
      }
    }
  };

  const handleWebSocketError = () => {
    setError("Connection error");
    stopDetection();
  };

  const handleWebSocketClose = () => {
    console.log("WebSocket closed.");
    wsReady.current = false;
    if (isDetecting) {
      retryConnection();
    }
  };

  const retryConnection = () => {
    const retryDelay =2 // Exponential backoff
    retryTimeout.current = setTimeout(() => {
      setError("Reconnecting...");
      startDetection();
    }, retryDelay);
  };

  const stopDetection = () => {
    setIsDetecting(false);
    setProcessedImage(null);
    wsReady.current = false;
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.close();
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="emotion-detection">
      <h2>Real-time Emotion Detection</h2>

      {error && <div className="error">{error}</div>}

      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ display: isDetecting ? "block" : "none" }}
        />

        {processedImage && (
          <div className="processed-frame">
            <img src={processedImage} alt="Processed frame" />
            <div className="emotion-list">
              {displayedEmotions.map((emotion, i) => (
                <div key={i} className="emotion-item">
                  {emotion}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="controls">
        {!isDetecting ? (
          <button onClick={startDetection} className="det_btn">
            Start Detection
          </button>
        ) : (
          <button onClick={stopDetection} className="det_btn">
            Stop Detection
          </button>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default EmotionDetection;