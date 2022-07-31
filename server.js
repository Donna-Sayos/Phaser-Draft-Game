const path = require('path');
const express = require('express');
const morgan = require('morgan');

const app = express();
const DIST_DIR = path.join(__dirname, '/dist');
const HTML_FILE = path.join('/index.html');

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(express.json());

// static file-serving middleware
app.use(express.static(__dirname, '..', './index.html'));

// sends index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', './index.html'));
});

// error handling endware
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`app is listening to port ${PORT}...`);
});