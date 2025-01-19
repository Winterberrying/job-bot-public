import React, { useState } from 'react';
import './App.css';

// Tab components
import JobDetailsTab from './JobDetailsTab.tsx';
import FieldFillerTab from './FieldFiller.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('jobDetails'); // Default tab

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className="App">
      <h1>CH's Career Groove 🪴</h1>

      {/* Tab Navigation */}
      <div className="tabs">
        <button
          onClick={() => handleTabChange('jobDetails')}
          className={activeTab === 'jobDetails' ? 'active' : ''}
        >
          Job Details
        </button>
        <button
          onClick={() => handleTabChange('FieldFiller')}
          className={activeTab === 'FieldFiller' ? 'active' : ''}
        >
          Field Filler
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'jobDetails' && <JobDetailsTab />}
      {activeTab === 'FieldFiller' && <FieldFillerTab />}
    </div>
  );
};

export default App;
