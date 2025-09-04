# Beacon UI

**Beacon UI** is the front-end of the ELIXIR Beacon Network.  
It provides a user-friendly React-based interface to interact with Beacon API endpoints, enabling researchers to query genomic data across federated datasets through the [Beacon Specifications](https://docs.genomebeacons.org/).

This project is containerized with Docker and configured through JSON files, making it easy to deploy and adapt to specific organizational needs.

---

## Features

- 🌐 **React-based front-end** for the Beacon API  
- ⚡ Integrates directly with Beacon API endpoints  
- 🐳 Dockerized deployment for easy setup and portability  
- ⚙️ Configurable through `envs/default/config.json`  
- 🎨 Customizable look and feel to fit organizational requirements  

---


## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed on your system
- Access to a Beacon API endpoint

### Installation

Clone the repository:

```bash
git clone https://github.com/elixir-europe/beacon-ui.git
cd beacon-ui
```

### Build and run the container

```bash
docker build -t beacon-ui .
docker run -p 3000:3000 beacon-ui
```

The UI will be available at: http://localhost:3000


## Configuration
All configuration is handled through JSON files located under envs/ .
Default configuration is in:

```arduino
envs/default/config.json
```

Example structure:
```json
{
  "API_URL": "https://your-beacon-instance.org/api",
  "APP_TITLE": "Beacon Network",
  "THEME": {
    "primaryColor": "#005EB8"
  }
}
```

To customize:

1- Edit envs/default/config.json (or create a new environment folder under envs/).

2- Rebuild the Docker image:
```bash
docker build -t beacon-ui .
```

## Development
If you want to run the app locally without Docker:

```bash
yarn install
yarn start
```

The app will be available at http://localhost:3000


## Project structure
```php
├── envs/
│   └── default/
│       └── config.json
├── src/
├── public/
├── docker-compose.yml
└── README.md

```