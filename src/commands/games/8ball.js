/**
 * @file Games EightBallCommand - Rolls a magic 8 ball using your input  
 * **Aliases**: `eightball`
 * @module
 * @category games
 * @name 8ball
 * @example 8ball is Favna a genius coder?
 * @param {StringResolvable} question Question you want the 8 ball to answer
 * @returns {MessageEmbed} Your question and its answer
 */

const predict = require('eightball'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class eightBallCommand extends Command {
  constructor (client) {
    super(client, {
      name: '8ball',
      memberName: '8ball',
      group: 'games',
      aliases: ['eightball'],
      description: 'Roll a magic 8ball',
      format: 'YourQuestion',
      examples: ['8ball is Favna a genius coder?'],
      guildOnly: false,
      args: [
        {
          key: 'question',
          prompt: '8ball what?',
          type: 'string'
        }
      ]
    });
  }

  run (msg, {question}) {
    const eightBallEmbed = new MessageEmbed();

    eightBallEmbed
      .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
      .addField(':question: Question', question, false)
      .addField(':8ball: 8ball', predict(), false);

    deleteCommandMessages(msg, this.client);

    return msg.embed(eightBallEmbed);
  }
};