import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import route from './services/products/routes.js'
import createTables from './utils/create-tables.js'

const server = express()

const {PGPORT=5000} = process.env

server.use(cors())

server.use(express.json())
server.use('/products', route)

server.listen(PGPORT, async() => {

console.log(`server is listening on port ${PGPORT}`)
await createTables()
})


server.on('error', (error) => {
    console.log('Server is stooped', error)
})