import { Pool, type PoolConfig, type QueryResultRow } from 'pg'

const globalForDb = globalThis as typeof globalThis & {
  __pgPool?: Pool
}

const isSupabaseConnection = (connectionString: string) => {
  return connectionString.includes('.supabase.co')
}

const shouldEnableSsl = (dbSsl: string, connectionString: string) => {
  if (dbSsl === 'on') {
    return true
  }

  if (dbSsl === 'off') {
    return false
  }

  return process.env.NODE_ENV === 'production' || isSupabaseConnection(connectionString)
}

const resolveConnectionString = () => {
  const config = useRuntimeConfig()
  const connectionString = config.supabaseDbUrl || config.databaseUrl

  if (!connectionString) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing database connection string. Set DATABASE_URL or SUPABASE_DB_URL.'
    })
  }

  return {
    connectionString,
    dbSsl: config.dbSsl || 'auto'
  }
}

export const getDbPool = () => {
  if (globalForDb.__pgPool) {
    return globalForDb.__pgPool
  }

  const { connectionString, dbSsl } = resolveConnectionString()
  const sslEnabled = shouldEnableSsl(dbSsl, connectionString)

  const options: PoolConfig = {
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000
  }

  if (sslEnabled) {
    options.ssl = {
      rejectUnauthorized: false
    }
  }

  globalForDb.__pgPool = new Pool(options)
  return globalForDb.__pgPool
}

export const sqlQuery = async <T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) => {
  const pool = getDbPool()
  return pool.query<T>(text, params)
}
