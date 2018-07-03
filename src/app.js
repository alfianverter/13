/* eslint-disable no-mixed-requires, sort-vars, one-var, global-require */
const path = require('path');

require('dotenv').config({path: path.join(__dirname, '.env')});
const DiscordSelfBot = require(path.join(__dirname, 'DiscordSelfBot.js')),
  start = function () {
    new DiscordSelfBot(process.env.token).init();
  },
  heroku = function () {
    const express = require('express'),
      PORT = process.env.PORT || 5000;

    express()
      .use(express.static(path.join(__dirname, 'heroku')))
      .set('view engine', 'html')
      .all('/', (req, res) => res.render(path.join(__dirname, 'heroku/index')))
      .listen(PORT, () => console.log(`Listening on ${PORT}`));
  };

if (process.env.heroku) {
  heroku();
  start();
} else {
  start();
}