// const multer = require('multer');
const express = require('express');
const { isAuth } = require('../helpers/utils')
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv')
dotenv.config()


const uploadRouter = express.Router();

// const storage = multer.diskStorage({
//     destination (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename (req, file, cb) {
//         cb(null, `${Date.now()}.jpg`);
//     },
// });

// const upload = multer({ storage });

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_S3_ID,
    secretAccessKey: process.env.AWS_S3_SECRET,
  logger: process.stdout
});

const uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname })
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname)
        }
    })
});

uploadRouter.post('/', isAuth, uploadS3.single('image'), (req, res, next) => {
   
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read',
        Body: JSON.stringify(req.file)
    };
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
           return next(err)
        }
        const returnData = {
            signedRequest: data,
            url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
        };
        res.send(returnData);
    });
});


module.exports = { uploadRouter }