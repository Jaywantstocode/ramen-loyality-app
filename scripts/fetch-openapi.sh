#!/bin/bash

# Set variables
API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:5050}
SWAGGER_ENDPOINT="/api-json"
OUTPUT_DIR="./docs"
OUTPUT_FILE="$OUTPUT_DIR/openapi.yaml"

# Create output directory if it doesn't exist
mkdir -p $OUTPUT_DIR

echo "Fetching OpenAPI specification from $API_URL$SWAGGER_ENDPOINT..."

# Fetch the OpenAPI JSON and convert to YAML
if command -v npx &> /dev/null; then
  # Use npx if available
  curl -s "$API_URL$SWAGGER_ENDPOINT" | npx json2yaml > "$OUTPUT_FILE"
elif command -v json2yaml &> /dev/null; then
  # Use json2yaml if installed
  curl -s "$API_URL$SWAGGER_ENDPOINT" | json2yaml > "$OUTPUT_FILE"
else
  # Fallback to temporary JSON file if json2yaml is not available
  TEMP_JSON="$OUTPUT_DIR/openapi.json"
  curl -s "$API_URL$SWAGGER_ENDPOINT" > "$TEMP_JSON"
  
  echo "json2yaml not found. Installing yaml package..."
  npm install -g yaml
  
  # Convert using Node.js
  node -e "
    const fs = require('fs');
    const yaml = require('yaml');
    const json = JSON.parse(fs.readFileSync('$TEMP_JSON', 'utf8'));
    fs.writeFileSync('$OUTPUT_FILE', yaml.stringify(json));
    fs.unlinkSync('$TEMP_JSON');
  "
fi

# Check if the file was created successfully
if [ -f "$OUTPUT_FILE" ]; then
  echo "OpenAPI specification saved to $OUTPUT_FILE"
  
  # Update the OpenAPI version to 3.0.0 if needed (NestJS might generate 3.0.1)
  sed -i.bak 's/^openapi: 3\.0\.1/openapi: 3.0.0/' "$OUTPUT_FILE" && rm "${OUTPUT_FILE}.bak"
  
  echo "You can now generate API clients using: npm run generate-api"
else
  echo "Failed to save OpenAPI specification"
  exit 1
fi 