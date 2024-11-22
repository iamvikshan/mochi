const Discord = require('discord.js')
const kleur = require('kleur')
const { random } = require('mathjs')

module.exports = async client => {
  console.log(`\u001b[0m`)
  console.log(
    kleur.blue(kleur.bold(`System`)),
    kleur.white(`>>`),
    kleur.red(`Shard #${client.shard.ids[0] + 1}`),
    kleur.green(`is ready!`)
  )
  console.log(
    kleur.blue(kleur.bold(`Bot`)),
    kleur.white(`>>`),
    kleur.green(`Started on`),
    kleur.red(`${client.guilds.cache.size}`),
    kleur.green(`servers!`)
  )

  let embed = new Discord.EmbedBuilder()
    .setTitle(`🆙・Finishing shard`)
    .setDescription(`A shard just finished`)
    .addFields(
      {
        name: '🆔┆ID',
        value: `${client.shard.ids[0] + 1}/${client.options.shardCount}`,
        inline: true
      },
      { name: '📃┆State', value: `Ready`, inline: true }
    )
    .setColor(client.config.colors.normal)

  // Get the channel with the ID from the .env file.
  const channel = client.channels.cache.get(process.env.LOG_CHANNEL_ID)

  // Send the embed to the channel.
  channel.send({ embeds: [embed] })

  setInterval(async function () {
    const promises = [client.shard.fetchClientValues('guilds.cache.size')]
    return Promise.all(promises).then(results => {
      const totalGuilds = results[0].reduce(
        (acc, guildCount) => acc + guildCount,
        0
      )
      let statuttext
      if (process.env.DISCORD_STATUS) {
        statuttext = process.env.DISCORD_STATUS.split(', ')
      } else {
        statuttext = [
          `・❓┆/help`,
          `・💻┆${totalGuilds} servers`,
          `・📨┆discord.gg/corwindev`,
          `・🎉┆400+ commands`,
          `・🏷️┆Version ${require(`${process.cwd()}/package.json`).version}`
        ]
      }
      const randomText =
        statuttext[Math.floor(Math.random() * statuttext.length)]
      client.user.setPresence({
        activities: [{ name: randomText, type: Discord.ActivityType.Playing }],
        status: 'online'
      })
    })
  }, 50000)

  client.player.init(client.user.id)
}
