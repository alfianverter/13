/**
 * @file Settings RPSmallTextCommand - Set your Rich Presence Small Image Text  
 * **Aliases**: `smalltext`
 * @module
 * @category settings
 * @name rpsmalltext
 * @example smalltext baby don't hurt me
 * @param {StringResolvable} SmallText The small image text you want to set 
 * @returns {Message} Confirmation the setting was stored
 */

const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class RPSmallTextCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rpsmalltext',
      memberName: 'rpsmalltext',
      group: 'settings',
      aliases: ['smalltext'],
      description: 'Set your Rich Presence Small Image Text',
      format: 'SmallText',
      examples: ['rpsmalltext baby don\'t hurt me'],
      guildOnly: false,
      args: [
        {
          key: 'smalltext',
          prompt: 'What is the smalltext string for your richpresence?',
          type: 'string',
          label: 'smalltext',
          validate: (smalltext) => {
            if (Buffer.byteLength(smalltext, 'utf8') <= 128) {
              return true;
            }

            return 'The smalltext string cannot be longer than 128 bytes';
          }
        }
      ]
    });
  }

  run (msg, {smalltext}) {
    this.client.provider.set('global', 'rpsmalltext', smalltext);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence SmallText has been set to \`${smalltext}\``);
  }
};