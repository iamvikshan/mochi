const Discord = require('discord.js')

module.exports = async (client, interaction, args) => {
  client.embed(
    {
      title: `📘・Owner information`,
      desc: `____________________________`,
      thumbnail: client.user.avatarURL({ dynamic: true, size: 1024 }),
      fields: [
        {
          name: '👑┆Owner name',
          value: `Vikshan`,
          inline: true
        },
        {
          name: '🏷┆Discord username',
          value: `@vikshan`,
          inline: true
        },
        {
          name: '🏢┆Organization',
          value: `imavikshan`,
          inline: true
        },
        {
          name: '🌐┆Website',
          value: `[YouTube](https://youtube.com/@imavikshan)`,
          inline: true
        }
      ],
      type: 'editreply'
    },
    interaction
  )
}
