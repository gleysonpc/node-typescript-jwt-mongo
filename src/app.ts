import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import 'dotenv/config'
import routes from './routes'

class App {
    public express: express.Application

    public constructor() {
        this.express = express()
        this.middlewares()
        this.database()
        this.routes()
    }

    private middlewares(): void {
        this.express.use(express.json())
        this.express.use(cors())
    }

    private database(): void {
        try {
            let uri = process.env.DB as string
            mongoose.connect(uri,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })
        } catch (error) {
            console.log(error)
        }
    }

    private routes() {
        this.express.use(routes)
    }
}

export default new App().express