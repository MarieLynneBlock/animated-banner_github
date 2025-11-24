#!/bin/bash

ICONS_DIR="assets/icons"
OUTPUT_FILE="assets/icons-list.json"

# Создаем JSON файл со списком иконок
echo "[" > "$OUTPUT_FILE"

first=true
for ext in png svg jpg jpeg; do
    for file in "$ICONS_DIR"/*."$ext"; do
        if [ -f "$file" ]; then
            if [ "$first" = false ]; then
                echo "," >> "$OUTPUT_FILE"
            fi
            first=false
            
            filename=$(basename "$file")
            name=$(echo "$filename" | sed 's/\.[^.]*$//' | sed 's/[-_]/ /g')
            name=$(echo "$name" | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')
            if [ "$ext" = "svg" ]; then
                type="svg"
            else
                type="png"
            fi
            
            echo "  {" >> "$OUTPUT_FILE"
            echo "    \"name\": \"$name\"," >> "$OUTPUT_FILE"
            echo "    \"src\": \"assets/icons/$filename\"," >> "$OUTPUT_FILE"
            echo "    \"type\": \"$type\"" >> "$OUTPUT_FILE"
            echo -n "  }" >> "$OUTPUT_FILE"
        fi
    done
done

echo "" >> "$OUTPUT_FILE"
echo "]" >> "$OUTPUT_FILE"

echo "✓ Список иконок обновлен: $OUTPUT_FILE"
