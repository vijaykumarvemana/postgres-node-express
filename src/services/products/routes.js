import { Router } from "express"
import pool from '../../utils/db.js'

const route = Router()

route.get('/', async(req,res,next)=>{

    try {

        const query = `SELECT * FROM products`
        const result = await pool.query(query)
        res.send(result.rows)
        
    } catch (error) {
        res.status(500).send(error)
    }
})


export default route