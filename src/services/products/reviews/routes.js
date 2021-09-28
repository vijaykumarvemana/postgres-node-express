import {Router} from "express"
import pool from '../../../utils/db.js'
const reviewsRoute = Router()


reviewsRoute.get("/",async(req,res,next)=>{
    try {
        const query = 
        `SELECT 
        review.review_id,
        review.comment,
        review.rate,
        review.product_id,
        prodcut.name ,
        product.descriptiion,
        product.brand,
        product.image_url,
        product.price,
        product.category
    FROM reviews as review
    INNER JOIN products AS product ON review.product_id = product.product_id
    `
        const result = await pool.query(query)
        res.send(result.rows)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

reviewsRoute.get("/:id",async(req,res,next)=>{
    try {
        const query = `SELECT 
        review.review_id,
        review.comment,
        review.rate,
        review.product_id,
        prodcut.name ,
        product.descriptiion,
        product.brand,
        product.image_url,
        product.price,
        product.category
    FROM reviews as review
    INNER JOIN products AS product ON review.product_id = product.product_id
    WHERE review_id=${req.params.id};`
        const result = await pool.query(query)
        if(result.rows.length > 0){
            res.send(result.rows[0])
        }
        else{
            res.status(404).send({message:`review with ${req.params.id} is not found.`})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

reviewsRoute.delete("/:id",async(req,res,next)=>{
    try {
        const query = `DELETE FROM reviews WHERE review_id=${req.params.id};`
        await pool.query(query)
        res.status(204).send()
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

reviewsRoute.put("/:id",async(req,res,next)=>{
    try {
        const {comment,rate ,product_id} = req.body;
        const query =`
            UPDATE reviews 
            SET 
                comment=${"'"+comment+"'"},
                rate=${"'"+rate+"'"},
                product_id=${"'"+product_id+"'"},
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

reviewsRoute.post("/",async(req,res,next)=>{
    try {
        const {comment,rate,product_id} = req.body;
        const query =`
        INSERT INTO reviews
        (
            comment,
            rate,
            product_id
        )
        VALUES 
        (
            ${"'"+comment+"'"},
            ${"'"+rate+"'"},
            ${"'"+product_id+"'"},
        ) RETURNING *;
        `
        const result = await pool.query(query)
        res.status(201).send(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})


export default reviewsRoute;