import {APIClient, flags} from '@heroku-cli/command'
import * as Completions from '@heroku-cli/command/lib/completions'
import {AppCompletion, RemoteCompletion} from '@heroku-cli/command/lib/flags/app'

const ConfigCompletion: flags.ICompletion = {
  cacheDuration: 60 * 60 * 24 * 7,
  cacheKey: async (ctx: any) => {
    return ctx.flags && ctx.flags.app ? `${ctx.flags.app}_config_vars` : ''
  },
  options: async (ctx: any) => {
    const heroku = new APIClient(ctx.config)
    if (ctx.flags && ctx.flags.app) {
      let {body: configs} = await heroku.get(`/apps/${ctx.flags.app}/config-vars`)
      return Object.keys(configs)
    }
    return []
  },
}

const ConfigSetCompletion: flags.ICompletion = {
  cacheDuration: 60 * 60 * 24 * 7,
  cacheKey: async (ctx: any) => {
    return ctx.flags && ctx.flags.app ? `${ctx.flags.app}_config_set_vars` : ''
  },
  options: async (ctx: any) => {
    const heroku = new APIClient(ctx.config)
    if (ctx.flags && ctx.flags.app) {
      let {body: configs} = await heroku.get(`/apps/${ctx.flags.app}/config-vars`)
      return Object.keys(configs).map(k => `${k}=`)
    }
    return []
  },
}

export const CompletionMapping: { [key: string]: flags.ICompletion } = {
  app: AppCompletion,
  addon: Completions.AppAddonCompletion,
  dyno: Completions.AppDynoCompletion,
  buildpack: Completions.BuildpackCompletion,
  config: ConfigCompletion,
  configSet: ConfigSetCompletion,
  // dynosize: Completions.DynoSizeCompletion,
  // file: Completions.FileCompletion,
  pipeline: Completions.PipelineCompletion,
  // processtype: Completions.ProcessTypeCompletion,
  region: Completions.RegionCompletion,
  remote: RemoteCompletion,
  role: Completions.RoleCompletion,
  scope: Completions.ScopeCompletion,
  space: Completions.SpaceCompletion,
  stack: Completions.StackCompletion,
  stage: Completions.StageCompletion,
  team: Completions.TeamCompletion,
}

export const CompletionBlacklist: { [key: string]: string[] } = {
  app: ['apps:create'],
}

export const CompletionAliases: { [key: string]: string } = {
  key: 'config',
}

export const CompletionVariableArgsLookup: { [key: string]: string } = {
  'config:set': 'configSet',
}
