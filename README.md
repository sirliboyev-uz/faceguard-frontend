
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
# start dev server
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

## Screenshots

*Manage company, branch, department with location and department counts.*
![image](https://github.com/user-attachments/assets/983bc39c-cef4-4156-9284-1ed2ba281ede)
![image](https://github.com/user-attachments/assets/c836523d-73e4-4c7f-b230-3a6d1f0ae8f4)
![image](https://github.com/user-attachments/assets/b4e4fb57-51d4-46b9-8d82-b5fab141f1a0)

*Employee CRUD.*
![image](https://github.com/user-attachments/assets/c4098461-61e3-4e11-85fe-92bb416cf00c)

*Users CRUD.*
![image](https://github.com/user-attachments/assets/daf1d4f3-ebbd-4d9d-a7d3-2fec5b687a4f)

*Roles CRUD.*
![image](https://github.com/user-attachments/assets/5e7d1cd1-bf60-4430-829b-46af5304b4e9)
![image](https://github.com/user-attachments/assets/ad5ecffa-9fde-469e-b90b-18cece6f3347)

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
