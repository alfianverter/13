/**
 * @file nsfw GelbooruCommand - Gets a NSFW image from gelbooru  
 * Can only be used in NSFW marked channels!  
 * **Aliases**: `gel`, `booru`
 * @module
 * @category nsfw
 * @name gelbooru
 * @example gelbooru pyrrha_nikos
 * @param {StringResolvable} Query Something you want to find
 * @returns {MessageEmbed} Score, Link and preview of the image
 */

const booru = require('booru'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {stripIndents} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class GelbooruCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'gelbooru',
      memberName: 'gelbooru',
      group: 'nsfw',
      aliases: ['gel', 'booru'],
      description: 'Find NSFW Content on gelbooru',
      format: 'NSFWToLookUp',
      examples: ['gelbooru Pyrrha Nikos'],
      guildOnly: false,
      nsfw: true,
      args: [
        {
          key: 'tags',
          prompt: 'What do you want to find NSFW for?',
          type: 'string',
          parse: p => p.split(' ')
        }
      ]
    });
  }

  async run (msg, {tags}) {
    try {
      /* eslint-disable sort-vars*/
      const search = await booru.search('paheal', tags, {
          limit: 1,
          random: true
        }),
        common = await booru.commonfy(search),
        embed = new MessageEmbed(),
        imageTags = [];
      /* eslint-enable sort-vars*/

      for (const tag in common[0].common.tags) {
        imageTags.push(`[#${common[0].common.tags[tag]}](${common[0].common.file_url})`);
      }

      embed
        .setTitle(`paheal image for ${tags.join(', ')}`)
        .setURL(common[0].common.file_url)
        .setColor('#FFB6C1')
        .setDescription(stripIndents`${imageTags.slice(0, 5).join(' ')}
          
          **Score**: ${common[0].common.score}`)
        .setImage(common[0].common.file_url);

      deleteCommandMessages(msg, this.client);

      return msg.embed(embed);

    } catch (err) {
      deleteCommandMessages(msg, this.client);

      return msg.reply(`no juicy images found for \`${tags}\``);
    }
  }
};