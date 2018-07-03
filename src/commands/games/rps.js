/**
 * @file Games RockPaperScissorCommand - Play Rock Paper Scissors against random.org randomization  
 * **Aliases**: `rockpaperscissors`
 * @module
 * @category games
 * @name rps
 * @example rps Rock
 * @param {StringResolvable} HandToPlay The hand that you want to play
 * @returns {MessageEmbed} Result of the conflict
 */

const Discord = require('discord.js'),
  {Command} = require('discord.js-commando'),
  random = require('node-random'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rpsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rps',
      memberName: 'rps',
      group: 'games',
      aliases: ['rockpaperscissors'],
      description: 'Play Rock Paper Scissors against random.org randomization',
      format: 'Rock|Paper|Scissors',
      examples: ['rps Rock'],
      guildOnly: false,
      args: [
        {
          key: 'hand',
          prompt: 'Do you play rock, paper or scissors?',
          type: 'string',
          validate: (hand) => {
            const validHands = ['rock', 'paper', 'scissors'];

            if (validHands.includes(hand.toLowerCase())) {
              return true;
            }

            return `Has to be one of ${validHands.join(', ')}`;
          },
          parse: p => p.toLowerCase()
        }
      ]
    });
  }

  run (msg, args) {
    /* eslint-disable complexity*/
    random.integers({
      number: 1,
      minimum: 1,
      maximum: 3
    }, (error, randoms) => {
      if (!error) {
        const rpsEmbed = new Discord.MessageEmbed();

        let resString = 'Woops something went wrong';

        if (args.hand === 'rock' && randoms === 1) {
          resString = 'It\'s a draw 😶! Both picked 🗿';
        } else if (args.hand === 'rock' && randoms === 2) {
          resString = 'I won 😃! My 📜 covered your 🗿';
        } else if (args.hand === 'rock' && randoms === 3) {
          resString = ' I lost 😞! Your 🗿 smashed my ️️️✂️ to pieces';
        } else if (args.hand === 'paper' && randoms === 1) {
          resString = 'I lost 😞! Your 📜 covered my 🗿';
        } else if (args.hand === 'paper' && randoms === 2) {
          resString = 'It\'s a draw 😶! Both picked 📜';
        } else if (args.hand === 'paper' && randoms === 3) {
          resString = 'I won 😃! My ✂️ cut your 📜 to shreds';
        } else if (args.hand === 'scissor' && randoms === 1) {
          resString = 'I won 😃! My 🗿 smashed your ✂️ to pieces';
        } else if (args.hand === 'scissor' && randoms === 2) {
          resString = 'I lost 😞! Your ✂️ cut my 📜 to shreds';
        } else if (args.hand === 'scissor' && randoms === 3) {
          resString = 'It\'s a draw 😶! Both picked ✂️';
        }

        rpsEmbed
          .setColor(msg.member !== null ? msg.member.displayHexColor : '#7CFC00')
          .setTitle('Rock Paper Scissors')
          .setDescription(resString);

        deleteCommandMessages(msg, this.client);

        return msg.embed(rpsEmbed);
      }

      return msg.reply('an error occurred getting a random result and I\'m not going to rig this game.');
    });
  }
};