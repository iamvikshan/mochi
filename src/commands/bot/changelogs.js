const { Octokit } = require('@octokit/rest')
const { Discord } = require('discord.js')

module.exports = async (client, interaction, args) => {
  // Get the contents of the `CHANGELOG.md` file.
  const octokit = new Octokit()
  const response = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    {
      owner: 'vixshan',
      repo: 'Mochi',
      path: 'CHANGELOG.md'
    }
  )

  // Decode the base64-encoded contents of the file.
  const changelog = Buffer.from(response.data.content, 'base64').toString(
    'utf8'
  )

  // Send the changelog to the user.
  client.embed(
    {
      title: '📃・Changelogs',
      desc: `${changelog}`,
      thumbnail: client.user.avatarURL({ size: 1024 }),
      type: 'editreply'
    },
    interaction
  )
}
