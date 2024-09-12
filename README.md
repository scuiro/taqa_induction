# Interface API with Taqa Morocco Induction System

## Description
This project allows integration with the Taqa Morocco Induction System using a REST API. It facilitates communication between the Node.js application and Taqa Morocco's induction system to manage various processes.

## Features
- RESTful API integration with the Taqa Morocco system.
- Efficient interaction with the induction system's services.
- Supports standard HTTP methods: GET, POST, PUT, DELETE (adapt based on actual API operations).

## Prerequisites
- Node.js (v14.x or later)
- npm (v6.x or later)
- API authentication credentials (if required)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/scuiro/taqa_induction/
    ```

2. Navigate to the project directory:
    ```bash
    cd taqa_induction
    ```

3. Install the necessary dependencies:
    ```bash
    npm install
    ```

## Configuration
1. Create a `.env` file in the root directory and add your environment variables (like API keys):
    ```
    API_URL=<API endpoint>
    API_KEY=<your-api-key>
    ```

2. Modify `config.js` or any relevant configuration file to use the environment variables.

## Usage
1. Start the Node.js application:
    ```bash
    node app.js
    ```
    to run deffinitively the server you have to install before pm2 using npm with 
    npm install -g pm2 
    and the you can start the permanantly server with 
    pm2 start app.js --name taqa-induction 

2. The API will be available at `http://localhost:8082` (default port). You can now interact with the Taqa Morocco induction system using the defined routes.

## Available Scripts

- **start**: Run the application
    ```bash
    node app.js
    ```
## API Endpoints
_Provide details of the API routes here, for example:_

- `POST /api/new-request`: to init a induction session.
- `POST /api/get-induction-result`: Retrieve induction score.

## Contributing
Pull requests are welcome. For significant changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

