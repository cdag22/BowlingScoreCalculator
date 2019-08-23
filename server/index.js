const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));


app.listen(port, () => console.log(`Listening on port ${port}`));