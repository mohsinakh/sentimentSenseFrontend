import React, { useState, useEffect } from 'react';
import "./css/Docs.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faKey, faDatabase } from "@fortawesome/free-solid-svg-icons";
import docsData from '../data/docs.json';  // Import JSON file
import Loading from './Loading';

const Docs = () => {
  const [openSections, setOpenSections] = useState({});
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    setDocs(docsData); // Load data from docs.json
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!docs) return <Loading/>;  // Show loading if docs are not yet set

  return (
    <div className="docs-container">
      <h1 className="docs-title">📖 Sentiment Analysis Platform Documentation</h1>
      <p className="docs-subtitle">
        Welcome to the <strong>Sentiment Analysis Platform</strong> documentation! This guide covers everything you need to know.
      </p>

      {/* Table of Contents */}
      <div className="table-of-contents">
        <h2>📌 Table of Contents</h2>
        <ul>
          {docs.sections.map((section) => (
            <li key={section.key} onClick={() => toggleSection(section.key)}>🔹 {section.title}</li>
          ))}
        </ul>
      </div>

      {/* Sections */}
      {docs.sections.map((section) => (
        <div key={section.key} className="docs-section">
          <h2 className="section-title" onClick={() => toggleSection(section.key)}>
            <FontAwesomeIcon icon={openSections[section.key] ? faChevronUp : faChevronDown} /> {section.title}
          </h2>
          {openSections[section.key] && <p className="section-content">{section.content}</p>}
        </div>
      ))}

      {/* API Endpoints */}
      <div className="docs-section">
        <h2 className="section-title" onClick={() => toggleSection('api')}>
          <FontAwesomeIcon icon={openSections.api ? faChevronUp : faChevronDown} /> 📡 API Endpoints
        </h2>
        {openSections.api && (
          <div>
            <h3><FontAwesomeIcon icon={faKey} /> Authentication Endpoints</h3>
            <pre className="code-block">
              <code>
                {docs.api_endpoints.authentication.join("\n")}
              </code>
            </pre>

            <h3><FontAwesomeIcon icon={faDatabase} /> Sentiment Analysis Endpoints</h3>
            <pre className="code-block">
              <code>
                {docs.api_endpoints.sentiment_analysis.join("\n")}
              </code>
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="footer-note">📌 Need help? Visit our <a href="/support">Support Page</a>.</p>
    </div>
  );
}

export default Docs;
