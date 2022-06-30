let cloudinary = require('cloudinary').v2;
let { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

let storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'amazon-items',
        allowed_formats: ['jpg', 'jpeg', 'png']
    }
});

module.exports = storage;