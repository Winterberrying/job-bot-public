import React, { useState } from 'react';
import data from '../../backend/personal_details';

const FieldFiller: React.FC = () => {
  const [clipboardMessage, setClipboardMessage] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setClipboardMessage(`Copied: ${text}`);
      setTimeout(() => setClipboardMessage(''), 2000);
    });
  };

  return (
    <div>
      <h3>Personal Details</h3>
      {Object.entries(data.personalDetails).map(([key, value]) => (
        <div key={key}>
          <label>
            {key.replace(/([A-Z])/g, ' $1')}: {value}{' '}
            <button onClick={() => copyToClipboard(value)}>Copy</button>
          </label>
        </div>
      ))}

      <h3>Education</h3>
      {data.education.map((edu, index) => (
        <div key={index}>
          <h4>{index + 1}. {edu.school}</h4>
          <p>Degree: {edu.degree || edu['subject combination']}</p>
          <p>Graduation Year: {edu['graduation year']}</p>
          <p>Achievements: {edu.achievements}</p>
          <button onClick={() => copyToClipboard(edu.school)}>Copy School</button>{' '}
          <button onClick={() => copyToClipboard(edu.achievements)}>Copy Achievements</button>
        </div>
      ))}

      <h3>Work Experience</h3>
      {data.workExperience.map((work, index) => (
        <div key={index}>
          <h4>{index + 1}. {work.title}</h4>
          <p>Job Scope: {work.scope}</p>
          <button onClick={() => copyToClipboard(work.title)}>Copy Title</button>{' '}
          <button onClick={() => copyToClipboard(work.scope)}>Copy Scope</button>
        </div>
      ))}

      <h3>Projects</h3>
      {data.projects.map((project, index) => (
        <div key={index}>
          <h4>{index + 1}. {project.title}</h4>
          <p>Scope: {project.scope}</p>
          <button onClick={() => copyToClipboard(project.title)}>Copy Title</button>{' '}
          <button onClick={() => copyToClipboard(project.scope)}>Copy Scope</button>
        </div>
      ))}

      <h3>Leadership</h3>
      {data.leadership.map((lead, index) => (
        <div key={index}>
          <h4>{index + 1}. {lead.title}</h4>
          <p>Scope: {lead.scope}</p>
          <button onClick={() => copyToClipboard(lead.title)}>Copy Title</button>{' '}
          <button onClick={() => copyToClipboard(lead.scope)}>Copy Scope</button>
        </div>
      ))}

      {clipboardMessage && <p style={{ color: 'green' }}>{clipboardMessage}</p>}
    </div>
  );
};

export default FieldFiller;
