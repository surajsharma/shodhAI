FROM openjdk:17-slim

WORKDIR /app

# Install timeout command for enforcing time limits
RUN apt-get update && \
    apt-get install -y coreutils && \
    rm -rf /var/lib/apt/lists/*

# Default command
CMD ["bash"]