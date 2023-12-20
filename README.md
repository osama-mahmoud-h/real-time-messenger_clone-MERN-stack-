# Application Setup Guide

This guide outlines the steps for setting up and running the application using Docker and Docker Compose.

## Prerequisites

- Docker installed on your machine. You can download it from [Docker's official site](https://www.docker.com/products/docker-desktop).
- Docker Compose installed (comes with Docker Desktop for Mac and Windows).

## Directory Structure

Your project should have the following directory structure:

project-root/
│
├── client/ # React frontend application
│
├── server/ # Node.js (TypeScript) backend application
│
├── .gitignore # Specifies intentionally untracked files to ignore
│
├── docker-compose.yml # Defines the multi-container Docker application
│
├── Dockerfile # Dockerfile for creating a Docker image
│
└── README.md # README file with instructions


## Docker Compose Configuration

The `docker-compose.yml` file defines the services, networks, and volumes for the application.

### Services

- `client`: The React frontend.
- `server`: The Node.js backend.
- `mongo`: The MongoDB database.

### Volumes

- `mongodb-data`: Persistent volume for MongoDB data.

## Running the Application

To get the application up and running, follow these steps:

1. **Build and Run the Containers**

   Navigate to the project's root directory and run the following command:

   ```sh
   docker-compose up --build

This command will build the images for your frontend and backend if they haven't been built already and start the services defined in docker-compose.yml.

Accessing the Application

The React frontend will be available at http://localhost:3000.
The Node.js backend will be accessible at http://localhost:5000.
Stopping the Application

## Additional Commands

To stop and remove the containers, networks, and volumes created by up, you can use the following command:

docker-compose down
docker-compose up -d
docker-compose logs -f
