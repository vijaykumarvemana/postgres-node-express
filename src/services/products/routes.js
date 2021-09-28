import { Router } from "express"
import pool from '../../utils/db.js'

const productsRoute = Router()

productsRoute.get('/', async(req,res,next)=>{

    try {

        const query = `SELECT * FROM products`
        const result = await pool.query(query)
        res.send(result.rows)
        
    } catch (error) {
        res.status(500).send(error)
    }
})
productsRoute.get("/:id",async(req,res,next)=>{
    try {
        const query = `SELECT * FROM products WHERE products_id=${req.params.id};`
      
        const result = await pool.query(query)
        if(result.rows.length > 0){
            const product = result.rows[0]
            const reviewsQuery = `SELECT * FROM products WHERE review=${req.params.id};`
            const reviewResult = await pool.query(reviewsQuery)
            const reviews = reviewResult.rows
            res.send({product,reviews})
        }
        else{
            res.status(404).send({message:`product with ${req.params.id} is not found.`})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

productsRoute.post("/",async(req,res,next)=>{
    try {
        const {name,description,brand,image_Url,price,category} = req.body;
        const query =`
        INSERT INTO products
        (
            name,
            description,
            brand,
            image_Url,
            price,
            category
        )
        VALUES 
        (
            ${"'"+name+"'"},
            ${"'"+description+"'"},
            ${"'"+brand+"'"},
            ${"'"+image_Url+"'"},
            ${"'"+price+"'"},
            ${"'"+category+"'"}
            
        ) RETURNING *;
        `
        const result = await pool.query(query)
        res.status(201).send(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})




productsRoute.delete("/:id",async(req,res,next)=>{
    try {
        const query = `DELETE FROM products WHERE product_id=${req.params.id};`
        await pool.query(query)
        res.status(204).send()
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

productsRoute.put("/:id",async(req,res,next)=>{
    try {
        const {name,description,brand,image_Url,price,category} = req.body;
        const query =`
            UPDATE products 
            SET 
                name=${"'"+name+"'"},
                description=${"'"+description+"'"},
                brand=${"'"+brand+"'"},
                image_Url=${"'"+image_Url+"'"},
                price=${"'"+price+"'"}
                category=${"'"+category+"'"}
                updated_at= NOW()
            WHERE product_id=${req.params.id}
            RETURNING*;`
        const result = await pool.query(query)
        res.send(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})



export default productsRoute