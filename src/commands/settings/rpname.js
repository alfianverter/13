/**
 * @file Settings RPNameCommand - Set your Rich Presence Name  
 * **Aliases**: `rname`
 * @module
 * @category settings
 * @name RPName
 * @example rpname The Game of Life
 * @param {StringResolvable} RichPresenceName Name for your Rich Presence
 * @returns {Message} Confirmation the setting was stored
 */

const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class RPNameCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rpname',
      memberName: 'rpname',
      group: 'settings',
      aliases: ['rname'],
      description: 'Set your Rich Presence name',
      format: 'NameText',
      examples: ['rpname The Game of Life'],
      guildOnly: false,
      args: [
        {
          key: 'name',
          prompt: 'What is the activity for your richpresence?',
          type: 'string',
          label: 'name',
          validate: (name) => {
            if (Buffer.byteLength(name, 'utf8') <= 128) {
              return true;
            }

            return 'The name string cannot be longer than 128 bytes';
          }
        }
      ]
    });
  }

  run (msg, {name}) {
    this.client.provider.set('global', 'rpname', name);
		
    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence Name has been set to \`${name}\``);
  }
};