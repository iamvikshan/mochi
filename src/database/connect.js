const mongoose = require('mongoose')
const kleur = require('kleur')

async function connect() {
  mongoose.set('strictQuery', false)
  try {
    console.log(
      kleur.blue(kleur.bold(`Database`)),
      kleur.white(`>>`),
      kleur.red(`MongoDB`),
      kleur.green(`is connecting...`)
    )
    await mongoose.connect(process.env.MONGO_TOKEN)
  } catch (err) {
    console.log(
      kleur.red(`[ERROR]`),
      kleur.white(`>>`),
      kleur.red(`MongoDB`),
      kleur.white(`>>`),
      kleur.red(`Failed to connect to MongoDB!`),
      kleur.white(`>>`),
      kleur.red(`Error: ${err}`)
    )
    console.log(kleur.red('Exiting...'))
    process.exit(1)
  }

  mongoose.connection.once('open', () => {
    console.log(
      kleur.blue(kleur.bold(`Database`)),
      kleur.white(`>>`),
      kleur.red(`MongoDB`),
      kleur.green(`is ready!`)
    )
  })

  mongoose.connection.on('error', err => {
    console.log(
      kleur.red(`[ERROR]`),
      kleur.white(`>>`),
      kleur.red(`Database`),
      kleur.white(`>>`),
      kleur.red(`Failed to connect to MongoDB!`),
      kleur.white(`>>`),
      kleur.red(`Error: ${err}`)
    )
    console.log(kleur.red('Exiting...'))
    process.exit(1)
  })
  return
}

module.exports = connect
