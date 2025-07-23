const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
require('dotenv').config();

// Wasabi S3 config
const s3 = new AWS.S3({
  endpoint: process.env.WASABI_ENDPOINT,
  accessKeyId: process.env.WASABI_ACCESS_KEY,
  secretAccessKey: process.env.WASABI_SECRET_KEY,
  region: process.env.WASABI_REGION,
});

router.post('/', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file;

    const uploadParams = {
      Bucket: process.env.WASABI_BUCKET_NAME,
      Key: file.name,
      Body: file.data,
      ACL: 'public-read',
    };

    const result = await s3.upload(uploadParams).promise();
    res.json({ url: result.Location });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload to Wasabi' });
  }
});

module.exports = router;
