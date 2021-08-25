import { auth } from '../services/auth.service'

const signup = async (req, res) => {
  try {
    console.log('Auth controller - signup [START]')

    const { signupData } = req.body

    if (!signupData) {
      throw new Error('** Invalid signup data **')
    }

    await auth.signup(signupData)

    console.log('Auth controller - signup [END]')
    res.sendStatus(200)
  } catch (err) {
    console.log('Auth controller - signup [ERROR]')
    console.log(err)
    res.sendStatus(500)
  }
}

const update = async (req, res) => {
  try {
    console.log('Auth controller - update [START]')

    console.log(req.body)

    const { token, userId, userData } = req.body

    if (!token) {
      throw new Error('** Invalid token **')
    }

    if (!userData) {
      throw new Error('** Invalid update data **')
    }

    const results = await auth.update(token, userId, userData)

    console.log('Auth controller - update [END]')
    if (results) {
      res.sendStatus(200)
    } else {
      res.sendStatus(500)
    }
  } catch (err) {
    console.log('Auth controller - update [ERROR]')
    console.log(err)
  }
}

const add = async (req, res) => {
  try {
    console.log('Auth controller - add [START]')

    console.log(req.body)

    const { token, userData } = req.body

    if (!token) {
      throw new Error('** Invalid token **')
    }

    if (!userData) {
      throw new Error('** Invalid add data **')
    }

    const results = await auth.add(token, userData)

    console.log('Auth controller - add [END]')
    if (results) {
      res.sendStatus(200)
    } else {
      res.sendStatus(500)
    }
  } catch (err) {
    console.log('Auth controller - add [ERROR]')
    console.log(err)
  }
}

const remove = async (req, res) => {
  try {
    console.log('Auth controller - remove [START]')

    console.log(req.body)

    const { token, userId } = req.body

    if (!token) {
      throw new Error('** Invalid token **')
    }

    const results = await auth.remove(token, userId)

    console.log('Auth controller - remove [END]')
    if (results) {
      res.sendStatus(200)
    } else {
      res.sendStatus(500)
    }
  } catch (err) {
    console.log('Auth controller - remove [ERROR]')
    console.log(err)
  }
}

export const authController = {
  signup,
  update,
  add,
  remove,
}
