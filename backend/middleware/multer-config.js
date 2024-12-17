const multer = require('multer');
const path = require('path');


// Storage configuration for file uploads: create 3
// separate subfolders for video, GIF and images
// depending on which save in different subfolder
const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        if(file.mimetype.startsWith('image/') && file.mimetype !== 'image.gif'){
            // it's an image
            callback(null, 'uploads/images/');
        } else if(file.mimetype.startsWith('video')){
            // it's a video
            callback(null, 'uploads/video/');
        } else if(file.mimetype === 'image/gif'){
            // it's a gif
            callback(null, 'uploads/gifs/');
        } else{
            callback(new Error('Invalid file type'), null);
        }
    },
    filename: (req, file, callback)=>{
        // rename the orignal name of uploaded file and remove the extension
        const name = file.originalname.split(' ').join('_').replace(/\.[^/.]+$/, "");
        const extension = path.extname(file.originalname);
        callback(null, name + '-' + Date.now() + extension);
    }
});

/**
 * Filter uploaded files: Only accept images, videos and GIF with certain format:
 * miming 9GAG or Reddit
 */
const fileFilter = (req, file, callback)=>{
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm', 'image/gif'];
    if(allowedTypes.includes(file.mimetype)){
        // accept the file
        callback(null, true);
    }else{
        callback(new Error('Invalid file type: Only JPEG, PNG, MP4, WebM and GIF are allowed'));
    }
};

/**
 * filter file's sizes: Stopping to big or to heavy files to be uploaded
 * to the server
 */
const fileSize = (req, file, callback)=>{
    if(file.mimetype.startsWith('image/')){
        // as 9GAG or Reddit, limit to 10MB for images
        callback(null, 10 * 1024 * 1024);
    } else if (file.mimetype.startsWith('video/')){
        // limit to 100MB for videos
        callback(null, 100 * 1024 * 1024);
    } else if (file.mimetype.startsWith('image/gif')){
        // limit to 5MB for GIF
        callback(null, 5 * 1024 * 1024);
    } else{
        callback(new Error('Invalid file type'));
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits:{
        fileSize: fileSize
    },
});

/**
 * maxCount to limit the number of uploaded files of each type
 */
module.exports = upload.fields([
    {name: 'video', maxCount: 1},
    {name: 'image', maxCount: 5},
    {name: 'gif', maxCount: 1}
]);