import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION || "us-west-004",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
});

export async function uploadToB2(file: File, path: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const key = `${path}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return `${process.env.B2_PUBLIC_URL}/${key}`;
}
