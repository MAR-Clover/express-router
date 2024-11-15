const express = require("express");
const router = express.Router();
const Fruit = require("../models/Fruit")
const {check, validationResult} = require("express-validator")


router.get("/", async (req,res) => {
    const fruits = await Fruit.findAll()
    res.json({fruits})
})

router.get("/:id", async (req,res) => {
    const fruit = Fruit.findOne({where:{id:req.params.id}})
    res.json(fruit)
})

router.post("/", [check("color").not().isEmpty().trim().withMessage("Color cannot be empty")],async (req,res) => {
    const errors = validationResult(req)
    
    if(!errors.isEmpty()){
        res.status(400).json({error:errors.array()})
    }else{
        const content = req.body
        await Fruit.create(content)
        const fruitsWithNewFruit = await Fruit.findAll()
    
        res.json(fruitsWithNewFruit)
    }

})

module.exports = router