import * as AWS from 'aws-sdk'
import 'source-map-support/register'
import { TodoItem } from '../models/TodoItem'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

// import * as AWSXRay from 'aws-xray-sdk' : errored out on Property 'DocumentClient' does not exist on type 'PatchedAWSClientConstructor<ClientConfiguration, typeof DynamoDB>'.
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

// const todosTable = process.env.TODOS_TABLE
// const docClient = new XAWS.DynamoDB.DocumentClient()

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE
  ) {}

  async getAllTodos(): Promise<TodoItem[]> {
    console.log('Getting all todo items')

    const result = await this.docClient
      .scan({
        TableName: this.todosTable,
      })
      .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodoItem(todo: TodoItem): Promise<TodoItem> {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todo,
      })
      .promise()

    return todo
  }
}
function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
