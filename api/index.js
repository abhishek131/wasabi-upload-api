const express = require('express');
const fileUploadRoute = require('./routes/upload'); // or wherever your route is

const app = express();

app.use(express.json()); // for JSON payloads
app.use(express.urlencoded({ extended: true })); // for form-url-encoded
app.use('/upload', fileUploadRoute); // Mount your file upload route

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
