# Job Bot Application

## 🚀 Overview
CH's Career Groove (Job-Bot) is a productivity tool designed to make your job search faster and smarter. It leverages AI to summarize LinkedIn job descriptions, extract essential details, and simplify form filling with its convenient copy-to-clipboard functionality.

### ✨ Key Features:
1. **Chrome Extension Integration**  
   - A seamless Chrome extension to interact with job descriptions directly from your browser.
   
2. **AI-Powered Job Description Summarization**  
   - Extracts key details from LinkedIn job descriptions:
     - **Job Title**  
     - **Company Information**  
     - **Required Skills**  
     - **Years of Experience (YOE)**  
     - **Full Job Description**
   
3. **Form Filling Assistant**  
   - Quickly copy relevant information to your clipboard for effortless form filling.

---

## 🛠️ Installation & Setup

### Prerequisites:
- [Node.js](https://nodejs.org/) (for the frontend)  
- [Docker](https://www.docker.com/)  
- Python 3.9+ (for the backend)

### Frontend: React + TypeScript + Vite
1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/job-bot.git
   cd job-bot
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Run the development server:  
   ```bash
   npm run dev
   ```

### Backend: FastAPI
1. Set up a Python virtual environment:  
   ```bash
   python -m venv venv
   source venv/bin/activate # For Linux/macOS
   venv\Scripts\activate    # For Windows
   ```

2. Install dependencies:  
   ```bash
   pip install -r requirements.txt
   ```

3. Start the backend server:  
   ```bash
   python -m uvicorn summarizer:app --reload
   ```

### Docker Deployment
1. Start the Docker containers:
   ```bash
   docker-compose up --build
   ```
2. Stop and remove the containers:
   ```bash
   docker-compose down
   ```
3. View logs:
   ```bash
   docker-compose logs
   ```

---

## 🧩 Chrome Extension Setup

1. Navigate to the `chrome-extension` directory in the repository.
2. Load the unpacked extension in Chrome:
   - Go to `chrome://extensions/`.
   - Enable "Developer mode."
   - Click on "Load unpacked" and select the `chrome-extension` folder.
3. The extension should now be visible in your browser's toolbar.

---

## 🔮 How It Works

1. **Summarization**:  
   When viewing a LinkedIn job posting, click on the Chrome extension to summarize the job description. The extracted details are displayed in an easy-to-read format.
   
2. **Form Filling**:  
   Use the "Copy to Clipboard" feature to copy specific fields like the job title, company name, or skills. Paste the copied information into application forms with a single click.

---

## 📚 Technologies Used

### Frontend:
- React
- TypeScript
- Vite

### Backend:
- FastAPI
- Python
- Docker

### Others:
- Chrome Extension
- AI/ML Libraries (e.g., OpenAI API for summarization)

---

## 🌟 Future Enhancements
- Host backend on Cloud Server

- ---
## DEMO

https://github.com/user-attachments/assets/803a183d-b8c9-4c00-a170-312e9d1c475c

