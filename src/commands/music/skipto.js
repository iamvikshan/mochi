const Discord = require('discord.js')

module.exports = async (client, interaction, args) => {
  const player = client.player.players.get(interaction.guild.id)

  const channel = interaction.member.voice.channel
  if (!channel)
    return client.errNormal(
      {
        error: `You're not in a voice channel!`,
        type: 'editreply'
      },
      interaction
    )

  if (player && channel.id !== player?.voiceChannel)
    return client.errNormal(
      {
        error: `You're not in the same voice channel!`,
        type: 'editreply'
      },
      interaction
    )

  if (!player || !player.queue.current)
    return client.errNormal(
      {
        error: 'There are no songs playing in this server',
        type: 'editreply'
      },
      interaction
    )

  let number = interaction.options.getNumber('number')

  player.skipto(parseInt(number))

  client.succNormal(
    {
      text: `Skipped the music to **${number}**`,
      type: 'editreply'
    },
    interaction
  )
}
