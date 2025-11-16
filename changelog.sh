#!/bin/bash
# generate_changelog.sh
# Place this in your Jekyll root directory

OUTPUT_FILE="CHANGELOG.md"

echo "# Changelog" > $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo "All notable changes to this project are documented here." >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Get all commits with "Changelog: yes" in the message
git log --grep="Changelog: yes" --pretty=format:"%H|%ai|%s|%b" --reverse | while IFS='|' read -r hash date subject body; do
    # Extract just the date (YYYY-MM-DD)
    short_date=$(echo $date | cut -d' ' -f1)
    
    # Remove the "Changelog: yes" line from body
    clean_body=$(echo "$body" | grep -v "Changelog: yes" | sed '/^$/d')
    
    echo "## $(echo $subject | sed 's/^[a-z]*: //')" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
    echo "_${short_date}_" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
    
    if [ -n "$clean_body" ]; then
        echo "$clean_body" >> $OUTPUT_FILE
        echo "" >> $OUTPUT_FILE
    fi
    
    echo "---" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
done

echo "✅ Changelog generated at $OUTPUT_FILE"
