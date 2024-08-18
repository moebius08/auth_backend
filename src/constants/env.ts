
const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
  
    if (value === undefined) {
      throw Error(`Missing String environment variable for ${key}`);
    }
  
    return value;
  };
  
  export const MONGODB_URI = getEnv('MONGODB_URI');
  export const appEnv = getEnv('APP_ENV', 'development');
  export const jwtSecretKey = getEnv('JWT_SECRET_KEY');
  export const jwtRefreshSecretKey = getEnv('JWT_REFRESH_SECRET_KEY');
  export const email = getEnv('EMAIL', '');
  export const password = getEnv('PASSWORD', '');
  export const pepperString = getEnv('PEPPER_STRING');
  export const appName = getEnv('APP_NAME');
  export const algorithm = getEnv('ALGORITHM');
  export const accessTokenExpireMinutes = parseInt(getEnv('ACCESS_TOKEN_EXPIRE_MINUTES', '15'), 10);
  export const refreshTokenExpireMinutes = parseInt(getEnv('REFRESH_TOKEN_EXPIRE_MINUTES', '7000'), 10);
  export const apiV1Str = getEnv('API_V1_STR', '/v1');
  export const dbName = getEnv('DB_NAME');
  export const port = getEnv('PORT');
  export const APP_ORIGIN = getEnv('APP_ORIGIN');
