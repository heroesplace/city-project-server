# City Project [Server]

[![NodeJS](https://img.shields.io/badge/NodeJS-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://github.com/nodejs/node)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://github.com/socketio/socket.io)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://github.com/redis/redis)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://github.com/postgres/postgres)
[![JavaScript Standard Style](https://img.shields.io/badge/JavaScript_Standard_Style-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://github.com/standard/standard)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://github.com/auth0/node-jsonwebtoken)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://github.com/expressjs/express)
[![Discord](https://img.shields.io/discord/1070782232219877477?color=7289da&label=Discord&logo=discord&style=for-the-badge)](https://discord.gg/VSdXn4Jqws)

## Build Status

![Build Status](https://img.shields.io/github/actions/workflow/status/devsoleo/city-project-server/main.yml?branch=main&style=for-the-badge)

## Introduction

**City Project [Server]** is the backend part of the [City Project](https://github.com/devsoleo/city-project) open-source video game. City Project is a hybrid between an MMORPG and a strategy game, where players join the world, develop their characters, create villages, and conquer territories in a fully player-shaped universe.

## Technologies

Our philosophy revolves around open-source principles. Every tool and technology used has been chosen with the open-source mindset:
- **socket.io**: Real-time bidirectional event-based communication librairie. We use socket.io to handle seamless real-time communication between the server and clients.

- **Redis**: In City Project, Redis is used to manage data that requires rapid access, including:
  - **Player Coordinates**: Fast lookup for player positions to ensure smooth movement across the world.
  - **Chat Messages**: Instantaneous communication between players in various chat rooms.
  - **Other Real-time Data**: Any data that requires quick read and write operations for a fluid player experience.

- **PostgreSQL**: An advanced open-source relational database used for the remaining data storage needs of City Project. PostgreSQL is responsible for:
  - **Player Accounts and Characters**: Secure and structured storage for player account details and progress.
  - **Game World Data**: Persistence of game world elements such as villages, territories created or conquered by players.

- **Express**: The REST API is built with Express, which enables the following functionalities:
  - **Account authentication**: This is the part of the API that allows users to authenticate or create an account.
  - **Communicate with external APIs**: This is what enables the application to communicate with external services (such as Discord, for example, to connect an account).

## Community
Join our [Discord server](https://discord.gg/VSdXn4Jqws) to get involved in discussions, report bugs, or seek help.

> Where every choice build a world