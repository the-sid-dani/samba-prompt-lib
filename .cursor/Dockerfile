# Use Node.js LTS as base image
FROM node:20-bullseye

# Install system dependencies and development tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    vim \
    build-essential \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -s /bin/bash ubuntu

# Set working directory to user's home
WORKDIR /home/ubuntu

# Install global Node.js development tools
RUN npm install -g pnpm typescript @types/node

# Set proper ownership of the working directory
RUN chown -R ubuntu:ubuntu /home/ubuntu

# Switch to non-root user
USER ubuntu

# Set environment variables
ENV NODE_ENV=development
ENV PNPM_HOME="/home/ubuntu/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Initialize pnpm
RUN pnpm setup

# Expose common development ports
EXPOSE 3000 3001 5432 54321
