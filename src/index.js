const Discord = require('discord.js')
const kleur = require('kleur')
require('dotenv').config('./.env')
const axios = require('axios')

// Check if the bot is up to date
const { version } = require('../package.json')
axios
  .get('https://api.github.com/repos/iamvikshan/mochi/releases/latest')
  .then(res => {
    if (res.data.tag_name !== version) {
      console.log(
        kleur.red.bgYellow(
          `Your bot is not up to date! Please update to the latest version!`,
          version + ' -> ' + res.data.tag_name
        )
      )
    }
  })
  .catch(err => {
    console.log(kleur.red().bgYellow(`Failed to check if bot is up to date!`))
  })

// Load webhooks and config
const webhook = require('./config/webhooks.json')
const config = require('./config/bot.js')
const webHooksArray = [
  'startLogs',
  'shardLogs',
  'errorLogs',
  'dmLogs',
  'voiceLogs',
  'serverLogs',
  'serverLogs2',
  'commandLogs',
  'consoleLogs',
  'warnLogs',
  'voiceErrorLogs',
  'creditLogs',
  'evalLogs',
  'interactionLogs'
]

// Apply fallback logic for webhooks
for (const webhookName of webHooksArray) {
  webhook[webhookName].id =
    webhook[webhookName].id || process.env.WEBHOOK_ID || null
  webhook[webhookName].token =
    webhook[webhookName].token || process.env.WEBHOOK_TOKEN || null

  if (!webhook[webhookName].id || !webhook[webhookName].token) {
    console.warn(
      kleur.yellow(`Warning:`),
      kleur.white(`Webhook "${webhookName}" is missing an ID or token.`)
    )
  }
}

// Dynamically initialize webhooks
const webhookClients = {}
for (const webhookName of webHooksArray) {
  const { id, token } = webhook[webhookName]

  if (id && token) {
    webhookClients[webhookName] = new Discord.WebhookClient({ id, token })
  } else {
    console.warn(
      kleur.yellow(`Warning:`),
      kleur.white(
        `Skipping initialization of webhook "${webhookName}" due to missing ID or token.`
      )
    )
    webhookClients[webhookName] = null
  }
}

// Start logs
const startLogs = webhookClients.startLogs
const shardLogs = webhookClients.shardLogs

// Sharding manager
const manager = new Discord.ShardingManager('./src/bot.js', {
  totalShards: 'auto',
  token: process.env.DISCORD_TOKEN,
  respawn: true
})

if (process.env.TOPGG_TOKEN) {
  const { AutoPoster } = require('topgg-autoposter')
  AutoPoster(process.env.TOPGG_TOKEN, manager)
}

console.clear()
console.log(
  kleur.blue(kleur.bold(`System`)),
  kleur.white(`>>`),
  kleur.green(`Starting up`),
  kleur.white(`...`)
)
console.log(`\u001b[0m`)
console.log(kleur.red(`© vikshan | 2021 - ${new Date().getFullYear()}`))
console.log(kleur.red(`All rights reserved`))
console.log(`\u001b[0m`)
console.log(`\u001b[0m`)
console.log(
  kleur.blue(kleur.bold(`System`)),
  kleur.white(`>>`),
  kleur.red(`Version ${version}`),
  kleur.green(`loaded`)
)
console.log(`\u001b[0m`)

manager.on('shardCreate', shard => {
  const embed = new Discord.EmbedBuilder()
    .setTitle(`Launching shard`)
    .setDescription(`A shard has just been launched`)
    .addFields([
      {
        name: 'ID',
        value: `${shard.id + 1}/${manager.totalShards}`,
        inline: true
      },
      {
        name: 'State',
        value: `Starting up...`,
        inline: true
      }
    ])
    .setColor(config.colors.normal)

  sendWebhookMessage(startLogs, embed)

  console.log(
    kleur.blue(kleur.bold(`System`)),
    kleur.white(`>>`),
    kleur.green(`Starting`),
    kleur.red(`Shard #${shard.id + 1}`),
    kleur.white(`...`)
  )
  console.log(`\u001b[0m`)

  shard.on('death', process => {
    const deathEmbed = new Discord.EmbedBuilder()
      .setTitle(
        `Closing shard ${shard.id + 1}/${manager.totalShards} unexpectedly`
      )
      .addFields([
        {
          name: 'ID',
          value: `${shard.id + 1}/${manager.totalShards}`
        }
      ])
      .setColor(config.colors.normal)

    sendWebhookMessage(shardLogs, deathEmbed)

    if (process.exitCode === null) {
      const exitEmbed = new Discord.EmbedBuilder()
        .setTitle(
          `Shard ${shard.id + 1}/${manager.totalShards} exited with NULL error code!`
        )
        .addFields([
          {
            name: 'PID',
            value: `\`${process.pid}\``
          },
          {
            name: 'Exit code',
            value: `\`${process.exitCode}\``
          }
        ])
        .setColor(config.colors.normal)

      sendWebhookMessage(shardLogs, exitEmbed)
    }
  })

  shard.on('shardDisconnect', event => {
    const disconnectEmbed = new Discord.EmbedBuilder()
      .setTitle(`Shard ${shard.id + 1}/${manager.totalShards} disconnected`)
      .setDescription('Dumping socket close event...')
      .setColor(config.colors.normal)

    sendWebhookMessage(shardLogs, disconnectEmbed)
  })

  shard.on('shardReconnecting', () => {
    const reconnectEmbed = new Discord.EmbedBuilder()
      .setTitle(`Reconnecting shard ${shard.id + 1}/${manager.totalShards}`)
      .setColor(config.colors.normal)

    sendWebhookMessage(shardLogs, reconnectEmbed)
  })
})

manager.spawn()

// Error handling
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error)

  const embed = new Discord.EmbedBuilder()
    .setTitle(`Unhandled promise rejection`)
    .addFields([
      {
        name: 'Error',
        value: error ? Discord.codeBlock(error.toString()) : 'No error'
      },
      {
        name: 'Stack error',
        value: error?.stack ? Discord.codeBlock(error.stack) : 'No stack error'
      }
    ])

  sendWebhookMessage(webhookClients.consoleLogs, embed)
})

process.on('warning', warn => {
  console.warn('Warning:', warn)

  const embed = new Discord.EmbedBuilder()
    .setTitle(`New warning found`)
    .addFields([
      {
        name: `Warn`,
        value: `\`\`\`${warn}\`\`\``
      }
    ])

  sendWebhookMessage(webhookClients.warnLogs, embed)
})

// Helper function to send webhook messages
function sendWebhookMessage(webhookClient, embed) {
  if (!webhookClient) {
    console.warn(
      kleur.yellow(`Warning:`),
      kleur.white(`Attempted to send message to a non-initialized webhook.`)
    )
    return
  }

  webhookClient
    .send({
      username: 'Bot Logs',
      embeds: [embed]
    })
    .catch(error => {
      console.error(
        kleur.red(`Error:`),
        kleur.white(`Failed to send message to webhook:`),
        error
      )
    })
}
