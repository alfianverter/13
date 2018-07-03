/**
 * @file Info ServerInfoCommand - Gets information about any server you're in  
 * **Aliases**: `serverinfo`, `sinfo`
 * @module
 * @category info
 * @name server
 * @param {GuildResolvable} [Server] Optionally the server you want to get the stats for
 * @returns {MessageEmbed} Info about the server
 */

const moment = require('moment'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class ServerInfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'server',
      memberName: 'server',
      group: 'info',
      aliases: ['serverinfo', 'sinfo'],
      description: 'Gets information about any server you\'re in',
      format: '[ServerID|ServerName(partial or full)]',
      examples: ['server Bots by Favna'],
      guildOnly: false,
      args: [
        {
          key: 'server',
          prompt: 'Get info from which server?',
          type: 'guild',
          default: ''
        }
      ]
    });
  }

  contentFilter (filter) {
    switch (filter) {
    case 0:
      return 'Content filter disabled';
    case 1:
      return 'Scan messages of members without a role';
    case 2:
      return 'Scan messages sent by all members';
    default:
      return 'Content Filter unknown';
    }
  }

  verificationFilter (filter) {
    switch (filter) {
    case 0:
      return 'None - unrestricted';
    case 1:
      return 'Low - must have verified email on account';
    case 2:
      return 'Medium - must be registered on Discord for longer than 5 minutes';
    case 3:
      return 'High - 	(╯°□°）╯︵ ┻━┻ - must be a member of the server for longer than 10 minutes';
    case 4:
      return 'Very High - ┻━┻ミヽ(ಠ益ಠ)ﾉ彡┻━┻ - must have a verified phone number';
    default:
      return 'Verification Filter unknown';
    }
  }

  run (msg, {server}) {
    if (msg.channel.type !== 'text' && !server) {
      return msg.reply('an argument of server name (partial or full) or server ID is required when talking outside of a server');
    }

    server = server ? server : msg.guild;

    const channels = server.channels.map(ty => ty.type),
      presences = server.presences.map(st => st.status),
      serverEmbed = new MessageEmbed();

    let guildChannels = 0,
      onlineMembers = 0;

    for (const i in presences) {
      if (presences[i] !== 'offline') {
        onlineMembers += 1;
      }
    }
    for (const i in channels) {
      if (channels[i] === 'text') {
        guildChannels += 1;
      }
    }

    serverEmbed
      .setColor(server.owner ? server.owner.displayHexColor : '#7CFC00')
      .setAuthor('Server Info', 'https://favna.s-ul.eu/O0qc0yt7.png')
      .setThumbnail(server.iconURL({format: 'png'}))
      .setFooter(`Server ID: ${server.id}`)
      .addField('Server Name', server.name, true)
      .addField('Owner', server.owner ? server.owner.user.tag : 'Owner is MIA', true)
      .addField('Members', server.memberCount, true)
      .addField('Currently Online', onlineMembers, true)
      .addField('Region', server.region, true)
      .addField('Highest Role', server.roles.sort((a, b) => a.position - b.position || a.id - b.id).last().name, true)
      .addField('Number of emojis', server.emojis.size, true)
      .addField('Number of roles', server.roles.size, true)
      .addField('Number of channels', guildChannels, true)
      .addField('Created At', moment(server.createdTimestamp).format('MMMM Do YYYY [at] HH:mm'), false)
      .addField('Verification Level', this.verificationFilter(server.verificationLevel), false)
      .addField('Explicit Content Filter', this.contentFilter(server.explicitContentFilter), false);

    server.splashURL() !== null ? serverEmbed.setImage(server.splashURL()) : null;

    deleteCommandMessages(msg, this.client);

    return msg.embed(serverEmbed);
  }
};