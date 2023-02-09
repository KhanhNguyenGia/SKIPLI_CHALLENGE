# Skipli Challenge - Code Challenge 2

## Structure

- The project is divided into two folders, `frontend` and `backend`. The `frontend` folder contains the React application, while the `backend` folder contains the Express.js application.

<br/>

### Folder `frontend`

- The frontend application was bootstrapped using `create-react-app`. The root of the project includes 2 folders `public` and `src`, in addition to `.gitignore`, `package.json`, `package-lock.json` and `README.md`.

<br/>

#### Folder `public`

- `public` folder contains any static files that are used by the application, such as `index.html` and `favicon.ico`.

- These files are not processed by Webpack and will be copied as is to the `build` folder for serving to clients.

<br/>

#### Folder `src`

- The `src` folder contains the source code for the application.

- The `index.js` file is the entry point for the application. The `App.jsx` file contains the main component for the application. The `index.css` file contains the global styles for the application.

- The `assets` folder contains any static assets that are used by the application, such as `*.json` for loading country code and `*.svg` for the icons.

- The `components` folder contains any re-usable UI logic for the entire application. Components should only focus on rendering UI and contain minimal business logic. All components are also styled using `css module` supported by `create-react-app` through the `*.module.css` file extension to avoid any naming collision. All components are exported using an `index.js` module file to allow for cleaner imports.

- The `constants` folder contains any constants that are used by the application, such as `routes.js` for routing and `regex.js` for regular expression.

- The `containers` contains Containers for the application. Containers are responsible for most of the business logic used in the application, mainly fetching, passing data to components and handling users interactions. All containers are also styled using `css module`.

- The `hooks` folder contains custom hooks.

<br/>

### Folder `backend`

- The backend application contains `server.js` as the entry point for the application. It uses `express` for setting up the server, middleware and routing.

- The backend contains `.env` file for storing environment variables. The `.env` file should **not** be included in the repository for security reasons. However, for demonstration purposes, the `.env` file is included in the repository.

- `serviceAccount.json` is the account key for the Firebase project. It is used for authenticating the application with Firebase. It should also **not** be included in the repository.

- It also contains the usual files such as `.gitignore`, `package.json` and `package-lock.json`.

<br/>

#### Folder `routes`

- The `routes` folder contains the routes for the application. Each route is an instance of `Router` from `express`, which is then used by `express` in `server.js` to set up the routes. Each route also responsible for routing the request to the appropriate controller.

<br/>

#### Folder `controllers`

- The `controllers` folder contains the controllers for the application. Each controller is responsible for handling the request and returning the appropriate response. Each controller is also responsible for validating the request and returning the appropriate error response.

<br/>

#### Folder `constants`

- The `constants` folder contains the constants for the application. It contains `routes.js` for routing and `regex.js` for regular expression.

<br/>

## Running the application

<br/>

### Running the `frontend`

1. When opening the project in the terminal, navigate to the `frontend` folder using:

```bash
cd frontend
```

2. Install all dependencies using:

```bash
npm install
```

3. Run the application using:

```bash
npm start
```

4. The application will be available at [http://localhost:3000](http://localhost:3000).

<br/>

### Running the `backend`

1. When opening the project in the terminal, navigate to the `backend` folder using:

```bash
cd backend
```

2. Install all dependencies using:

```bash
npm install
```

3. Change the `GITHUB_ACCESS_TOKEN` to your own GitHub access token in `.env` file.

4. Run the application using:

```bash
npm start
```

5. The application will be available at [http://localhost:4000](http://localhost:4000).
