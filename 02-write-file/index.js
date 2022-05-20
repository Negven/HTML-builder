const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Привет, введи пожалуйста текст\n');


stdin.on('data', data => {

  data = data.toString().split('').splice(0, data.toString().split('').length - 2).join('');
  if(data === 'exit') {
    process.exit();
  }
  writeStream.write(Buffer.from(data + '\n'));
});

process.on('exit', () => stdout.write('Пока'));
process.on('SIGINT', () => process.exit());