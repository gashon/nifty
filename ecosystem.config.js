module.exports = {
  apps: [
    {
      name: 'client',
      script: 'npm',
      args: 'run start',
      cwd: '/usr/src/app/apps/client',
      exec_mode: 'cluster',
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
      script: 'npm',
      args: 'run start',
      cwd: '/usr/src/app/apps/api',
      exec_mode: 'cluster',
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
      script: 'npm',
      args: 'run start',
      cwd: '/usr/src/app/apps/api-live',
      exec_mode: 'cluster',
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
