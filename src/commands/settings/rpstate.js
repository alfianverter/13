/**
 * @file Settings RPStateCommand - Set your Rich Presence state
 * **Aliases**: `state`
 * @module
 * @category settings
 * @name rpstate
 * @example rpstate And the bad life
 * @param {StringResolvable} StateText The text you want to use for the state
 * @returns {Message} Confirmation the setting was stored
 */

const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class RPStateCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rpstate',
      memberName: 'rpstate',
      group: 'settings',
      aliases: ['state'],
      description: 'Set your Rich Presence state',
      format: 'StateText',
      examples: ['rpstate And the bad life'],
      guildOnly: false,
      args: [
        {
          key: 'state',
          prompt: 'What is the state string for your richpresence?',
          type: 'string',
          label: 'state',
          validate: (state) => {
            if (Buffer.byteLength(state, 'utf8') <= 128) {
              return true;
            }

            return 'The state string cannot be longer than 128 bytes';
          }
        }
      ]
    });
  }

  run (msg, {state}) {
    this.client.provider.set('global', 'rpstate', state);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence State has been set to \`${state}\``);
  }
};