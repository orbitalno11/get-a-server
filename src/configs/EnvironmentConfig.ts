import * as dotenv from "dotenv"

dotenv.config()

export const appEnvironment: string | undefined = process.env.ENV
export const LINE_PAY_CHANNEL_ID: string | undefined = process.env.LINE_PAY_CHANNEL_ID
export const LINE_PAY_CHANNEL_SECRET: string | undefined = process.env.LINE_PAY_CHANNEL_SECRET

export function getPortNumber(): string | undefined {
  switch (appEnvironment) {
    case "production":
      return process.env.PROD_PORT
    case "dev":
      return process.env.DEV_PORT
    default:
      return process.env.DEV_LOCAL_PORT
  }
}

export function getDatabaseHost(): string | undefined {
  switch (appEnvironment) {
    case "production":
      return process.env.DB_PROD_HOST
    case "dev":
      return process.env.DB_DEV_HOST
    default:
      return process.env.DB_DEV_LOCAL_HOST
  }
}

export function getDatabaseName(): string | undefined {
  switch (appEnvironment) {
    case "production":
      return process.env.DB_PROD_NAME
    case "dev":
      return process.env.DB_DEV_NAME
    default:
      return process.env.DB_DEV_LOCAL_NAME
  }
}

export function getDatabaseUser(): string | undefined {
  switch (appEnvironment) {
    case "production":
      return process.env.DB_PROD_USER
    case "dev":
      return process.env.DB_DEV_USER
    default:
      return process.env.DB_DEV_LOCAL_USER
  }
}

export function getDatabasePassword(): string | undefined {
  switch (appEnvironment) {
    case "production":
      return process.env.DB_PROD_PASSWORD
    case "dev":
      return process.env.DB_DEV_PASSWORD
    default:
      return process.env.DB_DEV_LOCAL_PASSWORD
  }
}

export function getFirebaseStorageBucketUrl(): string {
  switch (appEnvironment) {
    case "dev":
      return process.env.FIREBASE_STORAGE_BUCKET_URL
    default:
      return process.env.FIREBASE_STORAGE_BUCKET_URL
  }
}