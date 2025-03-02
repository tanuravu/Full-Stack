
const express = require("express");
const router= express.Router();
const { PrismaClient } = require('@prisma/client');
const isLoggedIn = require("../middleware/verifylogin");
const prisma = new PrismaClient();


router.post("/:blog_id",isLoggedIn,async (req,res)=>{
    const {blog_id} = req.params;
    const userid = req.user.id;

    let isliked = await prisma.like.findUnique({
        where :{
            blog_id:parseInt(blog_id),
            author_id: userid
        }
        
    })
    console.log(isliked)

    if(isliked)
    {
        let deletelike = await prisma.like.delete({
            where:{
                id:isliked.id
            }
        })

        let decreaselikecount = await prisma.blog.update({
            where:{
                id:parseInt(blog_id)
            },
            data:{
                likecount:{decrement:1}
            }
        })

        res.send("unliked")
    }else{
    const newLike = await prisma.like.create({
        data:{
            author_id:userid,
            blog_id:parseInt(blog_id)
        }
    })
    let updatelikecount = await prisma.blog.update({
        where:{
            id:parseInt(blog_id)
        },
        data:{
            likecount:{increment:1}
        }
    })
    res.send("like added");
}
    
})

module.exports=router;
