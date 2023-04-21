import aws from 'aws-sdk';

import config from '../utils/env.js';

import createError from 'http-errors';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

aws.config.update(
  {
    secretAccessKey: config.aws.secretAccessKey,
    accessKeyId: config.aws.accessKeyId,
    region: config.aws.region,
  },
  function (err) {
    if (err) {
      console.log(err);
    }
  }
);

const s3 = new aws.S3();

export default multer({
  storage: multerS3({
    s3: s3,
    bucket: config.aws.bucket,
    key: function (req, file, cb) {
      cb(
        null,
        `users/${req.authenticatedUser._id}/portrait${path.extname(
          file.originalname
        )}`
      );
    },
  }),
  limits: { fileSize: 8000000 }, // In bytes: 8000000 bytes = 8 MB
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/.(jpg|jpeg|png|webp|gif)$/gm)) {
      return cb(
        createError(
          400,
          'Please upload an image with jpg, jpeg, png, webp, or gif format.'
        )
      );
    }
    cb(undefined, true);
  },
});
