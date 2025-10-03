import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Job, Org, Project, Run } from './schemas'

type DB = {
  orgs: Org[]
  projects: Project[]
  jobs: Job[]
  runs: Run[]
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dataDir = join(__dirname, '..', '.data')
const dbFile = join(dataDir, 'db.json')

async function ensure() {
  await mkdir(dataDir, { recursive: true })
}

export async function load(): Promise<DB> {
  await ensure()
  try {
    const raw = await readFile(dbFile, 'utf8')
    return JSON.parse(raw) as DB
  } catch (e) {
    return { orgs: [], projects: [], jobs: [], runs: [] }
  }
}

export async function save(db: DB): Promise<void> {
  await ensure()
  await writeFile(dbFile, JSON.stringify(db, null, 2), 'utf8')
}
