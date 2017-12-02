# WebApp

Commandes pour lancer l'application en dev (toutes dans `hbcc-app/`):
* `npm install` ou `yarn` : installe les librairies
* dans deux terminaux : 
    * `ng build -dev --watch` : compile l'application angular dans le répertoire `dist/`
    * `./node_modules/pm2/bin/pm2-dev start server/server.js` : lance le serveur nodejs/express

Si la commande pour l'api ne marche pas (OK sous Linux) :
    * `npm install -g pm2` ou `yarn global add pm2`
    * puis  `pm2-dev start server/server.js`
