#!/usr/bin/env node

/**
 * Script to update version numbers in documentation and configuration files
 * Used by semantic-release during the release process
 */

const fs = require('fs')
const path = require('path')

const version = process.argv[2]
if (!version) {
  console.error('Usage: node update-version.js <version>')
  process.exit(1)
}

console.log(`Updating version to ${version} in documentation files...`)

// Update app.json version (for Heroku deployments)
const appJsonPath = path.join(__dirname, '..', 'app.json')
if (fs.existsSync(appJsonPath)) {
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'))
  appJson.version = version
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n')
  console.log(`✅ Updated app.json to version ${version}`)
}

// Update README.md badges and references
const readmePath = path.join(__dirname, '..', 'README.md')
if (fs.existsSync(readmePath)) {
  let readme = fs.readFileSync(readmePath, 'utf8')

  // Update any hardcoded version references in README
  readme = readme.replace(/v\d+\.\d+\.\d+/g, `v${version}`)

  fs.writeFileSync(readmePath, readme)
  console.log(`✅ Updated README.md version references to ${version}`)
}

// Update package.json engines field to ensure Bun compatibility
const packageJsonPath = path.join(__dirname, '..', 'package.json')
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  // Ensure engines.bun is set to a reasonable minimum version
  if (!packageJson.engines) packageJson.engines = {}
  if (!packageJson.engines.bun) packageJson.engines.bun = '>=1.0.0'

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
  console.log(`✅ Verified package.json engines field for Bun compatibility`)
}

// Update .replit configuration if needed
const replitPath = path.join(__dirname, '..', '.replit')
if (fs.existsSync(replitPath)) {
  // .replit doesn't typically need version updates, but we include it for completeness
  console.log(`✅ .replit file checked (no version updates needed)`)
}

console.log(`🎉 All version updates completed for ${version}!`)
