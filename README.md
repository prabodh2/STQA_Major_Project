# CARS_24

This project is a MERN-based product management system with a React frontend, an Express/MongoDB backend, Selenium UI automation, Cypress end-to-end tests, and a JMeter HTTP test plan.

---

## 3. Project Structure

```text
CARS_24/
├── Backend/                 # Express/NodeJS backend and API endpoints
├── frontend/                # React/Vite frontend source code
├── test/                    # QA/Testing directory
│   ├── selenium-java/       # Selenium UI automation tests (TestNG/Maven)
│   ├── cypress/             # Cypress E2E browser tests
│   └── jmeter/              # JMeter functional/load testing scripts
├── docs/
│   └── screenshots/         # Screenshots of execution and Jenkins dashboard
├── Jenkinsfile              # Jenkins CI/CD pipeline script
└── README.md                # Project documentation
```

---

## 4. Features

- MERN-based Product Management system
- React frontend with routing and responsive UI layouts
- Express/Mongoose backend with MongoDB connectivity
- Integrated testing suites:
  - **Selenium** for browser-based UI automation
  - **Cypress** for end-to-end user flows
  - **JMeter** for functional and API-level load testing
- Continuous Integration pipeline configured via **Jenkins** with TestNG reporting

---

## 5. Prerequisites

Before running the application, make sure you have the following installed:
- **Node.js** (v18+)
- **MongoDB** (running locally or in Docker on port `27017`)
- **Java JDK** (v17+) and **Apache Maven** (for Selenium tests)
- **Apache JMeter** (for load testing)

---

## 6. Environment Variables

Backend reads MongoDB connection settings from environment variables.

Create a backend `.env` file at `Backend/.env` with:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/pms_mern
```

*Note: If `MONGODB_URI` is not set, the backend falls back to `mongodb://127.0.0.1:27017/pms_mern`.*

### Developer Details
- **Lead Developer:** Prabodh Badimi
- **GitHub profile:** [prabodh2](https://github.com/prabodh2)
- **Repository:** [STQA_Major_Project](https://github.com/prabodh2/STQA_Major_Project)

---

## 7. How to Run

### 1. Start MongoDB
Make sure MongoDB is running locally before starting the backend.

### 2. Run the Backend
```bash
cd Backend
npm install
npm run dev
```
The backend starts on `http://localhost:3000` by default.

**Health check:**
```http
GET http://localhost:3000/health
```

### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:5173` with Vite.

---

## Backend API Endpoints

**Base URL:** `http://localhost:3000`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/health` | Health check |
| **GET** | `/products` | Get all products |
| **GET** | `/products/:id` | Get a single product |
| **POST** | `/products` | Create a product |
| **PUT** | `/products/:id` | Update a product |
| **DELETE** | `/products/:id` | Delete a product |
| **GET** | `/products/stats` | Get product statistics |

**Example create payload:**
```json
{
  "name": "Laptop",
  "price": 55000,
  "quantity": 10,
  "imageURL": "https://example.com/laptop.png",
  "category": "Electronics"
}
```

---

## Frontend Routes

| Route | Page |
| :--- | :--- |
| `/` | Products list |
| `/products` | Products list |
| `/create` | Create product |
| `/show/:id` | View product details |
| `/update/:id` | Update product |
| `/stats` | Stats page |

---

## Selenium Tests

Selenium tests live under `test/selenium-java` and are driven by TestNG.

**Main suite file:**
```text
test/selenium-java/testng.xml
```

The suite runs these tests in order:
1. Home page
2. Stats page
3. Add product
4. Edit product
5. View product
6. Delete product

**Run Selenium tests:**
```bash
cd test/selenium-java
mvn test
```

---

## Cypress Tests

The Cypress project is under `test/cypress` and is configured to use:
- **baseUrl:** `http://localhost:5173`
- **spec pattern:** `cypress/e2e/**/*.cy.js`

**Test files:**
- `homePage.cy.js`
- `statsPage.cy.js`
- `showProduct.cy.js`
- `addProduct.cy.js`
- `editProduct.cy.js`
- `deleteProduct.cy.js`

**Run Cypress from the Cypress project folder:**
```bash
npx cypress open --config-file test/cypress/cypress.config.js
```
or run headless:
```bash
npx cypress run --config-file test/cypress/cypress.config.js
```

*The Cypress suite is also wired into Jenkins in the same style as the Selenium tests.*

---

## JMeter Test Plan

The JMeter HTTP test plan is located at:
```text
test/jmeter/PMSHttpTest.jmx
```

It covers:
- Home / all products request
- Stats request
- Add product request
- Edit product request
- View product request
- Delete product request

*Open the `.jmx` file in JMeter and run it against the backend on `http://localhost:3000`.*

---

## Typical Development Flow

1. Start MongoDB.
2. Start the backend.
3. Start the frontend.
4. Open the app in the browser at `http://localhost:5173`.
5. Run Selenium, Cypress, or JMeter tests from their respective folders as needed.

---

## Notes

- The backend uses Express and Mongoose.
- The frontend uses React Router for navigation.
- Product detail pages, update pages, and stats pages are all routed in the frontend.
- Cypress and Selenium are both used for browser-based verification.
- JMeter is included for API-level load and functional testing.

---

## Jenkins Execution Screenshots

### 1. Jenkins Build Dashboard
![Jenkins Build Dashboard](docs/screenshots/1_jenkins_dashboard.png)

### 2. TestNG Results Trend
![TestNG Results Trend](docs/screenshots/2_testng_results_trend.png)

### 3. TestNG Executed Test Methods Status
![TestNG Executed Test Methods Status](docs/screenshots/3_testng_class_results.png)

### 4. Cypress Execution Console Output
![Cypress Execution Console Output](docs/screenshots/4_cypress_console_output.png)

### 5. Selenium Execution Console Output
![Selenium Execution Console Output](docs/screenshots/5_selenium_console_output.png)
