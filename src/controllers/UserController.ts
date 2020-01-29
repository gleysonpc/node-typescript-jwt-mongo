import { Request, Response } from 'express'
import User from '../models/User'

class UserController {

    public async index(req: Request, res: Response): Promise<Response> {
        const users = await User.find()
        return res.json(users)
    }

    public async store(req: Request, res: Response): Promise<Response> {
        const { name, email, password } = req.body
        try {
            const user = await User.create({
                name,
                email,
                password
            })

            return res.json(user)
        } catch (error) {
            return res.status(500).json(error)
        }


    }
}


export default new UserController()