const fs = require('fs');
const path = require('path');

let readStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
readStream.on('data', chunk => console.log(chunk));