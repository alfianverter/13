/**
 * @file Settings RPSmallImageCommand - Set your Rich Presence Small Image  
 * **Aliases**: `smallimage`, `simage`
 * @module
 * @category settings
 * @name rpsmallimage
 * @example smallimage 450426771276431390
 * @param {StringResolvable} SmallImage Either the name or ID of the small image
 * @returns {Message} Confirmation the setting was stored
 */

const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class RPSmallImageCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rpsmallimage',
      memberName: 'rpsmallimage',
      group: 'settings',
      aliases: ['smallimage', 'simage'],
      description: 'Set your Rich Presence SmallImage ID',
      format: 'SmallImageID|SmallImageName',
      examples: ['rpsmallimage 450426771276431390'],
      guildOnly: false,
      args: [
        {
          key: 'smallimage',
          prompt: 'What is the SmallImageID for the "small" Rich Presence image you want?',
          type: 'string',
          label: 'smallimageID'
        }
      ]
    });
  }

  /* eslint max-depth: ["error", 5]*/
  async run (msg, {smallimage}) {
    const appID = this.client.provider.get('global', 'rpappid');

    if (appID) {
      const application = await this.client.fetchApplication(appID);

      if (application) {
        const assets = await application.fetchAssets();

        if (assets) {
          const array = [];

          if (assets.length === 0) {
            return msg.reply(`No assets found in application with ID \`${appID}\``);
          }
          for (const i in assets) {
            if (assets[i].type === 'SMALL') {
              array.push({
                id: assets[i].id,
                name: assets[i].name
              });
            }
          }

          const id = array.find(o => o.id === smallimage), // eslint-disable-line one-var
            name = array.find(o => o.name === smallimage);
          let imageID = '';

          if (id) {
            imageID = id.id;
          } else if (name) {
            imageID = name.id;
          }

          if (!imageID) {
            return msg.reply(`Can't find \`${smallimage}\` in application with ID \`${appID}\``);
          }

          this.client.provider.set('global', 'rpsmallimage', imageID);
					
          deleteCommandMessages(msg, this.client);

          return msg.reply(oneLine`Your RichPresence Small Image has been set to \`${smallimage}\``);
        }

        return msg.reply(`No assets found in application with ID \`${appID}\``);
      }

      return msg.reply(oneLine`an error occurred fetching that application. Are you sure the ID is correct? Set it with the \`${msg.guild
        ? msg.guild.commandPrefix
        : this.client.commandPrefix}rpappid\`command `);
    }

    return msg.reply(`You first need to set your application with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}rpappid\` command!`);
  }
};