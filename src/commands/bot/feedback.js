const Discord = require('discord.js')

module.exports = async (client, interaction, args) => {
  const feedback = interaction.options.getString('feedback')

  const embed = new Discord.EmbedBuilder()
    .setTitle(`📝・New feedback!`)
    .addFields({
      name: 'User',
      value: `${interaction.user} (${interaction.user.tag})`,
      inline: true
    })
    .setDescription(`${feedback}`)
    .setColor(client.config.colors.normal)

  // Get the channel ID from the .env file.
  const channelId = process.env.FEEDBACK_CHANNEL_ID

  // Get the channel with the ID from the .env file.
  const channel = client.channels.cache.get(channelId)

  // Send the embed to the channel.
  channel.send({ embeds: [embed] })

  client.succNormal(
    {
      text: `Feedback successfully sent to the developers`,
      type: 'editreply'
    },
    interaction
  )
}
