const  express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { TokenExpiredError } = require("jsonwebtoken");
const { sendmail } = require("../utils/sendmail");
const Prisma = new PrismaClient()

router.get("/:email",async(req,res)=>{
    const {email} = req.params;
    const user = await Prisma.user.findUnique({
        where:{
            email:email,
        },
    })
    res.json({user});
})
router.post("/",async(req,res)=>{
    const {email,name,password} = req.body;
    let newUser = await Prisma.user.create({
        data:{
            email:email,
            name:name,
            password:password
        }
    });
    let token = Math.floor(Math.random()*10000);

    let newtoken = await Prisma.token.create({
        data:{
            token:token,
            userid:newUser.id
        }
    })

    let link = `http://localhost:4245/verify/${token}/${newUser.id}`
     await sendmail(email,"verify email",link)
    res.json({newUser})
})

router.delete("/:email",async(req,res)=>{
    const {email} = req.params
    const deleteuser = await Prisma.user.delete({
        where : {
            email: email,
        },
    })
    res.send("user deleted")
})

router.put("/",async(req,res)=>{
    const updateUser = await Prisma.user.update({
        where: {
          email: 'sumit@gmail.com',
        },
        data: {
          name: 'Sumit Thakur',
        },
      })
      res.send("user updated")
})


module.exports=router;