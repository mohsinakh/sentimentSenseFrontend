import React from 'react';
import './css/About.css';
import mohsin from '../img/mohsin.png';
import muskan from '../img/muskan.png';
import mohit from '../img/mohit.jpeg';
import abdul from '../img/abdul.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake, faRocket, faUser } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { useToast } from '../context/ToastContext';


const AboutUs = () => {

  const { showToast } = useToast(); 

  const handleProfileClick = (name) => {
    showToast(`Redirecting to ${name}'s LinkedIn profile!`, 'info');
  };


  return (
    <div className="aboutus-container">
      <section className="aboutus-header">
        <h1>About Us</h1>
        <p>We are a passionate team of students on a mission to revolutionize the future with innovative solutions.</p>
      </section>

      <section className="aboutus-mission">
        <div className="mission-text">
          <h2>Our Mission</h2>
          <p>
            At <strong>Sentiment Sense</strong>, we aim to leverage cutting-edge technology to create impactful solutions that solve real-world problems.
            Our project is built on collaboration, innovation, and the shared vision of our diverse team.
          </p>
        </div>
        <div className="mission-icons">
          <div className="mission-item">
            <FontAwesomeIcon icon={faRocket} />
            <p>Innovation</p>
          </div>
          <div className="mission-item">
            <FontAwesomeIcon icon={faUser} />
            <p>Teamwork</p>
          </div>
          <div className="mission-item">
            <FontAwesomeIcon icon={faHandshake} />
            <p>Collaboration</p>
          </div>
        </div>
      </section>

      <section className="aboutus-team">
        <h2>Meet the Team</h2>
        <div className="team-members">
          <div className="team-member">
            <img src={mohsin} alt="Mohsin Abbas" />
            <h3>Mohsin Abbas</h3>
            <p>Lead Developer</p>
            <a
              href="https://www.linkedin.com/in/mohsin-abbas-7252b126b/"
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-link"
              onClick={() => handleProfileClick('Mohsin Abbas')}
            >
              <FontAwesomeIcon icon={faLinkedin} /> Profile
            </a>
          </div>
          <div className="team-member">
            <img src={muskan} alt="Muskan Alam" />
            <h3>Muskan Alam</h3>
            <p>Frontend Developer</p>
            <a
              href="https://www.linkedin.com/in/muskan-alam-628b28291/"
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-link"
              onClick={() => handleProfileClick('Muskan Alam')}
            >
              <FontAwesomeIcon icon={faLinkedin} /> Profile
            </a>
          </div>
          <div className="team-member">
            <img src={mohit} alt="Mohit Jaiswal" />
            <h3>Mohit Jaiswal</h3>
            <p>UI/UX Designer</p>
            <a
              href="https://www.linkedin.com/in/mohit-jaiswal-o7/"
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-link"
              onClick={() => handleProfileClick('Mohit Jaiswal')}
            >
              <FontAwesomeIcon icon={faLinkedin} /> Profile
            </a>
          </div>
          <div className="team-member">
            <img src={abdul} alt="Abdul Rafey Ansari" />
            <h3>Abdul Rafey Ansari</h3>
            <p>Data Scientist</p>
            <a
              href="https://www.linkedin.com/in/abdul-rafey-ansari-2940a024b/"
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-link"
              onClick={() => handleProfileClick('Abdul Rafey Ansari')}
            >
              <FontAwesomeIcon icon={faLinkedin} /> Profile
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
