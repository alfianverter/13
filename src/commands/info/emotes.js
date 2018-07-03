/**
 * @file Info EmotesCommand - Lists all emotes from the server  
 * **Aliases**: `listemo`, `emolist`, `listemoji`, `emote`
 * @module
 * @category info
 * @name emotes
 * @param {GuildResolvable} [Server] Optionally the server you want to get the emotes for
 * @returns {MessageEmbed} List of emotes
 */

const {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class EmotesCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'emotes',
      memberName: 'emotes',
      group: 'info',
      aliases: ['listemo', 'emolist', 'listemoji', 'listemojis'],
      description: 'Gets all available custom emojis from a server',
      format: '[ServerID|ServerName(partial or full)]',
      examples: ['emotes Bots By Favna'],
      guildOnly: false,
      args: [
        {
          key: 'server',
          prompt: 'What server would you like the emojis from?',
          type: 'guild',
          default: ''
        }
      ]
    });
  }

  run (msg, {server}) {
    const embed = new MessageEmbed();

    server = server ? server : msg.guild;

    let animEmotes = [],
      staticEmotes = [];

    server.emojis.forEach((e) => {
      e.animated ? animEmotes.push(`<a:${e.name}:${e.id}>`) : staticEmotes.push(`<:${e.name}:${e.id}>`);
    });

    embed
      .setColor(server.me.displayHexColor)
      .setAuthor(`${staticEmotes.length + animEmotes.length} ${server.name} Emotes`, server.iconURL({format: 'png'}))
      .setTimestamp();

    staticEmotes = staticEmotes.length !== 0 ? `__**${staticEmotes.length} Static Emotes**__\n${staticEmotes.join('')}` : '';
    animEmotes = animEmotes.length !== 0 ? `\n\n__**${animEmotes.length} Animated Emotes**__\n${animEmotes.join('')}` : '';

    embed.setDescription(staticEmotes + animEmotes);

    deleteCommandMessages(msg, this.client);

    return msg.embed(embed);
  }
};