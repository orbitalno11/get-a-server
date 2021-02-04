import admin from "firebase-admin"
import firebase from "firebase"
import serviceAccount from "./serviceAccountKey.json"
import clientConfig from "./FirebaseClient"

const credentailData = {
    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url
}

admin.initializeApp({
    credential: admin.credential.cert(credentailData)
})

firebase.initializeApp(clientConfig)

const authentication = admin.auth()
const clientAuth = firebase.auth()

export {
    admin,
    authentication,
    clientAuth
}