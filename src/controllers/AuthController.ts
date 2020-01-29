import { Request, Response } from 'express'
import User from '../models/User'
import * as yup from 'yup'

class AuthController {

    public async register(req: Request, res: Response): Promise<Response> {
        const { name, email, password } = req.body
        //Validation Schema
        const validationSchema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
            password: yup.string().required().min(6)
        })
        //Validating
        try {
            await validationSchema.validate(req.body)
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
        //Creating User
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

    public async login(req: Request, res: Response): Promise<Response> {
        //Checking Email
        const user = await User.findOne({ email: req.body.email }, '+password')
        if (!user) 
            return res.status(400).json({ message: 'User not found!' })
        //Checking Password
        const validPass = await user.checkPassword(req.body.password)
        if (!validPass)
            return res.status(400).json({ message: 'Invalid Password!' })
        //Getting Token
        const token = user.generateToken()
        const response = user.toObject()
        response.password = undefined
        response.token = token
        return res.json(response)
    }

}


export default new AuthController()