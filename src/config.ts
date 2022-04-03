import { workspace } from 'vscode'
import { ctx } from './Context'

export function getConfig<T>(key: string, v?: T) {
  return workspace.getConfiguration().get(`${ctx.extensionId}.${key}`, v)
}

export const config = {
  get root() {
    return workspace.workspaceFolders?.[0]?.uri?.fsPath || ''
  },

  get airflowBinary() {
    return getConfig('airflowBinary', 'airflow')!
  },
  get dagsFolder() {
    const defaultValue = ctx.ext.environmentVariableCollection.get('AIRFLOW__CORE__DAGS_FOLDER') ?? ''
    return getConfig('dagsFolder', defaultValue)!
  },

  get temporaryRelativePath() {
    return getConfig<string>('temporaryRelativePath', '.airflow-dag-viewer')!
  },

}
