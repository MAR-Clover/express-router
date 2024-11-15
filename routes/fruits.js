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

router.post("/", 
    [check("color").not().isEmpty().trim().withMessage("Color cannot be empty"),
    check("name").not().isEmpty().trim().withMessage("Color cannot be empty"),
    check("name").isLength({min:5, max:15}).withMessage("Name must be between 5 and 15 characters").trim()]
    ,async (req,res) => {
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
router.put("/:id",
    [check("color").not().isEmpty().trim().withMessage("Color cannot be empty")],
    [check("name").not().isEmpty().trim().withMessage("name cannot be empty")],
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({error:errors.array()})
        }else{
        // no need to assign variable here, not returning anything to res.json
        await Fruit.update(req.body, { where: { id: req.params.id } });

        //MUST DO RES.JSON OR WILL GET ERROR, RES.STATUS BY ITSELF DOESNT WORK!!!
        res.status(200).json({ message: "Fruit updated successfully" });
        }
});

module.exports = router