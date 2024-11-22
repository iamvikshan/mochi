const { CommandInteraction, Client } = require('discord.js')
const { SlashCommandBuilder } = require('discord.js')
const Discord = require('discord.js')
const OWNER_ID = process.env.OWNER_ID

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dev')
    .setDescription('Commands for the Bot developers')

    .addSubcommand(subcommand =>
      subcommand
        .setName('servers')
        .setDescription('See all servers from this shard')
    ),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */

  run: async (client, interaction, args) => {
    // Check if the user is the owner
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({
        content: 'You must be the bot owner to use this command.',
        ephemeral: true
      })
    }

    // Continue with the command
    await interaction.deferReply({ fetchReply: true })
    client.loadSubcommands(client, interaction, args)
  }
}
