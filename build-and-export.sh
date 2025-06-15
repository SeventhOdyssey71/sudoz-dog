#!/bin/bash

echo "🚀 Building Sudoz Evolution Lab..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out out.zip

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Create a zip file of the out directory
    echo "📦 Creating export package..."
    cd out
    zip -r ../out.zip .
    cd ..
    
    echo "✅ Export complete! File created: out.zip"
    echo "📁 Static files are in the 'out' directory"
    echo ""
    echo "🌐 Deployment instructions:"
    echo "1. Upload the contents of 'out' directory to your hosting provider"
    echo "2. Or use out.zip to deploy on platforms like Vercel, Netlify, or GitHub Pages"
    echo ""
    echo "⚠️  Important notes for deployment:"
    echo "- Ensure your hosting supports SPA routing (fallback to index.html)"
    echo "- Set environment variables if using a platform like Vercel"
    echo "- The BlockVision API key is optional - the app will fallback to direct Sui queries"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi