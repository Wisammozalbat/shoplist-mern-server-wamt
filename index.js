import express from 'express'
import cors from 'cors'
import connectDB from './database.js'
import dotenv from 'dotenv'
import {
  loginRouter,
  productsRouter,
  purchaseRouter,
  registerRouter,
} from './routes/index.js'
dotenv.config()

const app = express()

//connect to DB
connectDB()

//settings
app.use(cors())
app.use(express.json())

//middleware

//routes
app.use('/products', productsRouter)
app.use('/purchase', purchaseRouter)
app.use('/login', loginRouter)
app.use('/register', registerRouter)
//stating the server
const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
