// @flow

import {AutocompleteBase} from '../../autocomplete'
import cli from 'cli-ux'
import {flags} from 'cli-engine-heroku'
import AutocompleteCacheBuilder from './cache'

export default class Autocomplete extends AutocompleteBase {
  static topic = 'autocomplete'
  static description = 'display autocomplete instructions'
  // hide until public release
  static hidden = true
  static args = [{name: 'shell', description: 'shell type', required: false}]
  static flags = {
    'skip-instructions': flags.boolean({description: 'Do not show installation instructions', char: 's'})
  }

  async run () {
    this.errorIfWindows()

    const shell = this.argv[0] || this.config.shell
    if (!shell) {
      cli.error('Error: Missing required argument shell')
    }

    if (!this.flags['skip-instructions']) {
      if (shell !== 'bash' && shell !== 'zsh') {
        cli.error(`Currently ${shell} is not a supported shell for autocomplete`)
      }

      cli.log(`${cli.color.bold('Setup Instructions for Heroku CLI Autocomplete ---')}

1) Add the autocomplete env vars to your ${shell} profile

${cli.color.cyan(`$ printf "$(heroku autocomplete:script ${shell})" >> ~/.${shell}rc`)}
${shell === 'zsh' ? `
NOTE: Run compaudit to ensure no permissions conflicts are present (some versions of ${shell} may not have this command)

${cli.color.cyan('$ compaudit')}
` : ''}
2) Source your updated ${shell} profile

${cli.color.cyan(`$ source ~/.${shell}rc`)}

3) Test command completion by pressing <TAB>, e.g.:

${cli.color.cyan('$ heroku <TAB>')}

4) Test flag completion by pressing <TAB>, e.g.:

${cli.color.cyan('$ heroku apps:info --<TAB>')}

5) Test flag options completion by pressing <TAB>, e.g.:

${cli.color.cyan('$ heroku apps:info --app=<TAB>')}
`)

      cli.log(`\n${cli.color.bold('To uninstall Heroku CLI Autocomplete:')}
-- Uninstall this plugin from your CLI (for help see: ${cli.color.cyan('heroku help plugins:uninstall')})
-- Delete the env vars from your ${shell} profile & restart your terminal
`)
    }

    cli.action.start(`${cli.color.bold('Building autocomplete cache')}`)
    await AutocompleteCacheBuilder.run(Object.assign(this.config, {argv: [this.argv[0], 'autocomplete:cache']}))
    cli.action.stop()

    cli.log('\nEnjoy!')
  }
}
