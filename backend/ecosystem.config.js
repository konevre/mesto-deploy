// backend /ecosystem.config.js
// Конфиг читает .env.deploy ТОЛЬКО локально
try {
    require('dotenv').config({ path: '.env.deploy', override: false });
} catch (e) {

}

const {
    DEPLOY_USER,
    DEPLOY_HOST,
    REPO_SSH,
    BRANCH = 'main',
    DEPLOY_BASE = '/var/www/mesto',
    BACKEND_PORT = 3000,
    LOCAL_ENV_PATH = './deploy/secrets/backend.env',
    BACKEND_DIR = 'backend',
} = process.env;
  
module.exports = {
    apps: [
        {
            name: 'mesto-backend',
            cwd: '.',
            script: `${BACKEND_DIR}/dist/app.js`,
            instances: 1,
            exec_mode: 'fork',
            watch: false,
            restart_delay: 5000,
            env: {
                NODE_ENV: 'production',
                PORT: BACKEND_PORT,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: BACKEND_PORT,
            },
        },
    ],
    deploy: {
        production: {
        user: DEPLOY_USER,
        host: DEPLOY_HOST,
        ref: `origin/${BRANCH}`,
        repo: REPO_SSH,
        path: DEPLOY_BASE,

        'pre-deploy': `mkdir -p ${DEPLOY_BASE}/shared`,

        'pre-deploy-local': `scp ${LOCAL_ENV_PATH} ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_BASE}/shared/backend.env`,

        'post-deploy': [
            `cd ${BACKEND_DIR} && (npm ci || npm install) && npm run build && ln -sf ${DEPLOY_BASE}/shared/backend.env .env && pm2 startOrReload ecosystem.config.js --only mesto-backend --env production`,
        ].join(' && '),
        },
    }
};