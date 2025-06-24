import { Hono } from "hono";
import { PrismaClient } from '../generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { jwt, sign } from 'hono/jwt'
import bcrypt from 'bcryptjs'
export const userRouter = new Hono<{
  Bindings:{
    DATABASE_URL:string,
    JWT_SECRET:string
  }
}>()

//signup
userRouter.post('/signup', async(c) => {
  const body = await c.req.json()
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

const hashedPassword = await bcrypt.hash(body.password , 10)
const user = prisma.user.create({
  data: {
    name:body.name,
    userName:body.username,
    password:hashedPassword
  }
})
const token = await sign({ id: (await user).id }, c.env.JWT_SECRET);

  return c.json({
    message: 'User created successfully', token
  })
})

//signin
userRouter.post('/api/v1/user/signin', async(c) => {
  const body = await c.req.json()
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

try{
const user = await prisma.user.findUnique({
    where: { userName: body.username },
  });

  if (!user) {
    return c.json({ error: 'Invalid username or password' }, 401);
  }

  const isPasswordValid = await bcrypt.compare(body.password, user.password);

  if (!isPasswordValid) {
    return c.json({ error: 'Invalid username or password' }, 401);
  }
  const token = await sign({ id: (await user).id }, c.env.JWT_SECRET);

  return c.json({
    message: 'User logged in successfully', token
  })
}catch(error){
    return c.json({
        message: "No user found"
    },411)
}
 
})