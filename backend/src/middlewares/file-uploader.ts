import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import path from "path";
import { v4 } from "uuid";
import config from 'config'
import s3Client from "../aws/s3";
import sqsClient, { queueUrl } from "../aws/sqs";
import { SendMessageCommand } from "@aws-sdk/client-sqs";

declare global {
    namespace Express {
        interface Request {
            imageUrl?: string
        }
    }
}

export default async function fileUploader(req: Request, res: Response, next: NextFunction) {
    if (!req.files) return next()

    const postImage = req.files.postImage as UploadedFile


    try {
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: config.get<string>('s3.bucket'),
                Key: `${v4()}${path.extname(postImage.name)}`,
                Body: postImage.data,
                ContentType: postImage.mimetype
            }
        })

        const response = await upload.done()
        console.log(response)
        const sqsResponse = await sqsClient.send(new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify({
                bucket: response.Bucket,
                key: response.Key
            })
        }))
        console.log(sqsResponse)
        req.imageUrl = `${response.Bucket}/${response.Key}`
        next()
    } catch (e) { console.log(e.message, e) }
    // req.imageUrl = 'https://cdn.britannica.com/55/174255-050-526314B6/brown-Guernsey-cow.jpg'
}

function V4(): string {
    throw new Error("Function not implemented.");
}
