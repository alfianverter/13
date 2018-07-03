/**
 * @file images EmojisCommand - Sends a png image along with a message to fake sending global emojis  
 * **Aliases**: `emoji`, `emo`, `sendemo`, `emosend`, `sendemoji`
 * @module
 * @category images
 * @name emojis
 * @example sendemoji thonk
 * @param {StringResolvable} EmojiName Name of the emoji to send
 * @param {StringResolvable} [Content] Optional content to send along with the emoji
 * @returns {Message} Emoji image and optional content
 */

const dym = require('didyoumean2'),
  fs = require('fs'),
  path = require('path'),
  {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require(path.join(__dirname, '../../util.js'));

module.exports = class EmojisCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'emojis',
      memberName: 'emojis',
      group: 'images',
      aliases: ['emoji', 'emo', 'sendemo', 'emosend', 'sendemoji'],
      description: 'Sends a png image along with a message to fake sending global emojis',
      format: 'EmojiName [MessageToSendWithEmoji]',
      examples: ['sendemoji thonk'],
      guildOnly: false,
      args: [
        {
          key: 'emoji',
          prompt: 'What emoji do you want send?',
          type: 'string',
          parse: p => p.toLowerCase()
        }, {
          key: 'message',
          prompt: 'Content to send along with the emoji?',
          type: 'string',
          default: ''
        }
      ]
    });
  }

  run (msg, {emoji, message}) {
    if (fs.existsSync(path.join(__dirname, `../../data/images/emojis/${emoji}.png`))) {
      deleteCommandMessages(msg, this.client);

      return msg.say(message, {files: [path.join(__dirname, `../../data/images/emojis/${emoji}.png`)]});
    }
    const matchList = fs.readdirSync(path.join(__dirname, '../../data/images/emojis/')).map(v => v.slice(0, 4)),
      maybe = dym(emoji, matchList, {deburr: true});

    return msg.reply(oneLine`that emoji does not exist! ${maybe 
      ? oneLine`Did you mean \`${maybe}\`?` 
      : 'You can add it to the folder then try again'}`);
  }
};