# Cypress E2E & API Integration Testing Suite for STQA

This directory contains 6 automated Cypress spec files to test key user workflows and APIs of the Cars_24 fullstack application.

## Prerequisites

1. **Node.js**: Ensure Node.js is installed.
2. **Application Running**: Make sure the application is running locally:
   - Backend on `http://localhost:4000`
   - Frontend on `http://localhost:3000`

## Setup

Install the required modules (primarily `cypress`):

```bash
cd Test/cypress
npm install
```

## Running the Tests

To run the Cypress tests in headless mode (command-line):

```bash
npm test
```

To run individual specs or open the Cypress Test Runner GUI:

```bash
npm run cypress:open
```

Then select **E2E Testing** and select the spec you want to run:
- `1_register.cy.js`
- `2_login.cy.js`
- `3_get_cars.cy.js`
- `4_add_car.cy.js`
- `5_edit_car.cy.js`
- `6_delete_car.cy.js`
