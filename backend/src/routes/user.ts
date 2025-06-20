import { Hono } from "hono";
import { PrismaClient } from '../../prisma/generated/edge';
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs'
export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string
        SECRET_KEY:string
	}
}>();


userRouter.post('/signup', async(c) => {
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

userRouter.post('/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }

    const isValid = await bcrypt.compare(body.password, user.password);

    if (!isValid) {
      return c.json({ message: 'Invalid password' }, 401);
    }

    const token = await sign({ id: user.id }, c.env.SECRET_KEY);

    return c.json(
      {
        message: `Signin successfully, welcome back! ${body.email}`,
        token,
      },
      200
    );
  } catch (err) {
    console.error(err);
    return c.json({ message: 'Internal server error' }, 500);
  }
});