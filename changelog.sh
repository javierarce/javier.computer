#!/bin/bash
# generate_changelog.sh
# Place this in your Jekyll root directory

OUTPUT_FILE="_data/changelog.json"

# Create _data directory if it doesn't exist
mkdir -p _data

# Start JSON array
echo "[" > $OUTPUT_FILE

# Get all commits with "doc:" prefix, grouped by date
git log --grep="^doc:" --pretty=format:"%ai|%s" --reverse | \
awk -F'|' '{
    date = substr($1, 1, 10)
    msg = $2
    sub(/^doc: /, "", msg)
    dates[date] = dates[date] (dates[date] ? "|||" : "") msg
}
END {
    first = 1
    for (date in dates) {
        if (!first) printf ",\n"
        first = 0
        printf "  {\n    \"date\": \"%s\",\n    \"changes\": [\n", date
        
        split(dates[date], messages, "|||")
        for (i in messages) {
            if (i > 1) printf ",\n"
            printf "      \"%s\"", messages[i]
        }
        printf "\n    ]\n  }"
    }
}' >> $OUTPUT_FILE

# Close JSON array
echo "" >> $OUTPUT_FILE
echo "]" >> $OUTPUT_FILE

echo "✅ Changelog generated at $OUTPUT_FILE"
