import express from 'express'
import { auth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', auth, (req, res) => {
  //request to the db to get all the purchases made by this user
  console.log('req user', req.user)
  res.send('te devuelvo las compras que has hecho')
})

export const homeRouter = router
