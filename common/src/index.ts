import z from "zod"

export const SignupInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    name : z.string().optional()
})

export const SigninInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
 
})

export const createBlogInput = z.object({
 title: z.string(),
 content: z.string()
})


export const updateBlogInput = z.object({
 title: z.string(),
 content: z.string(),
 id:z.number()
})


//type inference in zod
export type SignupInput = z.infer<typeof SignupInput>
//type inference in zod
export type SigninInput = z.infer<typeof SigninInput>
export type createBlogInput = z.infer<typeof createBlogInput>
export type updateBlogInput = z.infer<typeof updateBlogInput>