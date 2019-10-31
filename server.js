const express = require('express');
const userRoute = require('./users/userRouter')
const postsRoute = require('./posts/postRouter');

const server = express();

server.use('/users', logger, userRoute);
server.use('/posts', logger, postsRoute);

// server.get('/', logger, (req, res) => {
//   res.send(`<h2>Let's write some middleware!</h2>`)
// });

//custom middleware

function logger(req, res, next) {
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`)
  console.log(`To: ${req.originalUrl}`)
  next();
};

module.exports = server;
