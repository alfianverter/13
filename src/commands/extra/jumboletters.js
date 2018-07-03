/**
 * @file Extra JumboLettersCommand - Create jumbo letters from your text  
 * **Aliases**: `jumbo`, `bigtext`
 * @module
 * @category extra
 * @name jumboletters
 * @example jumboletters Favna is a great  coder!
 * @param {StringResolvable} Content Content you want to jumbo-fy
 * @returns {Message} Jumbofied content
 */

const {Command} = require('discord.js-commando'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class JumboLettersCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'jumboletters',
      memberName: 'jumboletters',
      group: 'extra',
      aliases: ['jumbo', 'bigtext'],
      description: 'Create jumbo letters from your text',
      format: 'MessageToJumbo',
      examples: ['jumboletters Favna is a great coder!'],
      guildOnly: false,
      args: [
        {
          key: 'text',
          prompt: 'What text to jumbo-fy',
          type: 'string'
        }
      ]
    });
  }

  fetchNumberWord (num) {
    switch (num) {
    case '0':
      return 'zero';
    case '1':
      return 'one';
    case '2':
      return 'two';
    case '3':
      return 'three';
    case '4':
      return 'four';
    case '5':
      return 'five';
    case '6':
      return 'six';
    case '7':
      return 'seven';
    case '8':
      return 'eight';
    case '9':
      return 'nine';
    default:
      return '1234';
    }
  }

  run (msg, {text}) {
    const jumboString = [];

    for (const i in text) {
      if (/[a-zA-Z]/gim.test(text[i])) {
        jumboString.push(`:regional_indicator_${text[i].toLowerCase()}:`);
      } else if (/[0-9]/gim.test(text[i])) {
        jumboString.push(`:${this.fetchNumberWord(text[i])}:`);
      } else if (/!/gim.test(text[i])) {
        jumboString.push(':exclamation:');
      } else if (/\?/gim.test(text[i])) {
        jumboString.push(':question:');
      } else if (/ /gim.test(text[i])) {
        jumboString.push('  ');
      } else {
        jumboString.push(text[i]);
      }
    }

    deleteCommandMessages(msg, this.client);

    return msg.say(jumboString.join(' '));
  }
};