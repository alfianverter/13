/**
 * @file Searches LmgtfyCommand - Transform some query into a LMGTFY (Let Me Google That For You) url  
 * **Aliases**: `dumb`
 * @module
 * @category searches
 * @name lmgtfy
 * @example lmgtfy is it legal to kill an ant???
 * @param {StringResolvable} SearchQuery The dumb sh*t people need to use google for
 * @returns {Message} LMGTFY url
 */

const {Command} = require('discord.js-commando'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class LmgtfyCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'lmgtfy',
      memberName: 'lmgtfy',
      group: 'searches',
      aliases: ['dumb'],
      description: 'Produce a lmgtfy (let me google that for you) URL',
      format: 'Query',
      examples: ['lmgtfy is it legal to kill an ant???', 'lmgtfy are there birds in canada?'],
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'question',
          prompt: 'What does the idiot want to find?',
          type: 'string',
          parse: p => p.replace(/ /gim, '+')
        }
      ]
    });
  }

  run (msg, {question}) {
    deleteCommandMessages(msg, this.client);

    return msg.say(`<https://lmgtfy.com/?q=${question}>`);
  }
};