export const SCB_SANDBOX_URL: string | undefined = process.env.SCB_SANDBOX_URL
export const SCB_API_KEY: string | undefined = process.env.SCB_API_KEY
export const SCB_API_SECRET: string | undefined = process.env.SCB_API_SECRET
export const SCB_BILLER_ID: string | undefined = process.env.SCB_BILLER_ID
export const SCB_MERCHANT_ID: string | undefined = process.env.SCB_MERCHANT_ID
export const SCB_TERMINAL_ID: string | undefined = process.env.SCB_TERMINAL_ID
export const SCB_REF3_PREFIX: string | undefined = process.env.SCB_REF3_PREFIX
export const PAYMENT_CALLBACK_URL: string | undefined = process.env.PAYMENT_CALLBACK_URL

export const SERVER_PORT: string | undefined = process.env.PORT

export const DATABASE_HOST: string | undefined = process.env.DB_HOST
export const DATABASE_PORT: number | undefined = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
export const DATABASE_NAME: string | undefined = process.env.DB_NAME
export const DATABASE_USER: string | undefined = process.env.DB_USER
export const DATABASE_PASSWORD: string | undefined = process.env.DB_PASSWORD

export const AWS_BUCKET_NAME: string | undefined = process.env.AWS_BUCKET_NAME
export const AWS_ACCESS_KEY_ID: string | undefined = process.env.AWS_ACCESS_KEY_ID
export const AWS_SECRET_ACCESS_KEY: string | undefined = process.env.AWS_SECRET_ACCESS_KEY
export const DIGITAL_OCEAN_SPACE_ENDPOINT: string | undefined = process.env.DIGITAL_OCEAN_SPACE_ENDPOINT
export const DIGITAL_OCEAN_SPACE_CDN_ENDPOINT: string | undefined = process.env.DIGITAL_OCEAN_SPACE_CDN_ENDPOINT