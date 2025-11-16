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

# Create temp file with new entries
TEMP_NEW=$(mktemp)

# Process new commits and group by date
echo "$NEW_COMMITS" | awk -F'|' '
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
        
        printf "%s\036", date
        print dates[date]
    }
}' > "$TEMP_NEW"

# Merge with existing changelog using Python
python3 - "$OUTPUT_FILE" "$TEMP_NEW" << 'PYTHON_SCRIPT'
import json
import sys

# Read existing changelog
with open(sys.argv[1], 'r') as f:
    changelog = json.load(f)

# Create a dict for easier merging (date -> changes list)
changelog_dict = {}
for entry in changelog:
    date = entry['date']
    changelog_dict[date] = entry['changes']

# Read new entries
with open(sys.argv[2], 'r') as f:
    for line in f:
        if line.strip():
            parts = line.strip().split('\036')
            date = parts[0]
            changes = parts[1].split('\036') if len(parts) > 1 else []
            
            # Add to existing date or create new
            if date in changelog_dict:
                changelog_dict[date].extend(changes)
            else:
                changelog_dict[date] = changes

# Convert back to list format, sorted by date (newest first)
result = []
for date in sorted(changelog_dict.keys(), reverse=True):
    result.append({
        'date': date,
        'changes': changelog_dict[date]
    })

# Write output
with open(sys.argv[1], 'w') as f:
    json.dump(result, f, indent=2, ensure_ascii=False)

PYTHON_SCRIPT

rm "$TEMP_NEW"

# Save the last commit hash
git log -1 --pretty=format:"%H" > "$LAST_COMMIT_FILE"

echo "✅ Changelog updated with new entries"
