import express from 'express'
import {
  createProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
  getProductById,
} from '../controllers/productsController.js'
import { auth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/:id', auth, getProductById)

router.put('/:id', auth, editProduct)

router.delete('/:id', auth, deleteProduct)

router.get('/', auth, getAllProducts)

router.post('/', auth, createProduct)

export const productsRouter = router
