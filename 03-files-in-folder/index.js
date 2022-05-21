const fs = require('fs');
const path = require('path');

(async () => {
  let dir = await fs.promises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, err => console.log(err));
  for(let fileIndex in dir) {
    let file = dir[fileIndex];
    if(file.isFile()) {
      const name = file.name;
      const start = path.parse(path.join(__dirname, 'secret-folder', name)).name;
      const end = path.parse(path.join(__dirname, 'secret-folder', name)).ext;
      fs.stat(path.join(__dirname, 'secret-folder', name), (err, stats) => {
        if (err) throw err;
        const size = stats.size;
        console.log(start + ' - ' + end.slice(1) + ' - ' + size * 0.00097656 + 'kb');
      });
    }
  }
})();
