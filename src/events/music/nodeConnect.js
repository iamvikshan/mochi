const Discord = require('discord.js')
const kleur = require('kleur')

module.exports = (client, node) => {
  console.log(
    kleur.blue(kleur.bold(`System`)),
    kleur.white(`>>`),
    kleur.red(`Lavalink`),
    kleur.green(`connected!`)
  )
}
