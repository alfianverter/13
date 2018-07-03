/**
 * @file Games FightCommand - Pit two things against each other in a fight to the death.  
 * **Aliases**: `combat`
 * @module
 * @category games
 * @name fight
 * @example fight Pyrrha Ruby
 * @param {StringResolvable} FighterOne The first combatant
 * @param {StringResolvable} FighterTwo The second combatant
 * @returns {MessageEmbed} Result of the combat
 */

const {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class fightCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'fight',
      memberName: 'fight',
      group: 'games',
      aliases: ['combat'],
      description: 'Pit two things against each other in a fight to the death',
      format: 'FirstFighter, SecondFighter',
      examples: ['fight Favna Chuck Norris'],
      guildOnly: false,
      args: [
        {
          key: 'fighterOne',
          prompt: 'Who or what is the first fighter?',
          type: 'string'
        },
        {
          key: 'fighterTwo',
          prompt: 'What should fighter one be fighting?',
          type: 'string'
        }
      ]
    });
  }

  run (msg, {fighterOne, fighterTwo}) {
    try {
      const fighterEmbed = new MessageEmbed();

      fighterOne = (/<@[0-9]{18}>/).test(fighterOne) ? msg.guild.members.get(fighterOne.slice(2, 20)).displayName : fighterOne;
      fighterTwo = (/<@[0-9]{18}>/).test(fighterTwo) ? msg.guild.members.get(fighterTwo.slice(2, 20)).displayName : fighterTwo;

      fighterEmbed
        .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
        .setTitle('🥊 Fight Results 🥊')
        .setThumbnail('https://favna.xyz/images/ribbonhost/dbxlogo.png');

      if (fighterOne.toLowerCase() === 'chuck norris' || fighterTwo.toLowerCase() === 'chuck norris') {
        if (fighterOne.toLowerCase() === 'favna' || fighterTwo.toLowerCase() === 'favna') {
          fighterEmbed
            .addField('All right, you asked for it...', '***The universe was destroyed due to this battle between two unstoppable forces. Good Job.***')
            .setImage('https://favna.xyz/images/ribbonhost/universeblast.png');
        } else {
          fighterEmbed
            .addField('You fokn wot m8', '***Chuck Norris cannot be beaten***')
            .setImage('https://favna.xyz/images/ribbonhost/chucknorris.png');
        }

        deleteCommandMessages(msg, this.client);

        return msg.embed(fighterEmbed);
      }

      if (fighterOne.toLowerCase() === 'favna' || fighterTwo.toLowerCase() === 'favna') {
        fighterEmbed
          .addField('You got mega rekt', '***Favna always wins***')
          .setImage('https://favna.xyz/images/ribbonhost/pyrrhawins.gif');

        deleteCommandMessages(msg, this.client);

        return msg.embed(fighterEmbed);
      }

      // eslint-disable-next-line one-var
      const fighterOneChance = Math.floor((Math.random() * 100) + 1),
        fighterTwoChance = Math.floor((Math.random() * 100) + 1),
        loser = Math.min(fighterOneChance, fighterTwoChance) === fighterOneChance ? fighterOne : fighterTwo,
        winner = Math.max(fighterOneChance, fighterTwoChance) === fighterOneChance ? fighterOne : fighterTwo;

      fighterEmbed
        .addField('🇼 Winner', `**${winner}**`, true)
        .addField('🇱 Loser', `**${loser}**`, true)
        .setFooter(`${winner} bodied ${loser} at`)
        .setTimestamp();

      deleteCommandMessages(msg, this.client);

      return msg.embed(fighterEmbed);

    } catch (err) {
      return msg.reply(`something went wrong trying to make \`${fighterOne}\` fight \`${fighterTwo}\``);
    }
  }
};