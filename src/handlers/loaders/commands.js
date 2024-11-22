const Discord = require('discord.js')
const { REST } = require('discord.js')
const { Routes } = require('discord.js')
const kleur = require('kleur')
const fs = require('fs')

module.exports = client => {
  const interactionLogs = new Discord.WebhookClient({
    id: client.webhooks.interactionLogs.id,
    token: client.webhooks.interactionLogs.token
  })

  const commands = []

  if (client.shard.ids[0] === 0)
    console.log(
      kleur.blue(kleur.bold(`System`)),
      kleur.white(`>>`),
      kleur.green(`Loading commands`),
      kleur.white(`...`)
    )
  if (client.shard.ids[0] === 0) console.log(`\u001b[0m`)

  fs.readdirSync('./src/interactions').forEach(dirs => {
    const commandFiles = fs
      .readdirSync(`./src/interactions/${dirs}`)
      .filter(files => files.endsWith('.js'))

    if (client.shard.ids[0] === 0)
      console.log(
        kleur.blue(kleur.bold(`System`)),
        kleur.white(`>>`),
        kleur.red(`${commandFiles.length}`),
        kleur.green(`commands of`),
        kleur.red(`${dirs}`),
        kleur.green(`loaded`)
      )

    for (const file of commandFiles) {
      const command = require(
        `${process.cwd()}/src/interactions/${dirs}/${file}`
      )
      client.commands.set(command.data.name, command)
      commands.push(command.data)
    }
  })

  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN)

  ;(async () => {
    try {
      const embed = new Discord.EmbedBuilder()
        .setDescription(`Started refreshing application (/) commands.`)
        .setColor(client.config.colors.normal)
      interactionLogs.send({
        username: 'Bot Logs',
        embeds: [embed]
      })

      await rest.put(Routes.applicationCommands(client.config.discord.id), {
        body: commands
      })

      const embedFinal = new Discord.EmbedBuilder()
        .setDescription(
          `Successfully reloaded ${commands.length} application (/) commands.`
        )
        .setColor(client.config.colors.normal)
      interactionLogs.send({
        username: 'Bot Logs',
        embeds: [embedFinal]
      })
    } catch (error) {
      console.log(error)
    }
  })()
}
