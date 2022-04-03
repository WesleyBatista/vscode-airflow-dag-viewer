import type { ExtensionContext } from 'vscode'

export interface Context {
  extensionId: string
  ext: ExtensionContext
}

export const ctx = {
  extensionId: 'airflow-dag-viewer',
} as Context
