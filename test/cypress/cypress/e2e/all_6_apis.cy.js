describe("Cars_24 Master E2E Suite - All 6 APIs/Scenarios in One Session", () => {
  const uniqueEmail = `cy_dealer_${Date.now()}@test.com`;
  const password = "dealer123";
  const carTitle = `Cypress E2E Master Car ${Date.now()}`;

  it("should execute all 6 API scenarios sequentially in a single session", () => {
    cy.clearLocalStorage();

    // ----------------------------------------------------
    // Scenario 1: User Registration (/user/register)
    // ----------------------------------------------------
    cy.log("Step 1: User/Dealer Registration");
    cy.visit("/register");
    cy.get('input[name="name"]').type("Cypress Master Automator");
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type(password);
    cy.get('input[placeholder="Confirm Password"]').type(password);
    cy.get('select[name="role"]').select("dealer");

    cy.get("button.register-button").click();
    cy.url().should("include", "/login");

    // ----------------------------------------------------
    // Scenario 2: Dealer Login (/user/dealer-login)
    // ----------------------------------------------------
    cy.log("Step 2: Dealer Login");
    cy.visit("/dealer-login");
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dealers");

    // ----------------------------------------------------
    // Scenario 3: Get Public Cars Catalog (/inventory/public/cars)
    // ----------------------------------------------------
    cy.log("Step 3: Get Cars Catalog");
    cy.visit("/dealers");
    cy.get("h2").contains("All Cars").should("be.visible");
    cy.get(".main").should("be.visible");
    cy.get(".main").find(".carImage").should("have.length.at.least", 1);

    // ----------------------------------------------------
    // Scenario 4: Add Car to Inventory (/inventory/add-car)
    // ----------------------------------------------------
    cy.log("Step 4: Add Car");
    cy.visit("/add-car", {
      onBeforeLoad(win) {
        Object.defineProperty(win, "cloudinary", {
          configurable: true,
          get() {
            return {
              createUploadWidget: (options, callback) => {
                return {
                  open: () => {
                    callback(null, {
                      event: "success",
                      info: { secure_url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=2070" }
                    });
                  },
                  destroy: () => {}
                };
              }
            };
          },
          set() {} // Ignore any attempts by the real SDK script to overwrite it
        });
      }
    });

    // Click upload widget FIRST to set image state
    cy.get("#upload_widget").click();
    cy.get('input[name="image"]').should("have.value", "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=2070");

    // Search and select model
    cy.get('input[placeholder*="Type to search"]').type("City");
    cy.get(".search-div .card").first().click();

    // Fill details
    cy.get('input[name="title"]').type(carTitle);
    cy.get('textarea[name="description"]').type("A beautiful sedan in pristine condition, fully automated by Cypress in one session.");
    cy.get('input[name="price"]').type("3100000");
    cy.get('input[name="kmOnOdometer"]').type("12000");
    cy.get('input[name="majorScratches"]').type("None");
    cy.get('input[name="accidentsReported"]').type("0");
    cy.get('input[name="previousBuyers"]').type("1");
    cy.get('input[name="registrationPlace"]').type("Mumbai");
    cy.get('select[name="originalPaint"]').select("Yes");

    // Submit
    cy.get("button").contains("ADD").click();
    cy.url().should("include", "/dealer-cars");

    // ----------------------------------------------------
    // Scenario 5: Edit Car Details (/inventory/edit-car/:id)
    // ----------------------------------------------------
    cy.log("Step 5: Edit Car Details");
    cy.visit("/dealers");
    cy.get(".main .carImage").should("have.length.at.least", 1);

    // Navigate to My Cars via link (preserves state)
    cy.get("a").contains("My Cars").click();

    // Open Edit Car page for our newly created car
    cy.contains("h3", carTitle)
      .parent()
      .within(() => {
        cy.get("button").contains("Edit Car").click();
      });

    cy.get('input[name="price"]').should("have.value", "3100000");

    // Edit fields
    cy.get('input[name="price"]').clear().type("3250000");
    cy.get('textarea[name="description"]').clear().type("Updated car description by Cypress E2E in single session");

    // Click submit
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dealer-cars");

    // ----------------------------------------------------
    // Scenario 6: Delete Car (/inventory/delete-car/:id)
    // ----------------------------------------------------
    cy.log("Step 6: Delete Car");
    cy.visit("/dealer-cars");
    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(true);
    });
    cy.contains("h3", carTitle).should("be.visible");

    // Trigger Delete Car button click
    cy.contains("h3", carTitle)
      .parent()
      .within(() => {
        cy.get("button").contains("Delete Car").click();
      });

    // Verify it is removed
    cy.contains("h3", carTitle).should("not.exist");
  });
});
