import { Router } from 'express'
import { authController } from '../controllers'

const router = Router()

router.post('/update', async (req, res) => {
  await authController.update(req, res)
})

router.post('/add', async (req, res) => {
  await authController.add(req, res)
})

router.post('/signup', async (req, res) => {
  await authController.signup(req, res)
})

router.post('/remove', async (req, res) => {
  await authController.remove(req, res)
})

export const authRoutes = router
