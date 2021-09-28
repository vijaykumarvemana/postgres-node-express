import pg from 'pg'

const {DATABASE_URL: connectionString} = process.env

const pool = new pg.Pool({

    connectionString,
})

export default pool