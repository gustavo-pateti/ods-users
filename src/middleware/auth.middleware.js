import { auth } from '../services'

export const authenticate = async (req, res, next) => {
  try {
    console.log('Authenticate request [START]')

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('** Invalid authorization header **')
    }

    const token = authHeader.substring(7, authHeader.length)

    const uid = await auth.verifyToken(token)

    req.user = {
      id: uid,
    }

    console.log('Authenticate request [DONE]')

    next()
  } catch (err) {
    console.log('Authenticate request [ERROR]')
    res.sendStatus(500)
  }
}
