#!/usr/bin/env python
import os
import glob

# Fix all Vue component files
components_dir = r"c:\Users\LENOVO\Desktop\PROGRAMMING\Portfolio\HOA\frontend\src\components"
vue_files = glob.glob(os.path.join(components_dir, "*.vue"))

for filepath in vue_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Simple string replacement: replace ': ' quotes
    while ": '" in content:
        # Find the pattern and replace it
        start = content.find(": '")
        if start == -1:
            break
        # Find matching closing quote
        end = content.find("'", start + 3)
        if end == -1:
            break
        # Extract the value between quotes
        value = content[start+3:end]
        # Replace with unquoted version
        content = content[:start] + ": " + value + content[end+1:]
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'✓ Fixed: {os.path.basename(filepath)}')

print("\nAll Vue components fixed!")
