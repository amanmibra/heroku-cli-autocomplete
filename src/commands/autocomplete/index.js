// @flow

import {AutocompleteBase} from '../../autocomplete'
import cli from 'cli-ux'
import {flags} from 'cli-engine-heroku'
import AutocompleteInit from './init'

export default class Autocomplete extends AutocompleteBase {
  static topic = 'autocomplete'
  static description = 'display autocomplete instructions'
  // hide until beta release
  static hidden = true
  static args = [{name: 'shell', description: 'shell type', required: false}]
  static flags = {
    'skip-ellipsis': flags.boolean({description: 'Do not add an ellipsis to zsh autocomplete setup', char: 'e'}),
    'skip-instructions': flags.boolean({description: 'Do not show installation instructions', char: 's'})
  }

  async run () {
    this.errorIfWindows()

    const shell = this.argv[0] || this.config.shell
    if (!shell) {
      cli.error('Error: Missing required argument shell')
    }

    if (!this.flags['skip-instructions']) {
      switch (shell) {
        // for now, suspending bash completion
        //       case 'bash':
        //         const cmd = CustomColors.cmd(`$ printf $(heroku autocomplete:script bash) >> ~/.bashrc`)
        //         this.out.log(`Add the autocomplete setup script to your .bashrc or .bash_profile via:
        //
        // ${cmd}`)
        //         break
        case 'zsh':
          cli.log(`${cli.color.bold('Setup Instructions for Heroku CLI Autocomplete ---')}

1) Add the autocomplete env vars to your zsh profile

${cli.color.cyan('$ printf "$(heroku autocomplete:script zsh)" >> ~/.zshrc')}

2) Run compaudit to ensure no permissions conflicts are present (some versions of zsh may not have this command)

${cli.color.cyan('$ compaudit')}

3) Source your updated zsh profile

${cli.color.cyan('$ source ~/.zshrc')}

4) Test command completion by pressing <TAB>, e.g.:

${cli.color.cyan('$ heroku <TAB>')}

5) Test flag completion by pressing <TAB>, e.g.:

${cli.color.cyan('$ heroku apps:info --<TAB>')}

6) Test flag options completion by pressing <TAB>, e.g.:

${cli.color.cyan('$ heroku apps:info --app=<TAB>')}
`)
          break
        default:
          cli.error(`Currently ${shell} is not a supported shell for autocomplete`)
      }

      cli.log(`\n${cli.color.bold('To uninstall Heroku CLI Autocomplete:')}
-- Uninstall this plugin from your CLI (for help see: ${cli.color.cyan('heroku help plugins:uninstall')})
-- Delete the env vars from your zsh profile & restart your terminal
`)
    }

    cli.action.start(`${cli.color.bold('Building autocomplete cache')}`)
    const argv = ['heroku', 'autocomplete:init'].concat(this.config.argv.filter(a => a === '--skip-ellipsis' || a === '-e'))
    await AutocompleteInit.run(Object.assign(this.config, {argv}))
    cli.action.stop()

    cli.log('\nEnjoy!')
  }
}
