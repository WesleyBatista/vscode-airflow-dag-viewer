import { exec } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'
import { ViewColumn, window } from 'vscode'
import { config } from './config'

function tmplFn(dagId: string, data: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${dagId} - DAG Preview</title>
</head>
<body>
    ${data}
<style>
  html, body {
    margin: 0; 
    padding: 0; 
    overflow: hidden
  }
  svg {
    position: fixed;
    top:0;
    left:0;
    height:100%;
    width:100%;
  }
</style>
</body>
</html>`
}

export async function getWebviewContentSvg(dagId: string, filePath: string): Promise<string> {
  return new Promise<string>((resolve, _reject) => {
    fs.stat(filePath, (err, _stats) => {
      if (err)
        throw err
      fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
        if (err)
          throw err
        resolve(tmplFn(dagId, data))
      })
    })
  })
}

export async function dagPreview(dagId: string) {
  if (!config.root) {
    window.showErrorMessage('Airflow DAG Viewer currently requires opening a workspace to write temporary files')
    return
  }

  const airflowBinary = config.airflowBinary
  const subdirOpt = config.dagsFolder ? `--subdir ${config.dagsFolder}` : ''
  const subfolder = config.temporaryRelativePath
  const filepath = path.join(config.root, subfolder, `dag_preview_${dagId}.svg`)

  exec(`${airflowBinary} dags show --save ${filepath} ${subdirOpt} ${dagId}`, async(error, stdout, stderr) => {
    if (error)
      throw error
    if (stderr)
      throw stderr
    getWebviewContentSvg(dagId, filepath).then((value: string) => {
      const panel = window.createWebviewPanel('dagPreview', dagId, ViewColumn.Two, {})
      panel.webview.html = value
    })
  })
}
