#!/bin/bash
# generate_changelog.sh
# Place this in your Jekyll root directory

OUTPUT_FILE="_data/changelog.json"
LAST_COMMIT_FILE="_data/.changelog_last_commit"

# Create _data directory if it doesn't exist
mkdir -p _data

# Initialize changelog if it doesn't exist
if [ ! -f "$OUTPUT_FILE" ]; then
    echo "[]" > $OUTPUT_FILE
fi

# Get the last processed commit hash
if [ -f "$LAST_COMMIT_FILE" ]; then
    LAST_COMMIT=$(cat "$LAST_COMMIT_FILE")
    COMMIT_RANGE="${LAST_COMMIT}..HEAD"
else
    # First run - get all commits
    COMMIT_RANGE="HEAD"
fi

# Get new commits with "doc:" prefix
NEW_COMMITS=$(git log --grep="^doc:" --pretty=format:"%H|%ai|%s" --reverse $COMMIT_RANGE)

if [ -z "$NEW_COMMITS" ]; then
    echo "ℹ️  No new changelog entries found"
    exit 0
fi

# Read existing changelog
EXISTING_JSON=$(cat "$OUTPUT_FILE")

# Remove closing bracket from existing JSON
EXISTING_JSON=$(echo "$EXISTING_JSON" | sed '$ d')

# Check if we need a comma (if there's existing content)
if [ "$EXISTING_JSON" != "[" ]; then
    NEEDS_COMMA=true
else
    NEEDS_COMMA=false
fi

# Create temp file for new entries
TEMP_FILE=$(mktemp)
echo "$EXISTING_JSON" > "$TEMP_FILE"

# Process new commits and group by date
echo "$NEW_COMMITS" | awk -F'|' -v needs_comma="$NEEDS_COMMA" '
BEGIN {
    first_entry = 1
}
{
    hash = $1
    date = substr($2, 1, 10)
    msg = $3
    sub(/^doc: /, "", msg)
    gsub(/"/, "\\\"", msg)
    
    if (dates[date] == "") {
        date_order[++date_count] = date
    }
    dates[date] = dates[date] (dates[date] ? "\036" : "") msg
}
END {
    for (idx = 1; idx <= date_count; idx++) {
        date = date_order[idx]
        
        if (!first_entry || needs_comma == "true") {
            printf ",\n"
        }
        first_entry = 0
        
        printf "  {\n    \"date\": \"%s\",\n    \"changes\": [\n", date
        
        n = split(dates[date], messages, "\036")
        for (i = 1; i <= n; i++) {
            if (i > 1) printf ",\n"
            printf "      \"%s\"", messages[i]
        }
        printf "\n    ]\n  }"
    }
}' >> "$TEMP_FILE"

# Close JSON array
echo "" >> "$TEMP_FILE"
echo "]" >> "$TEMP_FILE"

# Replace the original file
mv "$TEMP_FILE" "$OUTPUT_FILE"

# Save the last commit hash
git log -1 --pretty=format:"%H" > "$LAST_COMMIT_FILE"

echo "✅ Changelog updated with new entries"
