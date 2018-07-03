/**
 * @file Extra CopyPastaAddCommand - Save a new copypasta to the database  
 * **Aliases**: `cpadd`, `pastaadd`
 * @module
 * @category extra
 * @name copypastaadd
 * @example copypastaadd lipsum Lorem ipsum dolor sit amet. 
 * @param {StringResolvable} PasteName Name for the new pasta
 * @param {StringResolvable} PastaContent Content for the new pasta
 * @returns {Message} Confirmation the copypasta was added
 */

const Database = require('better-sqlite3'),
  path = require('path'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class CopyPastaAddCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'copypastaadd',
      memberName: 'copypastaadd',
      group: 'extra',
      aliases: ['cpadd', 'pastaadd'],
      description: 'Saves a copypasta to local file',
      format: 'CopypastaName CopypastaContent',
      examples: ['copypasta navy what the fuck did you just say to me ... (etc.)'],
      guildOnly: false,
      args: [
        {
          key: 'name',
          prompt: 'Send which copypasta?',
          type: 'string',
          parse: p => p.toLowerCase()
        },
        {
          key: 'content',
          prompt: 'What should be stored in the copypasta?',
          type: 'string'
        }
      ]
    });
  }

  run (msg, {name, content}) {
    const conn = new Database(path.join(__dirname, '../../data/databases/pastas.sqlite3')),
      pastaAddEmbed = new MessageEmbed();

    pastaAddEmbed
      .setAuthor(msg.member.displayName, msg.author.displayAvatarURL({format: 'png'}))
      .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
      .setDescription(content);

    try {
      const query = conn.prepare('SELECT name FROM pastas WHERE name = ?;').get(name);

      if (query) {
        conn.prepare('UPDATE pastas SET content=$content WHERE name=$name').run({
          name,
          content
        });

        pastaAddEmbed.setTitle(`Copypasta \`${name}\` Updated`);

        deleteCommandMessages(msg, this.client);

        return msg.embed(pastaAddEmbed);
      }
      conn.prepare('INSERT INTO pastas VALUES ($name, $content);').run({
        name,
        content
      });
      pastaAddEmbed.setTitle(`Copypasta \`${name}\` Added`);

      return msg.embed(pastaAddEmbed);
    } catch (err) {
      if (/(?:no such table)/i.test(err.toString())) {
        conn.prepare('CREATE TABLE IF NOT EXISTS pastas (name TEXT PRIMARY KEY, content TEXT);').run();

        conn.prepare('INSERT INTO pastas VALUES ($name, $content);').run({
          name,
          content
        });
        pastaAddEmbed.setTitle(`Copypasta \`${name}\` Added`);

        return msg.embed(pastaAddEmbed);
      }

      console.error(err);
      
      return msg.reply(oneLine`Woops! something went horribly wrong there, the error was logged to the console.
      Want to know more about the error? Join the support server by getting an invite by using the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}invite\` command `);
    }
  }
};