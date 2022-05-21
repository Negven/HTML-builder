const fs = require('fs');
const path = require('path');

(async () => {
  let dir = await fs.promises.readdir(path.join(__dirname, 'files'), {withFileTypes: true}, err => console.log(err));
  await fs.promises.rm(path.join(__dirname, 'files-copy'),{ force: true, recursive: true }, err => err);
  await fs.promises.mkdir(path.join(__dirname, 'files-copy'), { force: true }, err => err);
  for(let fileIndex in dir) {
    let file = dir[fileIndex];
    if(file.isFile()) {
      const oldLink = path.join(__dirname, 'files', file.name);
      const newLink = path.join(__dirname, 'files-copy', file.name);
      fs.copyFile(oldLink, newLink, err => err);
    }
  }
})();
