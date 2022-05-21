const fs = require('fs');
const path = require('path');
const {Transform, pipeline} = require('stream');
const {createWriteStream, createReadStream} = require('fs');

async function copyDir (pathDir, pathCopyDir) {
  const files = await fs.promises.readdir(pathDir, {withFileTypes: true}, err => err);
  for(let fileIndex in files) {
    let file = files[fileIndex];
    if(file.isFile()) {
      const oldLink = path.join(pathDir, file.name);
      const newLink = path.join(pathCopyDir, file.name);
      await fs.copyFile(oldLink, newLink, err => err);
    }
    else {
      await fs.mkdir(path.join(pathCopyDir, file.name), err => err);
      await copyDir(path.join(pathDir, file.name), path.join(pathCopyDir, file.name));
    }
  }
}

(async () => {
  await fs.mkdir(path.join(__dirname, 'project-dist'), err => err);

  let dir = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, err => err);
  fs.unlink(path.join(__dirname, 'project-dist', 'styles.css'), err => err);
  const writeStream = createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  for(let fileIndex in dir) {
    let file = dir[fileIndex];
    if(file.isFile() && path.parse(path.join(__dirname, file.name)).ext === '.css') {
      const readStream = createReadStream(path.join(__dirname, 'styles', file.name));
      readStream.pipe(writeStream);
    }
  }

  await fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), err => err);
  await copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));

  fs.unlink(path.join(__dirname, 'project-dist', 'index.html'), err => err);
  const componentsFiles = await  fs.promises.readdir(path.join(__dirname, 'components'), err => err);
  let components = {};
  for(let componentIndex in componentsFiles) {
    let component = componentsFiles[componentIndex];

    components[path.parse(path.join(__dirname, component)).name] = await fs.promises.readFile(path.join(__dirname, 'components', component), { encoding: 'utf-8'});
  }

  const readStreamHtml = fs.createReadStream(path.join(__dirname, 'template.html'));
  await fs.unlink(path.join(__dirname, 'project-dist', 'index.html'), err => err);
  const writeStreamHtml = await fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));

  const transformComponents = new Transform({
    transform(chunk, encoding, callback) {
      let stringChunk = chunk.toString();
      for(let component in components) {
        if(stringChunk.includes(`{{${component}}}`)) {
          let chunkArray = stringChunk.split(`{{${component}}}`);
          stringChunk = chunkArray.join(components[component]);
        }
      }
      const newChunk = Buffer.from(stringChunk);
      this.push(newChunk);
      callback();
    }
  });

  pipeline(
    readStreamHtml,
    transformComponents,
    writeStreamHtml,
    err => {
      if (err) console.log(err);
    }
  );
})();
