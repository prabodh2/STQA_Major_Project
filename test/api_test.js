const assert = require("assert");

const BASE_URL = "http://localhost:4000";

async function runApiTests() {
  console.log("==========================================");
  console.log("STARTING DIRECT REST API TESTING (6 ENDPOINTS)");
  console.log("==========================================\n");

  const uniqueEmail = `api_dealer_${Date.now()}@test.com`;
  const password = "dealer123";
  let token = "";
  let createdCarId = "";

  try {
    // 1. POST /user/register
    console.log("1. Testing POST /user/register...");
    const registerRes = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: uniqueEmail,
        password: password,
        name: "API Test Dealer",
        role: "dealer"
      })
    });
    const registerData = await registerRes.json();
    assert.strictEqual(registerRes.status, 200, `Register failed: ${JSON.stringify(registerData)}`);
    assert.ok(registerData.user, "Response should contain user details");
    console.log(`✅ Registration Successful! Registered Email: ${uniqueEmail}`);

    // 2. POST /user/dealer-login
    console.log("\n2. Testing POST /user/dealer-login...");
    const loginRes = await fetch(`${BASE_URL}/user/dealer-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: uniqueEmail,
        password: password
      })
    });
    const loginData = await loginRes.json();
    assert.strictEqual(loginRes.status, 200, `Login failed: ${JSON.stringify(loginData)}`);
    assert.ok(loginData.token, "Response should contain auth token");
    token = loginData.token;
    console.log("✅ Login Successful! Token retrieved.");

    // 3. GET /inventory/public/cars
    console.log("\n3. Testing GET /inventory/public/cars...");
    const getCarsRes = await fetch(`${BASE_URL}/inventory/public/cars`);
    const getCarsData = await getCarsRes.json();
    assert.strictEqual(getCarsRes.status, 200, `Get cars failed: ${JSON.stringify(getCarsData)}`);
    assert.strictEqual(getCarsData.status, "success", "Response status should be success");
    assert.ok(Array.isArray(getCarsData.data), "Response data should be an array");
    console.log(`✅ Get Public Cars Successful! Found ${getCarsData.data.length} cars.`);

    // 4. POST /inventory/add-car
    console.log("\n4. Testing POST /inventory/add-car...");
    const addCarRes = await fetch(`${BASE_URL}/inventory/add-car`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title: "API Automated Test Car",
        description: "A car added programmatically during API testing.",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=2070",
        price: 2800000,
        kmOnOdometer: 12000,
        majorScratches: "None",
        originalPaint: "Yes",
        accidentsReported: 0,
        previousBuyers: 1,
        registrationPlace: "Bangalore",
        oemSpecs: {
          colors: ["Silver", "Black"],
          mileage: 14,
          model: "City",
          brand: "Honda"
        }
      })
    });
    const addCarData = await addCarRes.json();
    assert.strictEqual(addCarRes.status, 200, `Add car failed: ${JSON.stringify(addCarData)}`);
    assert.ok(addCarData.car && addCarData.car._id, "Response should contain the added car details");
    createdCarId = addCarData.car._id;
    console.log(`✅ Add Car Successful! Created Car ID: ${createdCarId}`);

    // 5. PATCH /inventory/edit-car/:id
    console.log(`\n5. Testing PATCH /inventory/edit-car/${createdCarId}...`);
    const editCarRes = await fetch(`${BASE_URL}/inventory/edit-car/${createdCarId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        price: 2900000,
        description: "Updated description via API testing."
      })
    });
    const editCarData = await editCarRes.json();
    assert.strictEqual(editCarRes.status, 200, `Edit car failed: ${JSON.stringify(editCarData)}`);
    assert.strictEqual(editCarData.car.price, 2900000, "Price should have been updated to 2900000");
    console.log("✅ Edit Car Successful! Price and description updated.");

    // 6. DELETE /inventory/delete-car/:id
    console.log(`\n6. Testing DELETE /inventory/delete-car/${createdCarId}...`);
    const deleteCarRes = await fetch(`${BASE_URL}/inventory/delete-car/${createdCarId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const deleteCarData = await deleteCarRes.json();
    assert.strictEqual(deleteCarRes.status, 200, `Delete car failed: ${JSON.stringify(deleteCarData)}`);
    console.log("✅ Delete Car Successful! Car removed from inventory.");

    console.log("\n==========================================");
    console.log("🎉 ALL 6 REST API TESTS PASSED SUCCESSFULLY!");
    console.log("==========================================");
  } catch (error) {
    console.error("\n❌ REST API Test Suite Failed:", error);
    process.exit(1);
  }
}

runApiTests();
