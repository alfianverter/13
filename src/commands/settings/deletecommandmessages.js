/**
 * @file Settings DeleteCommandMessagesCommand - Configure whether the bot should delete command messages  
 * **Aliases**: `dcm`
 * @module
 * @category settings
 * @name deletecommandmessages
 * @example deletecommandmessages on
 * @param {BooleanResolvable} TrueOrFalse Some value that is either true or false
 * @returns {Message} Confirmation the setting was stored
 */

const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class DeleteCommandMessagesCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'deletecommandmessages',
      memberName: 'deletecommandmessages',
      group: 'settings',
      aliases: ['dcm'],
      description: 'Configure whether the bot should delete command messages',
      format: 'enable|disable',
      examples: ['deletecommandmessages enable'],
      guildOnly: false,
      args: [
        {
          key: 'option',
          prompt: 'Enable or disable deleting of command messages?',
          type: 'boolean',
          validate: (bool) => {
            const validBools = ['true', 't', 'yes', 'y', 'on', 'enable', 'enabled', '1', '+', 'false', 'f', 'no', 'n', 'off', 'disable', 'disabled', '0', '-'];

            if (validBools.includes(bool.toLowerCase())) {
              return true;
            }

            return `Has to be one of ${validBools.join(', ')}`;
          }
        }
      ]
    });
  }

  run (msg, {option}) {
    this.client.provider.set('global', 'deletecommandmessages', option);
		
    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`command messages will now be ${option ? 'deleted' : 'kept'}.`);
  }
};