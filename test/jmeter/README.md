# JMeter API Load/Performance Testing Suite

This folder contains 6 independent **Apache JMeter Test Plans** to perform load and API performance testing on the Cars_24 fullstack application APIs.

## 6 JMX Test Plans

1. **`1_register.jmx`**: Tests the user registration API (`POST /user/register`) with randomly generated dealer accounts.
2. **`2_login.jmx`**: Tests the dealer login API (`POST /user/dealer-login`) using the seeded dealer account `sales@premiumauto.com` / `dealer123`.
3. **`3_get_cars.jmx`**: Tests the public catalog fetching API (`GET /inventory/public/cars`).
4. **`4_add_car.jmx`**: Performance tests the inventory add car endpoint (`POST /inventory/add-car`). It automatically logs in, extracts the JWT, and submits a new car creation payload.
5. **`5_edit_car.jmx`**: Tests the inventory update car endpoint (`PATCH /inventory/edit-car/:id`). It dynamically logs in, adds a temporary car to get a valid Mongo ID, and updates it.
6. **`6_delete_car.jmx`**: Tests the inventory delete car endpoint (`DELETE /inventory/delete-car/:id`). It logs in, creates a temporary car, and performs a deletion of that specific car.

---

## How to Run the Tests

Make sure the backend server is running on `http://localhost:4000`.

### 1. In JMeter GUI Mode (Recommended)
1. Open the Apache JMeter application.
2. Open any `.jmx` file via **File > Open**.
3. Set the desired thread count, ramp-up time, and loop count in the **Thread Group**.
4. Click the green **Start** button to run.
5. Select **View Results Tree** inside the plan to verify request details, response headers, response codes, and bodies.

### 2. In JMeter CLI Mode (Non-GUI)
Run the following command in your terminal to execute a test plan and save results to a `.jtl` file:

```bash
jmeter -n -t <test_plan_name>.jmx -l results.jtl
```

To run a test plan and generate a graphical HTML report dashboard:

```bash
jmeter -n -t 1_register.jmx -l results.jtl -e -o ./report
```
