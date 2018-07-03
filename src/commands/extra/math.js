/**
 * @file Extra MathCommand - Take the effort out of calculations and let the bot do it for you  
 * **Aliases**: `maths`, `calc`
 * @module
 * @category extra
 * @name math
 * @example math (PI - 1) * 3
 * @param {StringResolvable} Equation The equation to solve
 * @returns {MessageEmbed} Your equation and its answer
 */

const scalc = require('scalc'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class MathCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'math',
      memberName: 'math',
      group: 'extra',
      aliases: ['calc', 'maths'],
      description: 'Take the effort out of calculations and let the bot do it for you',
      format: 'EquationToSolve',
      examples: ['math -10 - abs(-3) + 2^5'],
      guildOnly: false,
      args: [
        {
          key: 'equation',
          prompt: 'What is the equation to solve?',
          type: 'string',
          parse: p => p.toLowerCase()
        }
      ]
    });
  }

  run (msg, {equation}) {
    try {
      const mathEmbed = new MessageEmbed(),
        res = scalc(equation);

      mathEmbed
        .setTitle('Calculator')
        .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
        .setDescription(oneLine`The answer to \`${equation.toString()}\` is \`${res}\``);

      deleteCommandMessages(msg, this.client);

      return msg.embed(mathEmbed);
    } catch (err) {
      deleteCommandMessages(msg, this.client);

      return msg.reply(oneLine`\`${equation.toString()}\` is is not a valid equation for this command.
          Check out this readme to see how to use the supported polish notation: https://github.com/dominhhai/calculator/blob/master/README.md`);
    }
  }
};