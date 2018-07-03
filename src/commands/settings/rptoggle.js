/**
 * @file Settings RPToggleCommand - Configure whether you want a Rich Presence or a normal presence  
 * **Aliases**: `presencetoggle`
 * @module
 * @category settings
 * @name rptoggle
 * @example rptoggle on
 * @param {BooleanResolvable} Option True or false value
 * @returns {Message} Confirmation the setting was stored
 */

const {Command} = require('discord.js-commando'),
  {oneLine, stripIndents} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class RPToggleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rptoggle',
      memberName: 'rptoggle',
      group: 'settings',
      aliases: ['presencetoggle'],
      description: 'Configure whether you want a Rich Presence or normal presence',
      format: 'enable|disable',
      examples: ['rptoggle enable'],
      guildOnly: false,
      args: [
        {
          key: 'option',
          prompt: 'Enable or disable rich presences?',
          type: 'boolean',
          label: 'Option for toggling',
          validate: (bool) => {
            const validBools = ['true', 't', 'yes', 'y', 'on', 'enable', 'enabled', '1', '+', 'false', 'f', 'no', 'n', 'off', 'disable', 'disabled', '0', '-'];

            if (validBools.includes(bool.toLowerCase())) {
              return true;
            }

            return stripIndents`Has to be one of ${validBools.map(val => `\`${val}\``).join(', ')}
            Respond with your new selection or`;
          }
        }
      ]
    });
  }

  run (msg, {option}) {
    this.client.provider.set('global', 'rptoggle', option);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Rich Presence is now ${option ? 'enabled' : 'disabled'}.
    Run \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}rpreload\` to reload your presence.`);
  }
};