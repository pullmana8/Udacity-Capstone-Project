import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import * as uuid from 'uuid'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
// import * as AWSXRay from 'aws-xray-sdk' : errored out on Property 'DocumentClient' does not exist on type 'PatchedAWSClientConstructor<ClientConfiguration, typeof DynamoDB>'.

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    const todoId = uuid.v4()
    const newItem = await createTodo(jwtToken, event, todoId)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        item: {
          ...newItem,
        },
      }),
    }
  }
)

async function createTodo(userId: string, event: any, todoId: string) {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const newItem = {
    userId,
    todoId,
    ...newTodo,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`,
  }
  console.log('Storing new item: ', newItem)

  await docClient
    .put({
      TableName: todosTable,
      Item: newItem,
    })
    .promise()
  return newItem
}

handler.use(
  cors({
    credentials: true,
  })
)
