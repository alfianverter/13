/**
 * @file Settings RPAppIDCommand - Set your Rich Presence App ID  
 * **Aliases**: `appid`, `rpapp`, `rpapplication`
 * @module
 * @category settings
 * @name RPAppID
 * @example rpappid 355326429178757131
 * @param {StringResolvable} AppID The application ID to set
 * @returns {Message} Confirmation the setting was stored
 */

const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class RPAppIDCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rpappid',
      memberName: 'rpappid',
      group: 'settings',
      aliases: ['appid', 'rpapp', 'rpapplication'],
      description: 'Set your Rich Presence app ID',
      format: 'ApplicationID',
      examples: ['rpappid 355326429178757131'],
      guildOnly: false,
      args: [
        {
          key: 'appid',
          prompt: 'What is the ClientID of your Discord application?',
          type: 'string',
          label: 'appid',
          validate: (id) => {
            if (/[0-9]{18}/.test(id)) {
              return true;
            }

            return 'The AppID has to be 18 digits';
          }
        }
      ]
    });
  }

  run (msg, {appid}) {
    this.client.provider.set('global', 'rpappid', appid);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence AppID has been set to \`${appid}\``);
  }
};