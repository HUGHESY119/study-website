# Deploying to AWS EC2

This guide walks you through deploying the AI Study Companion application to an AWS EC2 instance.

## Prerequisites

1.  An AWS EC2 instance (Ubuntu 22.04 or 24.04 recommended).
2.  SSH access to your instance.
3.  Port **3000** must be open in your EC2 Security Group for inbound traffic (`Custom TCP`, Port Range: `3000`, Source: `0.0.0.0/0`).

## Option 1: Deploying with Docker (Recommended)

Docker is the easiest way to deploy the application because it packages everything including Node.js.

### 1. Connect to your EC2 instance

```bash
ssh -i /path/to/your-key.pem ubuntu@your-ec2-public-ip
```

### 2. Install Docker

```bash
# Update package list
sudo apt update -y

# Install Docker
sudo apt install -y docker.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# (Optional) Add your user to the docker group to run docker without sudo
sudo usermod -aG docker ubuntu
# Note: You may need to log out and log back in for this to take effect
```

### 3. Clone or copy your code to the server

Transfer your code using `git clone`, `scp`, or `rsync`.

```bash
git clone <your-repository-url>
cd <your-repository-folder>
```

### 4. Configure Environment Variables

Create a `.env` file in the root of your project:

```bash
nano .env
```

Add your Gemini API Key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 5. Build and Run the Docker Container

```bash
# Build the Docker image
sudo docker build -t study-companion .

# Run the container in the background
sudo docker run -d -p 3000:3000 --env-file .env --name study-app --restart always study-companion
```

Your app is now running! Visit `http://your-ec2-public-ip:3000` in your browser.

---

## Option 2: Deploying with PM2 (Native Node.js)

If you prefer not to use Docker, you can run the app directly using Node.js and PM2 to keep it alive.

### 1. Connect to your EC2 instance

```bash
ssh -i /path/to/your-key.pem ubuntu@your-ec2-public-ip
```

### 2. Install Node.js (v20)

```bash
# Install curl
sudo apt-get install -y curl

# Download and install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Clone or copy your code to the server

```bash
git clone <your-repository-url>
cd <your-repository-folder>
```

### 4. Install Dependencies & Build

```bash
# Install all dependencies
npm install

# Build the client and the server
npm run build
```

### 5. Configure Environment Variables

```bash
nano .env
```
Add:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 6. Start the App with PM2

PM2 is a process manager that keeps your app running in the background and restarts it if it crashes.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the compiled server
pm2 start dist/server.cjs --name "study-companion"

# Ensure PM2 restarts on server reboot
pm2 startup
pm2 save
```

Your app is now running! Visit `http://your-ec2-public-ip:3000` in your browser.

## Upload Functionality Notes
The application now supports file uploads up to 20MB directly to the EC2 instance's `tmp/flashcard-uploads` project directory. It securely reads the files, extracts text using Gemini 3.5 Flash, and immediately cleans up the local storage to prevent disk space issues on your VM.
