import { Hono } from "hono";
import { PrismaClient } from '../generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from "hono/jwt";
import { createBlogInput , updateBlogInput } from "@jyoti_ranj/common";
export const blogRouter = new Hono<{
  Bindings:{
    DATABASE_URL:string,
    JWT_SECRET:string
  },
  Variables:{
    userId:string
  }
}>()


blogRouter.use("/*",async(c , next)=>{
    const authHeader = c.req.header("authorization") || "";
    try{
        const user = await verify(authHeader, c.env.JWT_SECRET);
    if (user) {
      c.set("userId", String(user.id));
      await next();
    }else{
        return c.json({
            message: "You are not authorized"
        },403)
    }
    
    }catch(error){
        return c.json({
            message: "You are not authorized"
        },403)
    }
    
})

blogRouter.post('/', async(c) => {
const body = await c.req.json();
const authorId = c.get("userId");
const {success} = createBlogInput.safeParse(body);
  if(!success){
    return c.json({message: 'Invalid request body'},400)
  }
const prisma = new PrismaClient({
datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

const blog = await prisma.blog.create({
    data: {
        title: body.title,
        content: body.content,
        authorId:Number(authorId)
    }
})

  return c.json({
    message: "Post created successfully" , id:blog.id
  })

})




blogRouter.put('/', async(c) => {
const body = await c.req.json();
const {success} = updateBlogInput.safeParse(body);
  if(!success){
    return c.json({message: 'Invalid request body'},400)
  }
const prisma = new PrismaClient({
datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

const blog = await prisma.blog.update({
    where: {
        id: body.id
    },
    data: {
        title: body.title,
        content: body.content,
    }
})

  return c.json({
    message: "Post updated successfully" , id:blog.id
  })
})


//Todo: Add pagination
blogRouter.get('/bulk', async(c) => {
const prisma = new PrismaClient({
datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())


const blog = await prisma.blog.findMany();

  return c.json({
    message: "Below are the posts" , blog
  },200)
})


blogRouter.get('/:id', async(c) => {
 const id = await c.req.param("id");
const prisma = new PrismaClient({
datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

try{const blog = await prisma.blog.findFirst({
   where: {
    id:Number(id)
   },
})

  return c.json({
    message: "Below are the posts" , blog
  })
}catch(error){
    return c.json({
        message: "No posts found"
    },411)
}


})


