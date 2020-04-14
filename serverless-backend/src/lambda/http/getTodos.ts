import 'source-map-support'
import { getAllTodos } from '../../businessLogic/todos'

import * as express from 'express'
import * as awsServerlessExpress from 'aws-serverless-express'

const app = express()

app.get('/todos', async (_req, res) => {
  const todos = await getAllTodos()

  res.json({
    items: todos,
  })
})

const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context)
}
