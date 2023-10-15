# city-project-client

## Docker Compose 

Remplacer les valeurs entre crochets, et copier le contenu dans un fichier `docker-compose.yml`.

Une fois le fichier créer, éxécuter la commande `docker compose up -d` pour lancer les containers.

```
version: '3'

services:
  city-project-server:
    image: ghcr.io/devsoleo/city-project-server:main
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      DATABASE_ADDRESS={ IP/DOMAIN }

      SERVER_ADDRESS={ IP/DOMAIN }
      SOCKET_PORT=3001
      WEB_PORT=3000

      CLIENT_ADDRESS={ IP/DOMAIN }
      CLIENT_PORT=3002

  city-project-client:
    depends_on: city-project-server
    image: ghcr.io/devsoleo/city-project-client:main
    ports:
      - "3002:3002"
    environment:
      SERVER_ADDRESS={ IP/DOMAIN }
      WEB_PORT=3000
      SOCKET_PORT=3001
```