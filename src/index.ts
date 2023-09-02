import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import { cartRoutes, categoryRoutes, colorRoutes, productBaseRoutes, productVariantRoutes, screenSizeRoutes, storageRoutes, userRoutes } from './handlers'


dotenv.config()

const app = express()
let port:number | string

if (process.env.MODE === 'test') {
  port = process.env.PORT_TEST || 5001
} else {
  port = process.env.PORT || 5000
}

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(express.json())


app.get('/', (req : express.Request, res : express.Response) => {
  res.send('hello world')
})

cartRoutes(app)
categoryRoutes(app)
colorRoutes(app)
productVariantRoutes(app)
productBaseRoutes(app)
screenSizeRoutes(app)
storageRoutes(app)
userRoutes(app)

app.listen(port, () => {
  console.log(`Server listening on port localhost:${port}`)
})

export default app
