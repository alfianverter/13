/**
 * @file Info PingCommand - Checks the bot\'s ping to the Discord server  
 * **Aliases**: `pong`
 * @module
 * @category info
 * @name ping
 * @returns {Message} Ping result
 */

const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class PingCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ping',
      memberName: 'ping',
      group: 'info',
      aliases: ['pong'],
      description: 'Checks the bot\'s ping to the Discord server.',
      examples: ['ping'],
      guildOnly: false
    });
  }

  async run (msg) {
    const pingMsg = await msg.reply('Pinging...');

    deleteCommandMessages(msg, this.client);

    return pingMsg.edit(oneLine`
				${msg.channel.type !== 'dm' ? `${msg.author},` : ''}
				Pong! The message round-trip took ${pingMsg.createdTimestamp - msg.createdTimestamp}ms.
				${this.client.ping ? `The heartbeat ping is ${Math.round(this.client.ping)}ms.` : ''}
			`);
  }
};