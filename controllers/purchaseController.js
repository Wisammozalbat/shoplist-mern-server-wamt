import Product from '../models/Product.js'
import ProductPurchase from '../models/ProductPurchase.js'
import Purchase from '../models/Purchase.js'

export const getPurchases = async (req, res) => {
  const userId = req.user._id

  try {
    const purchases = await Purchase.find({ creator: userId })

    const purchasesMapped = await Promise.all(
      purchases.map(async (purchase) => {
        return {
          creator: purchase.creator,
          date: purchase.date,
          _id: purchase._id,
          products: await ProductPurchase.find({ purchase: purchase._id }),
        }
      })
    )

    const purchasesMapperWithProducts = await Promise.all(
      purchasesMapped.map(async (purchase) => {
        return {
          creator: purchase.creator,
          date: purchase.date,
          _id: purchase._id,
          products: await Promise.all(
            purchase.products.map(async (productPurchase) => {
              const product = await Product.findById(productPurchase.productId)
              return {
                _id: product._id,
                name: product.name,
                price: product.price,
                store: product.store,
                creator: product.creator,
                quantity: productPurchase.quantity,
              }
            })
          ),
        }
      })
    )

    res
      .status(200)
      .json({ msg: 'puchases found', data: purchasesMapperWithProducts })
  } catch (error) {
    res.status(500).json({ msg: 'error' })
  }
}

export const getPurchaseById = async (req, res) => {
  const purchaseId = req.params.id

  try {
    const purchase = await Purchase.findById(purchaseId)

    const productsPurchased = await ProductPurchase.find({
      purchase: purchaseId,
    })

    let productsData

    if (productsPurchased.length > 0) {
      productsData = await Promise.all(
        productsPurchased.map(async (product) => {
          const productData = await Product.findById(product.productId)
          return {
            ...productData.toObject(),
            quantity: product.quantity,
          }
        })
      )
    }

    const purchaseWithProducts = {
      ...purchase.toObject(),
      products: productsData,
    }

    res
      .status(200)
      .json({ msg: 'Purchase fetched', data: purchaseWithProducts })
  } catch (error) {
    res.status(500).json({ msg: 'Could not get the purchase' })
  }
}

export const createPurchase = async (req, res) => {
  const userId = req.user._id
  const { products } = req.body
  try {
    const purchase = await Purchase.create({
      creator: userId,
    })

    await ProductPurchase.create(
      products.map((product) => {
        return { ...product, purchase: purchase._id }
      })
    )

    res.status(200).json({ msg: 'Purchase created' })
  } catch (error) {
    res.status(500).json({ msg: 'Could not create purchase' })
  }
}

export const deletePurchase = async (req, res) => {
  const purchaseId = req.params.id

  try {
    const purchaseDeleted = await Purchase.findByIdAndDelete({
      _id: purchaseId,
    })

    if (!purchaseDeleted) {
      res.status(404).json({ msg: 'purchase was not found' })
    }

    await ProductPurchase.deleteMany({ purchase: purchaseId })

    res.status(200).json({ msg: 'purchase deleted' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'could not delete' })
  }
}
