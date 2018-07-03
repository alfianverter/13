/**
 * @file Settings RPLargeImageCommand - Set your Rich Presence Large Image  
 * **Aliases**: `largeimage`, `limage`
 * @module
 * @category settings
 * @name rplargeimage
 * @example rplargeimage 450426682151534602
 * @param {StringResolvable} LargeImage Either the name or ID of the large image
 * @returns {Message} Confirmation the setting was stored
 */

const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rplargeimageCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rplargeimage',
      memberName: 'rplargeimage',
      group: 'settings',
      aliases: ['largeimage', 'limage'],
      description: 'Set your Rich Presence Large Image',
      format: 'LargeImageID|LargeImageName',
      examples: ['rplargeimage 450426682151534602'],
      guildOnly: false,
      args: [
        {
          key: 'largeimage',
          prompt: 'What is the LargeImageID for the "large" Rich Presence image you want?',
          type: 'string',
          label: 'largeimageID'
        }
      ]
    });
  }

  /* eslint max-depth: ["error", 5]*/

  async run (msg, {largeimage}) {
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
            if (assets[i].type === 'BIG') {
              array.push({
                id: assets[i].id,
                name: assets[i].name
              });
            }
          }

          const id = array.find(o => o.id === largeimage), // eslint-disable-line one-var
            name = array.find(o => o.name === largeimage);
          let imageID = '';

          if (id) {
            imageID = id.id;
          } else if (name) {
            imageID = name.id;
          }

          if (!imageID) {
            return msg.reply(`Can't find \`${largeimage}\` in application with ID \`${appID}\``);
          }

          this.client.provider.set('global', 'rplargeimage', imageID);
					
          deleteCommandMessages(msg, this.client);

          return msg.reply(oneLine`Your RichPresence LargeImageID has been set to \`${largeimage}\``);
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