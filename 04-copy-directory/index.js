const fs = require('fs');
const path = require('path');

(async () => {
  let dir = await fs.promises.readdir(path.join(__dirname, 'files'), {withFileTypes: true}, err => console.log(err));
  await fs.mkdir(path.join(__dirname, 'files-copy'), err => err);
  for(let fileIndex in dir) {
    let file = dir[fileIndex];
    if(file.isFile()) {
      const oldLink = path.join(__dirname, 'files', file.name);
      const newLink = path.join(__dirname, 'files-copy', file.name);
      await fs.copyFile(oldLink, newLink, err => err);
    }
  }
})();
