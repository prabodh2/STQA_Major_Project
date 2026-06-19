# Cars_24 STQA Testing Suite

This directory contains automated testing suites developed for Software Testing and Quality Assurance (STQA) objectives. 

All 6 API flows (User Registration, Dealer Login, Get Catalog, Add Car, Edit Car, Delete Car) have been consolidated into single, unified master test files for each framework, which can be run directly from the terminal.

---

## 1. Direct REST API Test (Zero-Dependency Node.js)
This test hits the backend API endpoints directly using Node's native HTTP/fetch client.

* **File**: `test/api_test.js`
* **Execution**:
  ```bash
  cd test
  node api_test.js
  ```

---

## 2. Selenium E2E UI Suite (Single Browser Session)
This E2E suite performs UI actions sequentially using headless Chrome in a single active session.

* **File**: `test/selenium/all_6_apis.test.js`
* **Execution**:
  ```bash
  cd test/selenium
  npm install
  node all_6_apis.test.js
  ```

---

## 3. Cypress E2E UI Suite (Single Session)
This suite runs the 6 scenarios continuously in a single spec run, maintaining localStorage and login state.

* **File**: `test/cypress/cypress/e2e/all_6_apis.cy.js`
* **Execution**:
  ```bash
  cd test/cypress
  npm install
  npx cypress run --spec "cypress/e2e/all_6_apis.cy.js"
  ```

---

## 4. Apache JMeter API Sequence
This JMX plan runs the 6 REST API endpoints sequentially, dynamically extracting variables and the JWT token.

* **File**: `test/jmeter/all_6_apis.jmx`
* **Execution**:
  ```bash
  cd test/jmeter
  jmeter -n -t all_6_apis.jmx -l results.jtl
  ```

---

## Prerequisites
Before running the E2E suites:
1. **Start the Backend** (port 4000)
2. **Start the Frontend** (port 3000)
3. **Database Seeded** (MongoDB running)
