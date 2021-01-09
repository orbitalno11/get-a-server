import * as dotenv from "dotenv"

dotenv.config()

const appEnvironment: string | undefined = process.env.environment

function getPortNumber(): string | undefined {
  switch (appEnvironment) {
    case "production":
      return process.env.prod_port
    case "dev":
      return process.env.dev_port
    default:
      return process.env.dev_local_port
  }
}

function getDatabaseHost(): string | undefined {
  switch (appEnvironment) {
    case "production":
      return process.env.db_prod_host
    case "dev":
      return process.env.db_dev_host
    default:
      return process.env.db_dev_local_host
  }
}

function getDatabaseName(): string | undefined {
  switch (appEnvironment) {
    case "production":
      return process.env.db_prod_name
    case "dev":
      return process.env.db_dev_name
    default:
      return process.env.db_dev_local_name
  }
}

function getDatabaseUser(): string | undefined {
  switch (appEnvironment) {
    case "production":
      return process.env.db_prod_user
    case "dev":
      return process.env.db_dev_user
    default:
      return process.env.db_dev_local_user
  }
}

function getDatabasePassword(): string | undefined {
  switch (appEnvironment) {
    case "production":
      return process.env.db_prod_password
    case "dev":
      return process.env.db_dev_password
    default:
      return process.env.db_dev_local_password
  }
}

function getFirebaseStorageBucketUrl(): string {
  switch (appEnvironment) {
    case "dev":
      return process.env.FIREBASE_STORAGE_BUCKET_URL
    default:
      return process.env.FIREBASE_STORAGE_BUCKET_URL
  }
}

export {
  getPortNumber,
  getDatabaseHost,
  getDatabaseName,
  getDatabaseUser,
  getDatabasePassword,
  getFirebaseStorageBucketUrl
}
