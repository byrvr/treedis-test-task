# Treedis Test Task

## Overview

This project is a test task for Treedis, utilizing the Next.js framework along with React and Three.js for 3D rendering. The application is designed to demonstrate the integration of Matterport's SDK for 3D model visualization. Additionally, it includes a server component for handling menu items.

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd treedis-test-task
   ```

2. Install the dependencies for the client:
   ```bash
   npm install
   ```

3. Navigate to the server directory and install its dependencies:
   ```bash
   cd server
   npm install
   ```

### Running the Application

#### Client

To start the client development server, run:
```bash
npm run dev
```
The client application will be available at `http://localhost:5002`.

#### Server

To start the server, navigate to the `server` directory and run:
```bash
npm run start
```
The server will be available at `http://localhost:5001`.


## Environmental Variables

This project requires certain environmental variables to be set for proper integration with the Matterport SDK. These variables are stored in a `.env` file at the root of the project. An example file `.env.example` is provided for reference.

### Required Variables

- `MATTERPORT_SDK_KEY`: Your Matterport SDK key.
- `MATTERPORT_MODEL_SID`: The SID of the Matterport model you wish to display. (for this example, the model is `m72PGKzeknR`)

**Note:** Ensure that your `.env` file is not committed to version control as it contains sensitive information.

## Dependencies

### Client

The client uses the following main dependencies:

- **Next.js**: A React framework for server-side rendering and static web applications.
- **React**: A JavaScript library for building user interfaces.
- **Three.js**: A 3D library that makes WebGL simpler.

### Server

The server uses the following main dependencies:

- **Express**: A web application framework for Node.js.
- **CORS**: A package to provide a Connect/Express middleware that can be used to enable CORS.

## Development

For development, the project uses TypeScript for type safety and linting is handled by ESLint.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements.

## License

This project is licensed under the MIT License.
