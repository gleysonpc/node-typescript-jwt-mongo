import { Schema, model, Document, HookNextFunction } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export interface UserInterface extends Document {
    name: string,
    email: string,
    password: string,
    generateToken(): string
    checkPassword(password: string): Promise<boolean>
    clean(): object
}

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    }
}, { timestamps: true });

//Encrinpting Password
userSchema.pre<UserInterface>('save', async function (next: HookNextFunction) {
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(this.password, salt)
    this.password = hashedPass
    next()

})

//Check Password Method
userSchema.methods.checkPassword = async function
    (this: UserInterface, password: string): Promise<boolean> {

    const validPass = await bcrypt.compare(password, this.password)
    if (validPass) return true

    return false
}
//Generating Token
userSchema.methods.generateToken = function (this: UserInterface) {
    const { password, ...user } = this.toObject()

    const token = 'Bearer ' + jwt.sign(user, process.env.TOKEN_SECRET as string)
    return token

}

//Cleaning password
userSchema.methods.clean = function (this: UserInterface): object {
    const obj = this.toObject()
    const sensitive = ['password'] //objects to protect
    sensitive.forEach(item => {
        delete obj[item]
    })
    return obj
}




export default model<UserInterface>('User', userSchema)