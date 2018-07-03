/**
 * @file Extra EmbedCommand - Create custom MessageEmbeds on the fly  
 * **Aliases**: `emb`, `embeds`
 * @module
 * @category extra
 * @name copypastalist
 * @returns {MessageEmbed} Your custom embed
 */

const {Command} = require('discord.js-commando'), 
  {MessageEmbed} = require('discord.js'), 
  {deleteCommandMessages} = require('../../util.js');

module.exports = class EmbedCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'embed',
      memberName: 'embed',
      group: 'extra',
      aliases: ['emb', 'embeds'],
      description: 'Create custom MessageEmbeds on the fly',
      format: 'FieldName>Value1[;Value2<FieldName2>Value1;Value2] [ImageURL]',
      examples: ['embed What goes up but never comes down?>Your Age'],
      guildOnly: false,
      args: [
        {
          key: 'content',
          prompt: 'What should the content of the embed be?',
          type: 'string',
          validate: (input) => {
            if (input.match(/(?:[\S ]+)>(?:[\S ]+).*/gim)) { // eslint-disable-line max-len
              return true;
            }

            return 'The format for a custom rich embed should at least be `FieldName>Value`. If you want to use spaces wrap the entire argument in `" "`';
          },
          wait: 60
        },
        {
          key: 'image',
          prompt: 'Any image to send into the embed?',
          type: 'string',
          default: '',
          validate: (url) => {
            if (url.match(/(https?:\/\/.*\.(?:png|jpg|gif|webp|jpeg|svg))/im)) {
              return true;
            }

            return 'Image URl has to be an actual URL';
          }
        }
      ]
    });
  }

  run (msg, {content, image}) {
    const customEmbed = new MessageEmbed(),
      paramString = content,
      fields = paramString.split('<'); // eslint-disable-line sort-vars

    fields.forEach((field) => {
      const chunks = field.split('>'),
        header = chunks[0],
        values = chunks[1].split(';');

      customEmbed.addField(header, values.join('\n'), true);
    });

    customEmbed
      .setColor(msg.member !== null ? msg.member.displayHexColor : '#7CFC00')
      .setImage(image ? image : null);

    deleteCommandMessages(msg, this.client);

    return msg.embed(customEmbed);
  }
};