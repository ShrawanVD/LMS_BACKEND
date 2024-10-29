# Use Node.js version 14 as the base image
FROM node:18

# Update Ubuntu's package list
RUN apt-get update

# Set the working directory inside the container
WORKDIR /usr/src/app
# EXPOSE 3100

# Copy package.json and package-lock.json to WORKDIR
COPY package*.json ./

# Install dependencies`
RUN npm install

# Copy all files from current directory to WORKDIR
COPY . .

# adding Environment variables
ENV AZURE_CLIENT_ID="b3dd18f1-e35f-4f1d-9a13-8e206d23140a"
ENV AZURE_CLIENT_SECRET="KfZ8Q~g5fFRyhEHn~pLQyUgsbqZd5tTDPs10Edk."
ENV AZURE_TENANT_ID="1fcde487-2df2-45a8-a703-6db29b47968f"
ENV MONGO_DB_URI="mongodb+srv://shravan:1234@cluster0.twakfwc.mongodb.net/curiotoryBackend?retryWrites=true&w=majority&appName=Cluster0"
ENV ONE_DRIVE_FOLDER="Lead Demo"
ENV ONE_DRIVE_REDIRECT_URI="http://localhost:3000/auth/callback"
ENV RAZORPAY_KEY_ID="rzp_live_6ht8FWR2aK0Ug5"
ENV RAZORPAY_SECRET="TCiNbRMLZcs1Mceyvki5NNzU"

# Command to run the application
CMD ["node", "index.js"]
