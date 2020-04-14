import * as AWS from 'aws-sdk'

const AWSXRay = require('aws-xray-sdk')

export class XawsHelper{

    getDocumentClient(){
        const XAWS = AWSXRay.captureAWS(AWS)
        return new XAWS.DynamoDB.DocumentClient()
    }

    getS3(regionName:string, bucketName: string){
        const XAWS = AWSXRay.captureAWS(AWS)
        return new XAWS.S3({
            signatureVersion: 'v4',
            region: regionName,
            params: {Bucket: bucketName}
          })
    }
}