/**
 * @file Settings WebhookExclusionsCommand - Configure the keywords to be avoided in your Webhook Notification System  
 * **Aliases**: `whe`, `hookexclusions`
 * @module
 * @category settings
 * @name webhookexclusions
 * @example webhookexclusions Fantasy
 * @example webhookexclusions word1 word2 word3
 * @param {StringResolvable} Keywords The keyword(s) to avoid in the WNS
 * @returns {Message} Confirmation the setting was stored
 */

const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class WebhookExclusionsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'webhookexclusions',
      memberName: 'webhookexclusions',
      group: 'settings',
      aliases: ['whe', 'hookexclusions'],
      description: 'Configure the keywords to be avoided in your Webhook Notification System (WNS)',
      format: 'word1 word2 word3',
      examples: ['webhookexclusions Fantasy'],
      guildOnly: false,
      args: [
        {
          key: 'exclusions',
          prompt: 'What keyword should be filtered for Webhook Notification System?',
          type: 'string',
          label: 'exclusions for WNS',
          infinite: true
        }
      ]
    });
  }

  run (msg, {exclusions}) {
    this.client.provider.set('global', 'webhookexclusions', exclusions);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`${exclusions.map(word => `\`${word}\``).join(', ')} excluded from WNS. 
        Make sure to enable webhooks with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}webhooktoggle\`
        and set your keywords with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}webhookkeywords\` command`);
  }
};