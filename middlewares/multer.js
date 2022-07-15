const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('FILE EN DESTINATION', file);
    cb(null, 'static/images');
  },
  filename: (req, file, cb) => {
    const randomGenerate = Date.now() + '-' + String(Math.round(Math.random())); // 02/07/2022-5.extension
    cb(null, randomGenerate + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
});

module.exports = { uploadFile: upload };
