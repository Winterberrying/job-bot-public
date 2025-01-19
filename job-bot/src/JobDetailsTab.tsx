import React, { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface JobDetails {
  jobTitle: string;
  jobDescription: string;
  company: string;
}

const JobDetailsTab: React.FC = () => {
  const [jobTitle, setJobTitle] = useState<string>('');
  const [_jobDescription, setJobDescription] = useState<string>('');
  const [_company, setCompany] = useState<string>('');
  const [yearsOfExp, setYearsOfExp] = useState<string>('');
  const [jobSummary, setJobSummary] = useState<string>('');
  const [companyDetails, setCompanyDetails] = useState<string>('');
  const [foundSkills, setFoundSkills] = useState<string[]>([]);
  const [instruction1, _setInstruction1] = useState("Extract detailed information about the company from a given LinkedIn job description listing. Present the information in plain text without any bolding, bullet points, special formatting, preamble or additional commentary. Ensure the text is readable and concise. Keep it within 3 short sentences.");
  const [instruction2, _setInstruction2] = useState("Identify and list the specific job responsibilities mentioned in a given LinkedIn job description listing. Present the information in plain text without any bolding, bullet points, special formatting, preamble or additional commentary. Ensure the text is readable and concise.");

  // Function to get job details
  const getJobDetails = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id! },
          func: extractJobDetails,
        },
        (result) => {
          if (result && result[0] && result[0].result) {
            const { jobTitle, jobDescription, company }: JobDetails = result[0].result;
            setJobTitle(jobTitle);
            setJobDescription(jobDescription);
            setCompany(company);

            yoeJobDetails(jobDescription);
            JobDetailsSummary(jobDescription, instruction2);
            parseSkills(jobDescription);
            getCompanyDetails(jobDescription, instruction1);

          }
        }
      );
    });
  };

  // Fetch data and update the state
  const yoeJobDetails = async (description: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(description),
      });
      const data = await response.json();
      setYearsOfExp(data.years_of_experience || 'No YOE available');
    } catch (error) {
      console.error('Error getting YOE from job details:', error);
    }
  };

  const JobDetailsSummary = async (description: string, instruction: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/summarize_two', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, instruction }),
      });
      const data = await response.json();
      setJobSummary(data.summary || 'No summary available');
    } catch (error) {
      console.error('Error getting summary:', error);
    } 
  };

  const parseSkills = async (description: string) => {
    try {
      const response = await fetch("http://localhost:8000/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(description),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch skills");
      }

      const data = await response.json();
      setFoundSkills(data.found_skills || 'No skills available');
    } catch (error) {
      console.error("Error parsing skills:", error);
    }
  };

  const getCompanyDetails = async (description: string, instruction: string) => {
    try {
      const response = await fetch("http://localhost:8000/summarize_two", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({description, instruction}),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch company details");
      }

      const data = await response.json();
      setCompanyDetails(data.summary || 'No company details available');

    } catch (error) {
      console.error("Error parsing skills:", error);
    }
  }

  const getActiveTabUrl = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          resolve(tabs[0].url);
        } else {
          reject('Unable to retrieve the URL of the active tab.');
        }
      });
    });
  };
  

  const saveToExcelWithExcelJS = async () => {
    try {
      const jobLink = await getActiveTabUrl(); // Get the correct active tab URL
      console.log('Active Tab URL:', jobLink);

      const workbook = new ExcelJS.Workbook();
      let worksheet;
    
      // Check if the workbook already has a worksheet
      worksheet = workbook.addWorksheet('Job Details');
      worksheet.columns = [
        { header: 'Job Title', key: 'jobTitle' },
        { header: 'Company', key: 'company' },
        { header: 'Link', key: 'link' },
      ];
    
      // Append new data
      worksheet.addRow({
        jobTitle: jobTitle,
        company: _company,
        link: jobLink,
      });
    
      // Generate the file in the browser
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
      // Use file-saver to save the file
      saveAs(blob, 'JobsApplied.xlsx');
      alert('Job details saved successfully!');
    } catch (error) {
      console.error('Error saving job details to Excel:', error);
      alert('Error saving job details to Excel. Please try again later.');
    }
  };

  useEffect(() => {
    getJobDetails();
  }, []);

  return (
    <div>
          <div>
            <h2>{jobTitle || 'Loading...'}</h2>
          </div>

          <div>
            <h3>Job Description</h3>
            <ul>
              {(jobSummary || 'Loading...').split('.').map((sentence, index) => 
                sentence.trim() ? <li key={index}>{sentence.trim()}.</li> : null
              )}
            </ul>
          </div>


          <div>
            <h3>Min. Years Of Experience / Min. Qualification</h3>
            <p>{yearsOfExp || 'Loading...'}</p>
          </div>

          <div>
            <h3>Company Description</h3>
            <ul>
              {(companyDetails || 'Loading...').split('.').map((sentence, index) => 
                sentence.trim() ? <li key={index}>{sentence.trim()}.</li> : null
              )}
            </ul>
          </div>


          <div>
            <h3>Skills Required</h3>
            <div>
              {foundSkills.length > 0 ? (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {foundSkills.map((skill, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        backgroundColor: '#aabfb8',
                        color: '#333',
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No skills available</p>
              )}
            </div>
          </div>

          {/* Save to Excel Button */}
          <button onClick={saveToExcelWithExcelJS} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
            Save to Excel
          </button>

    </div>
  );
};

export default JobDetailsTab;

// Function to extract job details from the webpage
function extractJobDetails(): JobDetails {
  const jobTitle = document.querySelector('h1 > a')?.textContent?.trim() || '';
  const jobDescription = document.querySelector('div.mt4 > p[dir="ltr"]')?.textContent?.trim() || '';
  const company = document.querySelector('.job-details-jobs-unified-top-card__company-name')?.textContent?.trim() || '';

  return { jobTitle, jobDescription, company };
}
