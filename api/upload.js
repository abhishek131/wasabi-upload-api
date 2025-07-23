const express = require('express');
const router = express.Router();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const upload = multer(); // Memory storage

require('dotenv').config();

// Wasabi client
const s3 = new S3Client({
  region: process.env.WASABI_REGION,
  endpoint: process.env.WASABI_ENDPOINT,
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY,
    secretAccessKey: process.env.WASABI_SECRET_KEY,
  },
});

// Upload route
router.post('/', upload.single('file'), async (req, res) => {
  try {
    // Validate file
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const file = req.file;

    const uploadParams = {
      Bucket: process.env.WASABI_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
      ACL: 'public-read', // optional
    };

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    const fileUrl = `${process.env.WASABI_PUBLIC_URL}/${uploadParams.Key}`;
    res.json({ success: true, fileUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
