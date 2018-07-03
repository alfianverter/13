/**
 * @file Owner EShopFetchCommand - Fetch the latest data for the eShop command  
 * **Aliases**: `efetch`
 * @module
 * @category owner
 * @name eshopfetch
 * @returns {Message} Confirmation the data was fetched 
 */

const eshop = require('nintendo-switch-eshop'),
  fs = require('fs'),
  path = require('path'),
  {Command} = require('discord.js-commando'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class EshopFetchCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'eshopfetch',
      memberName: 'eshopfetch',
      group: 'searches',
      aliases: ['efetch'],
      description: 'Fetches latest games list from the Nintendo Switch eShop',
      examples: ['eshopfetch'],
      guildOnly: false,
      ownerOnly: true
    });
  }

  async run (msg) {
    msg.edit('\`fetching, please wait...\`');
    fs.writeFileSync(path.join(__dirname, '../../data/databases/eshopdata.json'), JSON.stringify(await eshop.getGamesAmerica()), 'utf8');

    if (fs.existsSync(path.join(__dirname, '../../data/databases/eshopdata.json'))) {
      deleteCommandMessages(msg, this.client);

      return msg.reply('Latest eshop data stored in file');
    }

    return msg.reply('an error occurred fetching latest data!');
  }
};