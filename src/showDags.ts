import { exec } from 'child_process'
import type { QuickPickItem } from 'vscode'
import { window } from 'vscode'
import { dagPreview } from './dagPreview'
import { config } from './config'

interface CommandPickItem extends QuickPickItem {
  handler?: () => void
}

interface AirflowDagsListResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dag_id: string
  owner: string
  paused: string
  filepath: string
}

export async function showDags() {
  const airflowBinary = config.airflowBinary
  const subdirOpt = config.dagsFolder ? `--subdir ${config.dagsFolder}` : ''

  exec(`${airflowBinary} dags list ${subdirOpt} -o json`, async(error, stdout, stderr) => {
    if (error)
      throw error
    if (stderr)
      throw stderr
    const json = JSON.parse(stdout) as AirflowDagsListResponse[]
    const dags = Array.from(json).map(x => x.dag_id)
    const commands: CommandPickItem[] = dags.map((x: string) => {
      return {
        label: `$(split-horizontal) ${x}`,
        handler() { dagPreview(x) },
      } as CommandPickItem
    })
    const result = await window.showQuickPick<CommandPickItem>(commands)

    if (result)
      result.handler?.()
  })
}
