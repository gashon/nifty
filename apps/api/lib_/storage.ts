import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: process.env.GOOGLE_SERVICE_PROJECT_ID,
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY,
  },
});

export default storage.bucket(process.env.GOOGLE_STORAGE_BUCKET!);
