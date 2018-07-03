/**
 * @file Games CoppersCommand - YOU ARE SURROUNDED!  
 * **Aliases**: `police`, `cops`
 * @module
 * @category games
 * @name coppers
 * @returns {Message} WIIEEEOOWIIEEOOO YOU ARE SURROUNDED!!!
 */

const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class CoppersCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'coppers',
      memberName: 'coppers',
      group: 'games',
      aliases: ['police', 'cops'],
      description: 'YOU ARE SURROUNDED!',
      examples: ['coppers'],
      guildOnly: false
    });
  }

  run (msg) {
    deleteCommandMessages(msg, this.client);

    if (this.client.user.premium) {
      return msg.say(oneLine`<:police:346089253572313088> :oncoming_police_car: :rotating_light: :rotating_light: 
			WEE WOO WEE WOO - PUT YOUR HANDS IN THE AIR, YOU ARE SURROUNDED
			 :rotating_light: :rotating_light: :oncoming_police_car: <:police:346089253572313088>`);
    }

    return msg.say(oneLine`:oncoming_police_car: :rotating_light: :rotating_light: 
		WEE WOO WEE WOO - PUT YOUR HANDS IN THE AIR, YOU ARE SURROUNDED
		 :rotating_light: :rotating_light: :oncoming_police_car:`);
  }
};