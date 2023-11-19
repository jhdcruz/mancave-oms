#!/bin/bash

# Function to process a file
process_file() {
    local file="$1"
    local filename=$(basename "$file" .d2)

    # Run the command for SVG in the background
    d2 "$file" "$filename.svg" --layout=elk &

    # Run the command for PNG in the background
    d2 "$file" "$filename.png" --layout=elk &
}

# Loop through all .d2 files in the specified directory
for file in ./*.d2; do
    # Process each file in parallel
    process_file "$file"
done

# Wait for all background processes to finish
wait
