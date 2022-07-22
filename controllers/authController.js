import jws from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

export const registerUser = asyncHandler(async (req, res) => {
  const { name, lastname, email, password } = req.body

  // validate user sent all required data
  if (!name || !lastname || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
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
  console.log(userCreated)

  if (userCreated) {
    res.status(201).json({
      _id: userCreated.id,
      name: userCreated.name,
      lastname: userCreated.lastname,
      email: userCreated.email,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})
