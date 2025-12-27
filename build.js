const fs = require('fs');
const path = require('path');

// Source directory
const sourceDir = __dirname;

// Directories to copy
const itemsToCopy = ['index.html', 'styles.css', 'script.js', 'images'];

// Create dist directory
const distDir = path.join(sourceDir, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy items
itemsToCopy.forEach(item => {
    const sourcePath = path.join(sourceDir, item);
    const destPath = path.join(distDir, item);

    if (fs.existsSync(sourcePath)) {
        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyDirectory(sourcePath, destPath);
        } else {
            fs.copyFileSync(sourcePath, destPath);
        }
        console.log(`Copied: ${item}`);
    } else {
        console.log(`Warning: ${item} not found`);
    }
});

console.log('\nBuild complete! Files copied to dist/');

function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    entries.forEach(entry => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}