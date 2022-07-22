import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Estamos obteniendo tu info campeon')
})

router.post('/', (req, res) => {
  res.send('te estas logeando wacho')
})

export const loginRouter = router
