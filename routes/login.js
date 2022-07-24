import express from 'express'
import { loginUser } from '../controllers/authController.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Estamos obteniendo tu info campeon')
})

router.post('/', loginUser)

export const loginRouter = router
