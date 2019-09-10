# Billing
Subscription Billing for VapourApps

Installation:

```bash
#1. Install curl and git
apt-get install -y curl git

#2. Install nodejs and npm
apt-get install software-properties-common
curl -sL https://deb.nodesource.com/setup_12.x | bash -
apt-get install -y nodejs npm

#3. Clone the repo 
git clone https://github.com/VapourApps/billing_frontend.git
cd billing_frontend/

#4. Edit backend.json settings file 
cp backend.json.sample backend.json

#5. Install moustache template engine globally 
npm install -g mustache

#6. Install node_modules dependencies 
npm install

#7. (Optional) Render moustache templates - build and import custom sub components
npm run buildCustomComponents

#8. Build the project - generate bundle.js file 
npm run build

#9 Run server
npm run start
```
