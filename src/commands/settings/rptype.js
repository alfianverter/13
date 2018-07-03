/**
 * @file Settings RPTypeCommand - Set your Rich Presence Type  
 * **Aliases**: `rtyp`
 * @module
 * @category settings
 * @name rptype
 * @example rptype watching
 * @param {PresenceType} TypeText One of `playing`, `watching`, `streaming` or `listening`
 * @returns {Message} Confirmation the setting was stored
 */

const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class RPTypeCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rptype',
      memberName: 'rptype',
      group: 'settings',
      aliases: ['rtyp'],
      description: 'Set your Rich Presence Type',
      format: 'playing|watching|listening|streaming',
      examples: ['rptype PLAYING'],
      guildOnly: false,
      args: [
        {
          key: 'type',
          prompt: 'What is the Type you want for your Rich Presence?',
          type: 'string',
          label: 'typeID',
          validate: (type) => {
            const validTypes = ['playing', 'watching', 'listening', 'streaming'];

            if (validTypes.includes(type.toLowerCase())) {
              return true;
            }

            return `Has to be one of ${validTypes.join(', ')}`;
          }
        }
      ]
    });
  }

  run (msg, {type}) {
    this.client.provider.set('global', 'rptype', type.toUpperCase());

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence Type has been set to \`${type}\``);
  }
};