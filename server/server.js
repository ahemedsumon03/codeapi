import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import { Configuration,OpenAIApi } from 'openai'

const app = express()

app.use(cors())
app.use(express.json())
dotenv.config()

console.log(process.env.OPENAI_SECRET_KEY)
const config = new Configuration({
    apiKey: process.env.OPENAI_SECRET_KEY,
}) 


const openai = new OpenAIApi(config)

app.get('/', async (req, res) => { 
    res.send({
        'msg':'Hello man'
    })
})

app.post('/', async (req, res) => { 
    try {
        
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature:0,
            max_tokens:2000,
            top_p:1,
            frequency_penalty:0.5,
            presence_penalty:0,
        })

        res.status(200).send({
            'bot': response.data.choices[0].text
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({ error })
    }
})

app.listen(5000, () => { 
    console.log('server run 5000 port')
})