/**
 * @file Settings RPLargeTextCommand - Set your Rich Presence Large Image Text  
 * **Aliases**: `largetext`, `ltext`
 * @module
 * @category settings
 * @name rplargetext
 * @example rplargetext what is love
 * @param {StringResolvable} LargeText The large image text you want to set
 * @returns {Message} Confirmation the setting was stored
 */

const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rplargetextCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rplargetext',
      memberName: 'rplargetext',
      group: 'settings',
      aliases: ['largetext', 'ltext'],
      description: 'Set your Rich Presence Large Image Text',
      format: 'LargeText',
      examples: ['rplargetext what is love'],
      guildOnly: false,
      args: [
        {
          key: 'largetext',
          prompt: 'What is the largetext string for your richpresence?',
          type: 'string',
          label: 'largetext',
          validate: (largetext) => {
            if (Buffer.byteLength(largetext, 'utf8') <= 128) {
              return true;
            }

            return 'The largetext string cannot be longer than 128 bytes';
          }
        }
      ]
    });
  }
	
  run (msg, {largetext}) {
    this.client.provider.set('global', 'rplargetext', largetext);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence LargeText has been set to \`${largetext}\``);
  }
};