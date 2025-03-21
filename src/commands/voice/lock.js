const Discord = require('discord.js')

module.exports = async (client, interaction, args) => {
  const perms = await client.checkBotPerms(
    {
      flags: [Discord.PermissionsBitField.Flags.ManageChannels],
      perms: [Discord.PermissionsBitField.Flags.ManageChannels]
    },
    interaction
  )

  if (perms == false) return

  const channel = interaction.member.voice.channel
  if (!channel)
    return client.errNormal(
      {
        error: `You're not in a voice channel!`,
        type: 'editreply'
      },
      interaction
    )

  var checkVoice = await client.checkVoice(interaction.guild, channel)
  if (!checkVoice) {
    return client.errNormal(
      {
        error: `You cannot edit this channel!`,
        type: 'editreply'
      },
      interaction
    )
  } else {
    client.succNormal(
      {
        text: `The channel was succesfully locked!`,
        fields: [
          {
            name: `📘┆Channel`,
            value: `${channel} (${channel.name})`
          }
        ],
        type: 'editreply'
      },
      interaction
    )

    channel.permissionOverwrites.edit(
      interaction.guild.roles.cache.find(x => x.name === '@everyone'),
      {
        Connect: false
      }
    )
  }
}
