wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source /root/.bashrc
nvm install v16.15.0
cd /data/sites/basf
npm install
npm run serve:prod