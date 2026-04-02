import express from 'express'
import type { Express } from 'express'

export function createExpressApplication ():Express{
    const app = express()

    app.get('/',(req,res)=>{
        return res.json({message: 'Welcome to Auth Service'})
    })

    return app
}