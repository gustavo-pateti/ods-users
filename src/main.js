import 'regenerator-runtime/runtime'
import 'core-js/stable'
import express from 'express'
import cors from 'cors'
import { firebase } from './services'
import { authRoutes } from './routes'

firebase.init()

console.log('Setup express app [START]')
const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const baseRoute = '/v1'

app.use(`${baseRoute}/auth/`, authRoutes)

console.log('Setup express app [DONE]\n')

console.log('Init express server [START]')
app.listen(process.env.PORT, () => {
  console.log('Init express server [DONE]\n')
  console.log(
    `** Open Data Stage Users API running on port: ${process.env.PORT} **\n`
  )
})
