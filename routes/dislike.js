const express = require("express");
const router= express.Router();
const { PrismaClient } = require('@prisma/client');
const isLoggedIn = require("../middleware/verifylogin");
const prisma = new PrismaClient();

router.post("/:blog_id",isLoggedIn,async(req,res)=>{
    const {blog_id} = req.params;
    const userid = req.user.id;

    let isdisliked = await prisma.dislike.findUnique({
        where:{
            blog_id:parseInt(blog_id),
            author_id:userid
        }
    })

    if(isdisliked)
    {
        let deletedislike = await prisma.dislike.delete({
            where:{ 
                id:isdisliked.id
            }
        })

        let decreasedislikecount = await prisma.blog.update({
            where:{
                id:parseInt(blog_id)
            },
            data:{
                dislikecount:{decrement:1}
            }
        })

        res.send("Dislike cancel")
    }else{
        const newdislike = await prisma.dislike.create({
            data:{
                author_id:userid,
                blog_id:parseInt(blog_id)
            }
        })
        let updatedislikecount = await prisma.blog.update({
            where:{
                id:parseInt(blog_id)
            },
            data:{
                dislikecount:{increment:1}
            }
        })
        res.send("dislike added");
    }
})

module.exports=router;