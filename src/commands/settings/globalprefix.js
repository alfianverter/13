/**
 * @file Settings GlobalPrefixCommand - Change the bot's global prefix. Keep in mind that any server prefix will always overwrite the global one!  
 * **Aliases**: `gp`
 * @module
 * @category settings
 * @name globalprefix
 * @example globalprefix self!!
 * @param {StringResolvable} Prefix The new prefix you want to set
 * @returns {Message} Confirmation the setting was stored
 */

const {Command} = require('discord.js-commando');

module.exports = class GlobalPrefixCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'globalprefix',
      memberName: 'globalprefix',
      group: 'settings',
      alias: ['gp'],
      description: 'Change the bot\'s global prefix. Keep in mind that any server prefix will always overwrite the global one!',
      format: 'NewPrefix',
      examples: ['globalprefix self!!'],
      guildOnly: false,
      args: [
        {
          key: 'prefix',
          prompt: 'What is the new prefix you want to set?',
          type: 'string'
        }
      ]
    });
  }

  run (msg, {prefix}) {
    this.client.commandPrefix = prefix;

    return msg.reply(`changed the global prefix to \`${prefix}\`. Keep in mind that server prefixes take priority over global ones!`);
  }
};