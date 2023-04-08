module.exports = {
  apps: [
    {
      name: 'client',
      script: 'yarn',
      args: 'run start',
      cwd: '/apps/client',
      env: {
        NODE_ENV: 'development',
      },
      env_staging: {
        NODE_ENV: 'staging',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'api',
      script: 'yarn',
      args: 'run start',
      cwd: '/apps/api',
      env: {
        NODE_ENV: 'development',
      },
      env_staging: {
        NODE_ENV: 'staging',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'api-live',
      script: 'yarn',
      args: 'run start',
      cwd: '/apps/api-live',
      env: {
        NODE_ENV: 'development',
      },
      env_staging: {
        NODE_ENV: 'staging',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
