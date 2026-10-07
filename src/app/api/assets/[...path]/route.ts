import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ forcePathStyle: true });
const BUCKET = process.env.AWS_S3_BUCKET_NAME || "assets";

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const key = params.path.join("/");
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });
    
    // Generate a presigned URL valid for 1 hour
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    
    // Redirect the browser to the presigned S3 URL
    return NextResponse.redirect(url);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate asset URL" }, { status: 500 });
  }
}
