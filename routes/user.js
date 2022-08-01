import express from 'express'
import { deleteUser } from '../controllers/authController.js'

const router = express.Router()

router.post('/:id', deleteUser)

export const userRouter = router
