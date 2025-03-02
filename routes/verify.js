const express = require("express");
const router= express.Router();
const { PrismaClient } = require('@prisma/client');
const isLoggedIn = require("../middleware/verifylogin");
const { use } = require("react");
const prisma = new PrismaClient();

router.get("/:token/:userid",async (req,res)=>{
    let {token,userid} = req.params;
    let istoken = await prisma.token.findFirst({
        where:{
            token : parseInt(token),
            userid:parseInt(userid)
        }
    })

    if(!istoken)
        return res.send("Invalid link");
    else{
        let updateuseremail = await prisma.user.update({
            where :{
                id :parseInt(userid)
            },
            data:{
                isverify:true
            }
        })
        res.send("email verified please login to continue");
    }
})

module.exports = router;