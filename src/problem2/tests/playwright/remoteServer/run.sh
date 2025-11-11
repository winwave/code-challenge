#!/bin/bash

REMOTE_SERVER_PATH="tests/playwright/remoteServer"

# Start the docker-compose services with the custom project name
docker-compose -p mt-link-console -f "$REMOTE_SERVER_PATH/docker-compose.yml" up -d playwright-server

# Check if the previous command was successful
if [ $? -ne 0 ]; then
  echo "Failed to start Docker services. Exiting..."
  exit 1
fi

# Run Playwright tests
npx playwright test --ui --config "$REMOTE_SERVER_PATH/playwrightRemote.config.ts"

# Check if the Playwright test was successful
if [ $? -ne 0 ]; then
  echo "Playwright tests failed. Stopping Docker..."
  docker-compose -p mt-link-console down
  exit 1
fi

# Bring down the Docker services after tests complete
docker-compose -p mt-link-console down

# Check if Docker services were brought down successfully
if [ $? -ne 0 ]; then
  echo "Failed to stop Docker services."
  exit 1
fi

echo "All tasks completed successfully."
