import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: 36000 })
}

export const registerUser = asyncHandler(async (req, res) => {
  const { name, lastname, email, password } = req.body

  // validate user sent all required data
  if (!name || !lastname || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // check if user exists
  const user = await User.findOne({ email })

  if (user) {
    res.status(400)
    throw new Error('User already exists')
  }

  // hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const userCreated = await User.create({
    name,
    lastname,
    email,
    password: hashedPassword,
  })

  if (userCreated) {
    res.status(201).json({
      _id: userCreated._id,
      name: userCreated.name,
      lastname: userCreated.lastname,
      email: userCreated.email,
      token: generateToken(userCreated._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // verfiy if ther is an user with this email
  const user = await User.findOne({ email })

  if (!user) {
    res.status(400)
    throw new Error('No user with this email')
  }

  // return true if match, false if not
  const passwordMatch = await bcrypt.compare(password, user.password)

  if (passwordMatch) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400).json({ msg: 'error' })
  }
})

export const deleteUser = async (req, res) => {
  const userId = req.params.id

  try {
    const userDeleted = await User.findOneAndDelete({ _id: userId })
    res.status(201).json({ msg: 'user deleted', userDeleted })
  } catch (error) {
    res.status(400).json({ msg: 'error deleting user' })
  }
}
