/**
 * @file Extra LinkifyCommand - Easily get a URL for any upload  
 * This is the for mobile users ;)
 * Send this command when uploading anything and the bot will reply with the URL
 * **Aliases**: `link`, `imglink`
 * @module
 * @category extra
 * @name linkify
 * @returns {Message} URL of whatever you uploaded
 */

const {Command} = require('discord.js-commando');

module.exports = class LinkifyCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'linkify',
      memberName: 'linkify',
      group: 'extra',
      aliases: ['link', 'imglink'],
      description: 'Easily get a URL for any upload',
      details: 'This is for the mobile users ;)\nSend this command when uploading anything and the bot will reply with the URL',
      guildOnly: false
    });
  }

  run (msg) {
    if (msg.attachments.first() && msg.attachments.first().url) {
      return msg.say(msg.attachments.first().url);
    }
		
    return msg.delete();
  }
};