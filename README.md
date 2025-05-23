
# FaceGuard Frontend

A React-based administrative dashboard for **FaceGuard** — a face-recognition attendance and visitor management system.  
This app lets you manage companies, branches, departments, employees, users & roles, and view real-time attendance.

---

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Prerequisites](#prerequisites)  
4. [Installation](#installation)  
5. [Environment Variables](#environment-variables)  
6. [Running Locally](#running-locally)  
7. [Building for Production](#building-for-production)  
8. [Project Structure](#project-structure)  
9. [Scripts](#scripts)  
10. [Contributing](#contributing)  
11. [License](#license)  
12. [Contact](#contact)

---

## Features

- **Authentication** (sign in/out)  
- **Dashboard** overview & metrics  
- **Company** CRUD (name, address, email, phone)  
- **Branch** CRUD (name, description, geolocation)  
- **Department** CRUD (name, branch, employee count)  
- **Employee** CRUD (photo, name, email, job title, status)  
- **User** & **Role** Management with fine-grained permissions  
- **Visitor** logging  
- **Attendance** monitoring & real-time “Live” feed  
- **Role-Based Access Control** (RBAC)

---

## Tech Stack

- **React** (17+ or 18+)  
- **React Router** for route handling  
- **Axios** (or Fetch) for HTTP  
- UI library (e.g. Material UI / Ant Design / Tailwind CSS)  
- **Context API** or Redux for state  
- **Day.js** or date-fns for dates  
- **WebSocket** for live attendance feed  

---

## Prerequisites

- [Node.js](https://nodejs.org/) v14+  
- [npm](https://npmjs.com/) or [Yarn](https://yarnpkg.com/)

---

## Installation

```bash
# clone repo
git clone https://github.com/sirliboyev-uz/faceguard-frontend.git
cd faceguard-frontend

# install dependencies
npm install
# or
yarn install
````

## Running Locally

```bash
# npm run dev
npm start
# or
yarn start
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will hot-reload on changes.

---

## Building for Production

```bash
npm run build
# or
yarn build
```

Your optimized files will be in `/build`. Deploy to any static-file host.

---

## Scripts

| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm start`     | Start dev server (hot reload)  |
| `npm run build` | Create production build        |
| `npm test`      | Run unit tests (if configured) |
| `npm run lint`  | Run ESLint                     |

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/foo`)
3. Commit your changes (`git commit -m "feat: add foo"`)
4. Push to branch (`git push origin feature/foo`)
5. Open a Pull Request

Please follow our code style and include meaningful commit messages.

---

## License

Distributed under the MIT License. See `LICENSE` for more details.

---

## Contact

FaceGuard Team · \[[sirliboyevuz@gmail.com](sirliboyevuz@gmail.com)]
Project Link: [https://github.com/sirliboyev-uz/faceguard-frontend](https://github.com/sirliboyev-uz/faceguard-frontend)

```

Feel free to adjust any paths, commands or environment variables to match your setup.
```
