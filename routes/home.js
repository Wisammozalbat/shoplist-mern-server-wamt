import express from 'express'

const router = express.Router();

router.get('/', (req, res) => {
    //request to the db to get all the purchases made by this user
    res.send('te devuelvo las compras que has hecho')
})

export const homeRouter = router