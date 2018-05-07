import {flags} from '@heroku-cli/command'
import {Config} from '@oclif/config'
import {expect} from 'chai'
import * as path from 'path'

import {AutocompleteBase} from '../src/base'

// autocomplete will throw error on windows
const {default: runtest} = require('./helpers/runtest')

class AutocompleteTest extends AutocompleteBase {
  static id = 'test:foo'
  static flags = {
    app: flags.app(),
    bar: flags.boolean(),
  }
  async run() {}
}

const root = path.resolve(__dirname, '../package.json')
const config = new Config({root})

const cmd = new AutocompleteTest([], config)

runtest('AutocompleteBase', () => {
  before(async () => {
    await config.load()
  })

  it('#errorIfWindows', async () => {
    try {
      new AutocompleteTest([], config).errorIfWindows()
    } catch (e) {
      expect(e.message).to.eq('Autocomplete is not currently supported in Windows')
    }
  })

  it('#autocompleteCachePath', async () => {
    expect(cmd.autocompleteCachePath).to.eq(path.join(config.cacheDir, 'autocomplete'))
  })

  it('#completionsCachePath', async () => {
    expect(cmd.completionsCachePath).to.eq(path.join(config.cacheDir, 'autocomplete', 'completions'))
  })

  it('#acLogfile', async () => {
    expect(cmd.acLogfile).to.eq(path.join(config.cacheDir, 'autocomplete.log'))
  })

  it('#findCompletion', async () => {
    expect((cmd as any).findCompletion('app', AutocompleteTest.id)).to.be.ok
    expect((cmd as any).findCompletion('bar', AutocompleteTest.id)).to.not.be.ok
  })

  it('#convertIfAlias', async () => {
    expect((cmd as any).convertIfAlias('key')).to.eq('config')
    expect((cmd as any).convertIfAlias('bar')).to.eq('bar')
  })
})
