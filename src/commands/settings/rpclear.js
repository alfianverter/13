/**
 * @file Settings RPClearCommand - Clear All Rich Presence Data  
 * **Aliases**: `rpc`
 * @module
 * @category settings
 * @name rpclear
 * @returns {MessageEmbed} confirmation the rich presence data was cleared
 */

const {Command} = require('discord.js-commando');

module.exports = class RPClearCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rpclear',
      memberName: 'rpclear',
      group: 'settings',
      alias: ['rpc'],
      description: 'Clear All Rich Presence Data',
      examples: ['rpclear'],
      guildOnly: false
    });
  }

  run (msg) {
    this.client.provider.remove('global', 'rpappid');
    this.client.provider.remove('global', 'rpdetails');
    this.client.provider.remove('global', 'rplargeimage');
    this.client.provider.remove('global', 'rplargetext');
    this.client.provider.remove('global', 'rpname');
    this.client.provider.remove('global', 'rpsmallimage');
    this.client.provider.remove('global', 'rpsmalltext');
    this.client.provider.remove('global', 'rpstate');
    this.client.provider.remove('global', 'rptimeend');
    this.client.provider.remove('global', 'rptimestamptoggle');
    this.client.provider.remove('global', 'rptoggle');
    this.client.provider.remove('global', 'rptoggletimeend');
    this.client.provider.remove('global', 'rptype');
    this.client.provider.remove('global', 'rpurl');

    return msg.reply(`cleared all rich presence data. reload your rich presence with \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}rpreload\` if you want to clear the status`);
  }
};