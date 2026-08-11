Pour tester ce projet à bien :
-npm install
et créer .env avec comme variables DB_USER et DB_PASSWORD afin de se connecter à MongoDB Atlas

Pour les avoir, se connecter à MongoDB Atlas puis accéder à ton cluster gratuit puis, "Connect", "MongoDB for VSCode" et paste your connection string into the Command Palette.
Remplace <db_password> par le mot de passe que tu as choisi
Si tu as perdu ton mot de passe, tu peux te rendre sur le menu de gauche, "Security", "Database and Netxork Access", tu édites ton user, "Authentication Method : Password", "Edit password" et tu choisi un ouveau mot de passe de ton choix pour l'affecter ensuite à DB_PASSWORD
Pour remplir DB_USER, "Security", "Database and Network Access" puis tu copies le User pour l'affecter à DB_USER