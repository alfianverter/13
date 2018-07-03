/**
 * @file Info StatsCommand - Statistics about your selfbot instance  
 * **Aliases**: `botinfo`, `info`
 * @module
 * @category info
 * @name stats
 * @returns {MessageEmbed} Your statistics
 */

const duration = require('moment-duration-format'), // eslint-disable-line no-unused-vars
  moment = require('moment'),
  process = require('process'),
  speedTest = require('speedtest-net'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages, roundNumber} = require('../../util.js');

module.exports = class StatsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'stats',
      memberName: 'stats',
      group: 'info',
      aliases: ['botinfo', 'info'],
      description: 'Gets statistics about your Discord-Self-Bot instance',
      examples: ['stats'],
      guildOnly: false
    });
  }

  fetchPlatform (plat) {
    switch (plat) {
    case 'win32':
      return 'Windows';
    case 'darwin':
      return 'MacOS';
    default:
      return 'Linux';
    }
  }


  async run (msg) {
    const speed = speedTest({
        maxTime: 5000,
        serverId: 3242
      }),
      statsEmbed = new MessageEmbed();

    statsEmbed
      .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
      .setAuthor('Discord-Self-Bot Stats', 'https://favna.xyz/images/appIcons/selfbot.png')
      .addField('Guilds', this.client.guilds.size, true)
      .addField('Channels', this.client.channels.size, true)
      .addField('Users', this.client.users.size, true)
      .addField('Owner', this.client.owners[0].tag, true)
      .addField('License', 'GPL-3.0', true)
      .addField('DiscordJS', 'master', true)
      .addField('NodeJS', process.version, true)
      .addField('Platform', this.fetchPlatform(process.platform.toLowerCase()), true)
      .addField('Memory Usage', `${roundNumber(process.memoryUsage().heapUsed / 10485.76) / 100} MB`, true)
      .addField('Install me', '[Click Here](https://favna.xyz/selfbot)', true)
      .addField('Source', '[Available on GitHub](https://github.com/favna/discord-self-bot)', true)
      .addField('Support', '[Server Invite](https://favna.xyz/redirect/server)', true)
      .addField('Uptime', moment.duration(this.client.uptime).format('DD [days], HH [hours and] mm [minutes]'), true)
      .addField('\u200b', oneLine`Use the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}help\` command to get the list of commands available to you in a DM. 
            The default prefix is \`$\`. You can change this with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}prefix\` command. 
            If you ever forget the command prefix, just use \`${this.client.user.tag} prefix\``)
      .setFooter('Discord-Self-Bot', 'https://favna.xyz/images/appIcons/selfbot.png')
      .setTimestamp();

    deleteCommandMessages(msg, this.client);

    const statMessage = await msg.embed(statsEmbed); // eslint-disable-line one-var

    speed.on('data', (data) => {
      statsEmbed.fields.pop();
      statsEmbed
        .addField('Download Speed', `${roundNumber(data.speeds.download, 2)} Mbps`, true)
        .addField('Upload Speed', `${roundNumber(data.speeds.upload, 2)} Mbps`, true)
        .addField('\u200b', oneLine`Use the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}help\` command to get the list of commands available to you in a DM. 
      The default prefix is \`$\`. You can change this with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}prefix\` command. 
      If you ever forget the command prefix, just use \`${this.client.user.tag} prefix\``);

      statMessage.edit('', {embed: statsEmbed});
    });
  }
};