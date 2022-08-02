const path = require('path');
const express = require('express');
const morgan = require('morgan');

const app = express();

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(express.json());

// static file-serving middleware
app.use(express.static(path.join(__dirname, 'index.html')));

// we will send the index.html!
app.get('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// error handling endware
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
});

dom.window.gameLoaded = () => {
  let port = process.env.PORT;
  if (port == null || port == "") {
    port = process.env.PORT || 8080;
  }
  app.listen(port, function () {
    console.log(`Listening on ${server.address().port}`);
  });
};