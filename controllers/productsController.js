import Product from '../models/Product.js'

export const getAllProducts = async (req, res) => {
  try {
    const { _id: id } = req.user
    const products = await Product.find({ creator: id })
    res.status(200).json({
      msg: 'fetched all products',
      data: products,
    })
  } catch (error) {
    res.status(500).json({ msg: 'hubo un error' })
  }
}

export const createProduct = async (req, res) => {
  const { name, price, store } = req.body
  const { _id: id } = req.user

  if (!name || !price || !store) {
    res.status(400).json({ msg: 'there are missing fields' })
  }

  try {
    await Product.create({
      name,
      price,
      store,
      creator: id,
    })

    res.status(201).json({ msg: 'product created' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Could not create product' })
  }
}

export const getProductById = async (req, res) => {
  const productId = req.params.id
  const userId = req.user._id

  try {
    const product = await Product.findById(productId)

    if (userId.valueOf() != product.creator.valueOf()) {
      res.status(403).json({ msg: 'you do not have access to this product' })
    }

    res.status(200).json({
      msg: 'product found',
      data: product,
    })
  } catch (error) {
    res.status(404).json({ msg: 'Could not find product' })
  }
}

export const editProduct = async (req, res) => {
  const { name, price } = req.body
  const productId = req.params.id

  try {
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { name, price },
      { new: true }
    )

    res.status(200).json({ msg: 'product updated', data: product })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'could not update' })
  }
}

export const deleteProduct = async (req, res) => {
  const productId = req.params.id

  try {
    const productDeleted = await Product.findByIdAndDelete({ _id: productId })
    if (!productDeleted) {
      res.status(404).json({ msg: 'product was not found' })
    }

    res.status(200).json({ msg: 'product deleted' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'could not delete' })
  }
}
