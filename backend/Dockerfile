# Use a lightweight Python image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy only the requirements file to install dependencies
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app's code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Command to run uvicorn with reload for development
CMD ["uvicorn", "summarizer:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
