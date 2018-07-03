/**
 * @file Settings RPTimestampToggleCommand - Configure whether you want a timestamp in your Rich Presence or not  
 * **Aliases**: `timetoggle`, `tst`, `rptimestamp`, `rpend`
 * @module
 * @category settings
 * @name rptimestamptoggle
 * @example rptimestamptoggle off
 * @param {BooleanResolvable} Option True or false value
 * @returns {Message} Confirmation the setting was stored
 */

const {Command} = require('discord.js-commando'),
  {oneLine, stripIndents} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class RPTimestampToggleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rptimestamptoggle',
      memberName: 'rptimestamptoggle',
      group: 'settings',
      aliases: ['timetoggle', 'tst', 'rptimestamp'],
      description: 'Configure whether you want a timestamp in your Rich Presence',
      format: 'enable|disable',
      examples: ['rptimestamptoggle enable'],
      guildOnly: false,
      args: [
        {
          key: 'option',
          prompt: 'Enable or disable the timestamp in rich presences?',
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
    this.client.provider.set('global', 'rptimestamptoggle', option);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`The Timestamp in Rich Presence is now ${option 
      ? 'enabled' 
      : 'disabled'}. Run ${msg.guild 
      ? msg.guild.commandPrefix 
      : this.client.commandPrefix}rpreload to reload your presence.`);
  }
};