/**
 * @file Extra CopyPastaCommand - Sends one of your saved copypastas  
 * Sends a copypasta stored in the data/databases/pastas.sqlite3 database  
 * **Aliases**: `cp`, `pasta`
 * @module
 * @category extra
 * @name copypasta
 * @example copypasta navy
 * @param {StringResolvable} PastaName Name of the copypasta to send
 * @returns {MessageEmbed} Copypasta content. In a normal message if more than 1024 characters
 */

const Database = require('better-sqlite3'),
  dym = require('didyoumean2'),
  path = require('path'),
  {Command} = require('discord.js-commando'),
  {splitMessage, MessageEmbed} = require('discord.js'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class CopyPastaCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'copypasta',
      memberName: 'copypasta',
      group: 'extra',
      aliases: ['cp', 'pasta'],
      description: 'Sends contents of a copypasta file to the chat',
      format: 'CopypastaName',
      examples: ['copypasta navy'],
      guildOnly: false,
      args: [
        {
          key: 'name',
          prompt: 'Send which copypasta?',
          type: 'string',
          parse: p => p.toLowerCase()
        }
      ]
    });
  }

  async run (msg, {name}) {
    const conn = new Database(path.join(__dirname, '../../data/databases/pastas.sqlite3')),
      pastaEmbed = new MessageEmbed();

    try {
      const query = conn.prepare('SELECT * FROM pastas WHERE name = ?;').get(name);

      if (query) {
        const image = query.content.match(/(https?:\/\/.*\.(?:png|jpg|gif|webp|jpeg|svg))/im);

        if (image) {
          pastaEmbed.setImage(image[0]);
          query.content = query.content.replace(/(<|>)/gm, '');
          query.content = query.content.substring(0, image.index - 1) + query.content.substring(image.index + image[0].length);
        }

        if (query.content.length >= 1950) {
          const messages = [],
            splitTotal = splitMessage(query.content);

          for (const part in splitTotal) {
            messages.push(await msg.say(splitTotal[part]));
          }

          deleteCommandMessages(msg, this.client);

          return messages;
        }
        pastaEmbed
          .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
          .setTitle(query.name)
          .setDescription(query.content);

        deleteCommandMessages(msg, this.client);

        return msg.embed(pastaEmbed);
      }
      // eslint-disable-next-line one-var
      const maybe = dym(name, conn.prepare('SELECT name FROM pastas;')
        .all()
        .map(a => a.name), {deburr: true});

      deleteCommandMessages(msg, this.client);

      return msg.reply(oneLine`that copypasta does not exist! ${maybe 
        ? oneLine`Did you mean \`${maybe}\`?` 
        : `You can save it with \`${msg.guild.commandPrefix}copypastaadd <name> <content>\``}`);
    } catch (err) {
      deleteCommandMessages(msg, this.client);
      if (/(?:no such table)/i.test(err.toString())) {
        return msg.reply(`no pastas saved for this server. Start saving your first with \`${msg.guild.commandPrefix}copypastaadd <name> <content>\``);
      }

      console.error(err);
      
      return msg.reply(oneLine`Woops! something went horribly wrong there, the error was logged to the console.
      Want to know more about the error? Join the support server by getting an invite by using the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}invite\` command `);
    }
  }
};