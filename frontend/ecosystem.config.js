// frontend /ecosystem.config.js
// Конфиг читает .env.deploy ТОЛЬКО локально
try {
    require('dotenv').config({ path: '.env.deploy', override: false });
} catch (e) {

}

const {
    DEPLOY_USER,
    DEPLOY_HOST,
    REPO_SSH,
    BRANCH = 'master',
    DEPLOY_BASE = '/var/www/mesto',
    NGINX_STATIC_PATH = '/var/www/html',
    FRONTEND_PORT = 3000,
    FRONTEND_DIR = 'frontend',
} = process.env;
  
module.exports = {
    apps: [
        {
            name: 'mesto-frontend',
            cwd: '.',
            script: 'npm',
            args: 'start',
            instances: 1,
            exec_mode: 'fork',
            watch: false,
            restart_delay: 5000,
            env: {
                NODE_ENV: 'production',
                PORT: FRONTEND_PORT,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: FRONTEND_PORT,
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

        'post-deploy': [
            `npm ci --prefix ${FRONTEND_DIR} || npm install --prefix ${FRONTEND_DIR}`,
            `REACT_APP_API_BASE=https://api.konevre.nomorepartiessbs.ru NODE_OPTIONS=--openssl-legacy-provider npm run --prefix ${FRONTEND_DIR} build`,
            `sudo rsync -a --delete ${FRONTEND_DIR}/build/ ${NGINX_STATIC_PATH}/`,
            'sudo systemctl reload nginx'
        ].join(' && '),
        },
    }
};
