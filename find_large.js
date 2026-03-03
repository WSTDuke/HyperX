const fs = require('fs');
const path = require('path');

function findLargeFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findLargeFiles(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n').length;
            if (lines > 200) {
                console.log(`${fullPath}: ${lines}`);
            }
        }
    }
}

findLargeFiles(path.join(__dirname, 'src'));
