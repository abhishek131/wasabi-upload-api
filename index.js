require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const uploadRoute = require('./api/upload');

const app = express();

app.use(fileUpload());
app.use(express.json());

// Routes
app.use('/upload', uploadRoute);

app.get('/', (req, res) => {
  res.send('Wasabi Upload API is live');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
