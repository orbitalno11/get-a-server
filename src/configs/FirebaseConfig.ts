import admin from 'firebase-admin';
import * as serviceAccount from '../../serviceAccountKey.json';
import { FIREBASE_STORAGE_URL } from "./EnvironmentConfig"

const credentialData = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

admin.initializeApp({
  credential: admin.credential.cert(credentialData),
  storageBucket: FIREBASE_STORAGE_URL
});

const authentication = admin.auth();
const bucket = admin.storage().bucket();

export { admin, authentication, bucket };
