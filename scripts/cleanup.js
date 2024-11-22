// do not run unless you know the consequences
// deleates all releases and all builds across gitlab and github

// cleanup.js
require('dotenv').config()
const axios = require('axios')

// API Clients
const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${process.env.GH_TOKEN}`,
    Accept: 'application/vnd.github.v3+json'
  }
})

const gitlabApi = axios.create({
  baseURL: 'https://gitlab.com/api/v4',
  headers: {
    'PRIVATE-TOKEN': process.env.GITLAB_TOKEN
  }
})

// GitHub Operations
async function deleteGitHubTags(owner, repo) {
  try {
    const { data: tags } = await githubApi.get(`/repos/${owner}/${repo}/tags`)
    for (const tag of tags) {
      await githubApi.delete(
        `/repos/${owner}/${repo}/git/refs/tags/${tag.name}`
      )
      console.log(`Deleted GitHub tag: ${tag.name}`)
    }
  } catch (error) {
    console.error('Error deleting GitHub tags:', error.message)
  }
}

async function deleteGitHubReleases(owner, repo) {
  try {
    const { data: releases } = await githubApi.get(
      `/repos/${owner}/${repo}/releases`
    )
    for (const release of releases) {
      await githubApi.delete(`/repos/${owner}/${repo}/releases/${release.id}`)
      console.log(`Deleted GitHub release: ${release.tag_name}`)
    }
  } catch (error) {
    console.error('Error deleting GitHub releases:', error.message)
  }
}

// GitLab Operations
async function deleteGitLabTags(projectPath) {
  try {
    const encodedPath = encodeURIComponent(projectPath)
    const { data: tags } = await gitlabApi.get(
      `/projects/${encodedPath}/repository/tags`
    )
    for (const tag of tags) {
      await gitlabApi.delete(
        `/projects/${encodedPath}/repository/tags/${encodeURIComponent(tag.name)}`
      )
      console.log(`Deleted GitLab tag: ${tag.name}`)
    }
  } catch (error) {
    console.error(
      'Error deleting GitLab tags:',
      error.response?.status,
      error.response?.data
    )
  }
}

async function main() {
  const githubOwner = 'vixshan'
  const githubRepo = 'mochi'
  const gitlabProjectPath = 'vikshan/mochi' // Format: group/project or user/project

  console.log('Starting cleanup...')

  // GitHub cleanup
  await deleteGitHubTags(githubOwner, githubRepo)
  await deleteGitHubReleases(githubOwner, githubRepo)

  // GitLab cleanup
  await deleteGitLabTags(gitlabProjectPath)

  console.log('Cleanup completed!')
}

main().catch(console.error)
