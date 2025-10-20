#!/bin/bash

echo "Removing old Vite configuration files..."

rm -f index.html
rm -f vite.config.ts
rm -f tsconfig.app.json
rm -f tsconfig.node.json
rm -f eslint.config.js
rm -f test-buttons.html
rm -f tailwind.config.js
rm -f postcss.config.js
rm -f src/main.tsx
rm -f src/App.tsx
rm -f src/vite-env.d.ts
rm -f src/index.css

echo "Cleanup complete!"
echo "Old Vite files have been removed."
