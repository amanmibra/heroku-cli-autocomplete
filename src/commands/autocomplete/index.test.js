// @flow

import Autocomplete from '.'
import os from 'os'
import cli from 'cli-ux'

// autocomplete will throw error on windows
let runtest = (os.platform() === 'windows' || os.platform() === 'win32') ? xtest : test

runtest('outputs install instructions for zsh', async () => {
  cli.config.mock = true
  await Autocomplete.mock('zsh')
  expect(cli.stdout.output).toMatch(`Setup Instructions for Heroku CLI Autocomplete ---

1) Add the autocomplete env vars to your zsh profile

$ printf "$(heroku autocomplete:script zsh)" >> ~/.zshrc

NOTE: Run compaudit to ensure no permissions conflicts are present (some versions of zsh may not have this command)

$ compaudit

2) Source your updated zsh profile

$ source ~/.zshrc

3) Test command completion by pressing <TAB>, e.g.:

$ heroku <TAB>

4) Test flag completion by pressing <TAB>, e.g.:

$ heroku apps:info --<TAB>

5) Test flag options completion by pressing <TAB>, e.g.:

$ heroku apps:info --app=<TAB>


To uninstall Heroku CLI Autocomplete:
-- Uninstall this plugin from your CLI (for help see: heroku help plugins:uninstall)
-- Delete the env vars from your zsh profile & restart your terminal


Enjoy!`)
})

runtest('outputs install instructions for bash', async () => {
  cli.config.mock = true
  await Autocomplete.mock('bash')
  expect(cli.stdout.output).toMatch(`Setup Instructions for Heroku CLI Autocomplete ---

1) Add the autocomplete env vars to your bash profile

$ printf "$(heroku autocomplete:script bash)" >> ~/.bashrc

2) Source your updated bash profile

$ source ~/.bashrc

3) Test command completion by pressing <TAB>, e.g.:

$ heroku <TAB>

4) Test flag completion by pressing <TAB>, e.g.:

$ heroku apps:info --<TAB>

5) Test flag options completion by pressing <TAB>, e.g.:

$ heroku apps:info --app=<TAB>


To uninstall Heroku CLI Autocomplete:
-- Uninstall this plugin from your CLI (for help see: heroku help plugins:uninstall)
-- Delete the env vars from your bash profile & restart your terminal


Enjoy!`)
})

runtest('skips instructions', async () => {
  cli.config.mock = true
  await Autocomplete.mock('--skip-instructions')
  expect(cli.stdout.output).toMatch(`
Enjoy!`)
})

runtest('errors on unsupported shell', async () => {
  cli.config.mock = true
  try {
    await Autocomplete.mock('fish')
  } catch (e) {
    expect(cli.stderr.output).toMatch(` ▸    Currently fish is not a supported shell for autocomplete
`)
  }
})
