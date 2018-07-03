/**
 * @file Settings RPDetailsCommand - Set your Rich Presence details  
 * **Aliases**: `details`, `rpdetail`
 * @module
 * @category settings
 * @name rpdetails
 * @example rpdetails Living the good life
 * @param {StringResolvable} DetailsText The text you want to set as the Rich Presence Details  
 * @returns {Message} Confirmation the setting was stored
 */

const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class RPDetailsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rpdetails',
      memberName: 'rpdetails',
      group: 'settings',
      aliases: ['details', 'rpdetail'],
      description: 'Set your Rich Presence details',
      format: 'DetailsText',
      examples: ['rpdetails Living the good life'],
      guildOnly: false,
      args: [
        {
          key: 'details',
          prompt: 'What is the detail string for your richpresence?',
          type: 'string',
          label: 'details',
          validate: (details) => {
            if (Buffer.byteLength(details, 'utf8') <= 128) {
              return true;
            }

            return 'The detail string cannot be longer than 128 UTF-8 bytes';
          }
        }
      ]
    });
  }

  run (msg, {details}) {
    this.client.provider.set('global', 'rpdetails', details);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence Details have been set to \`${details}\``);
  }
};