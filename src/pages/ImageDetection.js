import React, { useState ,useContext} from 'react';
import './css/ImageDetection.css'; // Create this CSS file for styling
import { AuthContext } from '../context/AuthContext';


const ImageDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [emotions, setEmotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const {host } = useContext(AuthContext);

  const API_URL = `${host}/emotion/detect-from-image/`;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset states
    setError('');
    setEmotions([]);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setSelectedImage(file);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result.split(',')[1]; // Remove data URL prefix
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ base64_image: base64String }),
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        setEmotions(data.emotions);
        setIsLoading(false);
      };
      reader.readAsDataURL(selectedImage);
    } catch (err) {
      setError('Error detecting emotions. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="emotion-detection-container">
      <h1>Emotion Detection</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="image-upload">Upload Image:</label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>
        
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading || !selectedImage}
          className="submit-button"
        >
          {isLoading ? 'Detecting...' : 'Detect Emotions'}
        </button>

        {error && <div className="error-message">{error}</div>}

        {emotions.length > 0 && (
          <div className="results">
            <h2>Detected Emotions:</h2>
            <ul className='emotion-ul'>
              {emotions.map((emotion, index) => (
                <li className="emotion-li" key={index}>{emotion}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default ImageDetection;