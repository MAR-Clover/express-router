const express = require("express");
const router = express.Router();
const User = require("../models/User")
const {check, validationResult} = require("express-validator")

router.get("/", async (req,res) =>{
    const response = await User.findAll()
    res.json(response)
})

router.get("/:id", async (req,res) =>{
    const response = await User.findOne({where:{id:req.params.id}})
    console.log(req.params.id)
    res.json(response)
})

router.post("/", 
    [check("name").trim().not().isEmpty().withMessage("Name should not be empty or just whitespace"),
    check("age").trim().not().isEmpty().withMessage("age should not be empty or just whitespace"),
    check("name").isLength({min:5, max:15}).withMessage("Name must be between 5 and 15 characters").trim()]

,async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({error:errors.array()})
    }else{
        const newUser = await User.create(req.body);
        const response = await User.findAll();
        res.status(200).json(response); 
    }
});

router.put("/:id",
    [check("name").not().isEmpty().trim().withMessage("name cannot be empty")],
    [check("age").not().isEmpty().trim().withMessage("age cannot be empty")]
    , async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({error:errors.array()})
        }else{
        // no need to assign variable here, not returning anything to res.json
        await User.update(req.body, { where: { id: req.params.id } });

        //MUST DO RES.JSON OR WILL GET ERROR, RES.STATUS BY ITSELF DOESNT WORK!!!
        res.status(200).json({ message: "Fruit updated successfully" });
        }
});


router.delete("/:id", async (req,res) => {
    try{
       const deleted = await User.destroy({ where: { id: req.params.id }})

       res.status(200).json({message:"User Deleted"})
    }catch(e){
        res.status(500).json({ message: "Error deleting User", error: e.message });

    }
})



module.exports = router