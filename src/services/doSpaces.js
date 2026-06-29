import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const endpoint = process.env.DO_SPACES_ENDPOINT;
const region = process.env.DO_SPACES_REGION;
const key = process.env.DO_SPACES_KEY;
const secret = process.env.DO_SPACES_SECRET;
const bucket = process.env.DO_SPACES_BUCKET;

let client = null;

function getClient() {
  if (!client) {
    if (!endpoint || !key || !secret || !bucket) {
      throw new Error('Missing Digital Ocean Spaces configuration (check DO_SPACES_* env vars)');
    }
    client = new S3Client({
      endpoint: `https://${endpoint}`,
      region: region || 'us-east-1',
      credentials: { accessKeyId: key, secretAccessKey: secret },
      forcePathStyle: false,
    });
  }
  return client;
}

export async function uploadRecording(buffer, filename, contentType = 'video/webm') {
  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: `recordings/${filename}`,
    Body: buffer,
    ContentType: contentType,
    ACL: 'private',
  });
  await getClient().send(cmd);
  const url = `https://${bucket}.${endpoint}/recordings/${filename}`;
  return { url, key: `recordings/${filename}` };
}

export async function getPresignedUploadUrl(filename, contentType = 'video/webm') {
  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: `recordings/${filename}`,
    ContentType: contentType,
    ACL: 'private',
  });
  const url = await getSignedUrl(getClient(), cmd, { expiresIn: 3600 });
  return { url, key: `recordings/${filename}` };
}

export default { uploadRecording, getPresignedUploadUrl };
