import { Hono } from 'hono'
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';


const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
    SECRET_KEY:string
	}
}>();

app.route("/api/v1/users" , userRouter);
app.route("/api/v1/posts" , blogRouter);










export default app
