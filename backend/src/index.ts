import { Hono } from 'hono'
import { PrismaClient } from './generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode , jwt, sign , verify } from 'hono/jwt';
import bcrypt from 'bcryptjs'


const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
    SECRET_KEY:string
	}
}>();

app.use('/api/v1/blog/*' , async (c,next)=>{
  const token = c.req.header('Authorization') || "";
  const value = token.split(" ")[1]
  if(!value){return c.res.json({message:"Token is missing"},401)}
  const response = await verify(value, c.env.SECRET_KEY)

  if(response.id){
      next();
  }
  else{
    return c.res.json({message:"Unauthorized"},403)
  }
})


app.post('/api/v1/signup', async(c) => {
 const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());

 const body = await c.req.json();

 const hashedPassword = await bcrypt.hash(body.password , 10)
 const user = await prisma.user.create({
  data: {
    email: body.email,
    password: hashedPassword,
  },
 })
  
  const token = await sign({id:user.id} , c.env.SECRET_KEY);
  

 return c.json({ message: 'User created successfully' , token });
})

app.post('/api/v1/signin', async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body =await c.req.json();
  const user = await prisma.user.findUnique({
    where: {
     email: body.email
    }
  })
  if(!user){
    return c.json({ message: 'User not found' });
  }
  const isValid = await bcrypt.compare(body.password, user.password);

 if(!isValid){
  return c.json({ message: 'Invalid password' },401);
}
  const token = await sign({id:user.id} , c.env.SECRET_KEY);

 return c.json({
  message: `signin successfully, welcome back! ${body.email}`,
  token
}, 200);
})

app.post('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text('Hello Hono!')
})

export default app
