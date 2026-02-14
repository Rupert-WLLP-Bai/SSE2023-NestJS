/**
 * @file 七牛云存储的AccessKey和SecretKey
 */

/**
 * 七牛云存储的AccessKey
 */
export const getAccessKey = (): string => {
  return process.env.QINIU_ACCESS_KEY || '';
};

/**
 * 七牛云存储的SecretKey
 */
export const getSecretKey = (): string => {
  return process.env.QINIU_SECRET_KEY || '';
};

/**
 * 七牛云存储的Bucket
 */
export const getQiniuBucket = (): string => {
  return process.env.QINIU_BUCKET || 'tongue-sse2023';
};

/**
 * 七牛云存储的Domain
 */
export const getQiniuDomain = (): string => {
  return process.env.QINIU_DOMAIN || '';
};

/**
 * JWT Secret
 */
export const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'default-jwt-secret-change-me';
};
