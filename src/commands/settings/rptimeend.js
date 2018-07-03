/**
 * @file Settings RPTimeEndCommand - Set your Rich Presence End Timestamp  
 * Make sure to enable timestamps with the `rptoggletimeend` command    
 * **Aliases**: `timeend`, `endtime`, `rptime`, `rpend`
 * @module
 * @category settings
 * @name rptimeend
 * @example rptimeend 3
 * @param {NumberResolvable} AmountOfHours The amount of hours to which the Rich Presence should count down
 * @returns {Message} Confirmation the setting was stored
 */


const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class RPTimeEndCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rptimeend',
      memberName: 'rptimeend',
      group: 'settings',
      aliases: ['timeend', 'endtime', 'rptime', 'rpend'],
      description: 'Set your Rich Presence End Timestamp',
      details: 'Make sure to enable timestamp with the `rptoggletimeend` command',
      format: 'HoursAmount',
      examples: ['rptimeend 2'],
      guildOnly: false,
      args: [
        {
          key: 'time',
          prompt: 'How many hours in the future do you want the timer to end?',
          type: 'integer',
          label: 'endtime',
          validate: (time) => {
            if (time <= 24) {
              return true;
            }

            return 'Rich Presence time has to end within 24 hours';
          }
        }
      ]
    });
  }

  run (msg, {time}) {
    this.client.provider.set('global', 'rptimeend', time);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence End Timestamp has been set to \`${time} hour(s)\``);
  }
};