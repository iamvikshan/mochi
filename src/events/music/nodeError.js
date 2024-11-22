const Discord = require('discord.js')
const kleur = require('kleur')

module.exports = (client, node, error) => {
  console.log(
    kleur.red(kleur.bold(`ERROR`)),
    kleur.white(`>>`),
    kleur.white(`Node`),
    kleur.red(`${node.options.identifier}`),
    kleur.white(`had an error:`),
    kleur.red(`${error.message}`)
  )
}
