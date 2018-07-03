/**
 * @file Searches iTunesCommand - Search iTunes for music tracks  
 * **Aliases**: `apple`, `tunes`
 * @module
 * @category searches
 * @name itunes
 * @example itunes dash berlin symphony
 * @param {StringResolvable} TrackQuery The music track to look up
 * @returns {MessageEmbed} Information about the music track
 */

const moment = require('moment'),
  request = require('snekfetch'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class iTunesCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'itunes',
      memberName: 'itunes',
      group: 'searches',
      aliases: ['apple', 'tunes'],
      description: 'Search iTunes for music tracks',
      examples: ['itunes dash berlin symphony'],
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'music',
          prompt: 'What track should I search on iTunes?',
          type: 'string',
          parse: p => p.replace(/ /gm, '+')
        }
      ]
    });
  }

  async run (msg, {music}) {
    try {
      const tunes = await request
          .get('https://itunes.apple.com/search', {
            qs: {
              stringify: obj => Object.keys(obj).map((k) => {
                const key = `${encodeURIComponent(k)}=`,
                  val = encodeURIComponent(obj[k]).replace(/%2B/gm, '+');

                return key + val;
              }).filter(Boolean).join('&'), // eslint-disable-line newline-per-chained-call
              parse: null
            }
          })
          .query('term', music)
          .query('media', 'music')
          .query('entity', 'song')
          .query('limit', 5)
          .query('lang', 'en_us')
          .query('country', 'US')
          .query('explicit', 'yes'),
        tunesEmbed = new MessageEmbed(),
        hit = JSON.parse(tunes.body).results[0]; // eslint-disable-line sort-vars

      if (!hit) {
        throw new Error('no song found');
      }

      tunesEmbed
        .setThumbnail(hit.artworkUrl100)
        .setTitle(hit.trackName)
        .setURL(hit.trackViewUrl)
        .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
        .addField('Artist', `[${hit.artistName}](${hit.artistViewUrl})`, true)
        .addField('Collection', `[${hit.collectionName}](${hit.collectionViewUrl})`, true)
        .addField('Collection Price (USD)', `$${hit.collectionPrice}`, true)
        .addField('Track price (USD)', `$${hit.trackPrice}`, true)
        .addField('Track Release Date', moment(hit.releaseDate).format('MMMM Do YYYY'), true)
        .addField('# Tracks in Collection', hit.trackCount, true)
        .addField('Primary Genre', hit.primaryGenreName, true)
        .addField('Preview', `[Click Here](${hit.previewUrl})`, true);

      deleteCommandMessages(msg, this.client);

      return msg.embed(tunesEmbed);
    } catch (err) {
      deleteCommandMessages(msg, this.client);
      if (/(?:no song found)/i.test(err.toString())) {
        return msg.reply(`no song found for \`${music.replace(/\+/g, ' ')}\``);
      }
      console.error(err);
      
      return msg.reply(oneLine`Woops! something went horribly wrong there, the error was logged to the console.
      Want to know more about the error? Join the support server by getting an invite by using the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}invite\` command `);
    }
  }
};