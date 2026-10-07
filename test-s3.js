require('dotenv').config();
const { S3Client, PutObjectCommand, DeleteObjectCommand, ListBucketsCommand, CreateBucketCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  forcePathStyle: true
});

async function main() {
  try {
    const listRes = await s3.send(new ListBucketsCommand({}));
    console.log("Buckets found:", listRes.Buckets.map(b => b.Name));

    const bucketName = process.env.AWS_S3_BUCKET_NAME || 'assets';
    const exists = listRes.Buckets.find(b => b.Name === bucketName);

    if (!exists) {
      console.log(`Bucket "${bucketName}" does not exist. Creating...`);
      await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
      console.log(`Bucket created!`);
    } else {
      console.log(`Bucket "${bucketName}" exists.`);
    }

    const key = "test/logo.png";
    const filePath = path.join(__dirname, 'public/logo.png');
    const fileContent = fs.readFileSync(filePath);

    console.log(`Uploading to ${bucketName}/${key}...`);
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
      ContentType: "image/png"
    }));
    console.log("Upload successful!");

    console.log(`Deleting ${bucketName}/${key}...`);
    await s3.send(new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    }));
    console.log("Delete successful!");

  } catch (err) {
    console.error("S3 Error:", err.message || err);
  }
}

main();
