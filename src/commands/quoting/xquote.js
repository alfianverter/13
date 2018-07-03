/**
 * @file quoting CrossQuoteCommand - Quote someone else's message into a MessageEmbed  
 * This command has support for cross-server quoting!  
 * **Aliases**: `xq`
 * @module
 * @category quoting
 * @name xquote
 * @example xquote 246821351585742851 355269305941622786 355275528002994176 Oh so that was the first message on the channel!
 * @param {StringResolvable} Server Server the channel is in
 * @param {StringResolvable} ChannelID ID of the channel the message is in
 * @param {StringResolvable} MessageID ID of the message to quote
 * @param {StringResolvable} [Content] Optional content to send along with the quote
 * @returns {MessageEmbed} Quote and optional content
 */

const moment = require('moment'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class CrossQuoteCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'xquote',
      memberName: 'xquote',
      group: 'quoting',
      aliases: ['xq'],
      description: 'Quote someone else\'s message into a MessageEmbed.',
      details: ' Allows for cross server quoting but IDs are required',
      format: 'ServerID|ServerName(partial or full) ChannelID MessageID [ContentToSendAlongWithTheEmbed]',
      examples: ['xquote 246821351585742851 355269305941622786 355275528002994176 Oh so that was the first message on the channel!'],
      guildOnly: false,
      args: [
        {
          key: 'guild',
          prompt: 'Which server?',
          type: 'guild'
        },
        {
          key: 'channel',
          prompt: 'Which channel on that server?',
          type: 'string'
        },
        {
          key: 'message',
          prompt: 'And what message?',
          type: 'string'
        },
        {
          key: 'content',
          prompt: 'What content would you like to send along with the quote?',
          type: 'string',
          default: ''
        }
      ]
    });
  }

  async fetchPreview (url) {
    /* eslint-disable global-require */
    const imgur = require('imgur'),
      request = require('snekfetch');
    /* eslint-enable global-require */

    let requestData = '';

    try {
      requestData = await request.get(`https://api.letsvalidate.com/v1/thumbs/?url=${url}`);
    } catch (err) {
      return null;
    }

    if (requestData) {
      const upload = await imgur.uploadBase64(requestData.body.toString('base64'));

      if (upload) {
        return upload.data.link;
      }

      return null;
    }

    return null;
  }

  async run (msg, args) {
    const quote = await this.client.guilds.get(args.guild.id).channels.get(args.channel).messages.fetch(args.message);

    if (quote) {
      const quoteEmbed = new MessageEmbed();

      let content = quote.cleanContent;

      if (quote.member === null) {
        quoteEmbed
          .setAuthor(`Quoting ${quote.author.username}`, quote.author.displayAvatarURL())
          .setColor(msg.member !== null ? msg.member.displayHexColor : '#7CFC00');
      } else {
        quoteEmbed
          .setAuthor(`Quoting ${quote.member.displayName}`, quote.author.displayAvatarURL())
          .setColor(quote.channel.type === 'text' ? quote.member.displayHexColor : '#7CFC00');
      }

      if (content.match(/\bhttps?:\/\/(?![^"\s<>]*(?:png|jpg|gif|webp|jpeg|svg))[^"\s<>]+\.[^"\s<>]+/im) && !quote.attachments.first()) {
        const img = await this.fetchPreview(content.match(/\bhttps?:\/\/(?![^"\s<>]*(?:png|jpg|gif|webp|jpeg|svg))[^"\s<>]+\.[^"\s<>]+/im)[0]);

        if (img) {
          quoteEmbed.setImage(img);
        }
      }

      if (content.match(/(https?:\/\/.*\.(?:png|jpg|gif|webp|jpeg|svg))/im)) {
        const match = content.match(/(https?:\/\/.*\.(?:png|jpg|gif|webp|jpeg|svg))/im);

        content = content.substring(0, match.index).match(/(?:<|>)/)
          ? content.substring(0, match.index - 1) + content.substring(match.index + match[0].length + 1)
          : content.substring(0, match.index) + content.substring(match.index + match[0].length + 1);

        quoteEmbed.setImage(match[0]);
      }

      if (quote.attachments.first()) {
        const fileExt = quote.attachments.first().url.slice(-3); // eslint-disable-line one-var

        if (fileExt === 'peg' || fileExt === 'jpg' || fileExt === 'png' || fileExt === 'gif' || fileExt === 'webp') {
          quoteEmbed.setImage(quote.attachments.first().url);
        }
      }

      quoteEmbed
        .setFooter(`Message sent on the ${quote.guild.name} server in #${quote.channel.name} on`)
        .setTimestamp(moment(quote.createdAt)._d)
        .setDescription(content);

      deleteCommandMessages(msg, this.client);

      return msg.embed(quoteEmbed, args.content);
    }

    return msg.reply('something went wrong quoting that message.');
  }
};