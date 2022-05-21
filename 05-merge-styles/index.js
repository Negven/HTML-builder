const fs = require('fs');
const path = require('path');
const {createWriteStream, createReadStream} = require('fs');

(async () => {
  let dir = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, err => console.log(err));
  fs.unlink(path.join(__dirname, 'project-dist'), err => err);
  const writeStream = createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
  for(let fileIndex in dir) {
    let file = dir[fileIndex];
    if(file.isFile() && path.parse(path.join(__dirname, file.name)).ext === '.css') {
      console.log(file);
      const readStream = createReadStream(path.join(__dirname, 'styles', file.name));
      readStream.pipe(writeStream);
    }
  }
})();
