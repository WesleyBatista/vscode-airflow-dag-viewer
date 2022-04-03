import type { ExtensionContext } from 'vscode'
import { commands } from 'vscode'
import { ctx } from './Context'
import { showDags } from './showDags'

export function activate(context: ExtensionContext) {
  ctx.ext = context
//   console.log(`${ctx.extensionId} is now active!`)
  const showDagsDisposable = commands.registerCommand(`${ctx.extensionId}.showDags`, showDags)
  context.subscriptions.push(showDagsDisposable)
}

export function deactivate() {}
