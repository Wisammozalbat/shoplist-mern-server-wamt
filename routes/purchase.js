import express from 'express'
import {
  createPurchase,
  deletePurchase,
  getPurchaseById,
  getPurchases,
} from '../controllers/purchaseController.js'
import { auth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/:id', auth, getPurchaseById)

router.delete('/:id', auth, deletePurchase)

router.get('/', auth, getPurchases)

router.post('/', auth, createPurchase)

export const purchaseRouter = router
