// https://docs.cypress.io/api/introduction/api.html
const faker = require("faker");

describe("Contact list", () => {
  beforeEach(() => {
    cy.server();
    cy.route(
      "https://jsonplaceholder.typicode.com/users",
      "fixture:users.json"
    ).as("loadContacts");
    cy.clearLocalStorage();
    cy.visit("/");
    cy.wait(["@loadContacts"]);
  });

  it("Should show a table with the contacts", () => {
    cy.get("tbody tr")
      .its("length")
      .should("be.gte", 9);
  });

  it("Should show the details of one contact", () => {
    cy.get(".chevron-cell:first > a").click();
    cy.get("tr.detail")
      .its("length")
      .should("be.eq", 1);
  });

  it("Should create one contact", () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    cy.contains("Add contact").click();
    cy.get('form[name="contact"]').should("be.visible");

    cy.get(".tabs li:nth-child(1) > a").click();
    cy.get("#contact_name").type(firstName + " " + lastName);
    cy.get("#contact_username").type(
      faker.internet.userName(firstName, lastName)
    );
    cy.get("#contact_email").type(faker.internet.email(firstName, lastName));
    cy.get("#contact_phone").type(faker.phone.phoneNumber("####-####"));
    cy.get("#contact_website").type(faker.internet.url());

    cy.get(".tabs li:nth-child(2) > a").click();
    cy.get("#contact_address_street").type(faker.address.streetAddress());
    cy.get("#contact_address_suite").type(faker.address.secondaryAddress());
    cy.get("#contact_address_city").type(faker.address.city());
    cy.get("#contact_address_zipCode").type(faker.address.zipCode("######"));
    cy.get("#contact_address_geo_lat").type(faker.address.latitude());
    cy.get("#contact_address_geo_lng").type(faker.address.longitude());

    cy.get(".tabs li:nth-child(3) > a").click();
    cy.get("#contact_company_name").type(faker.company.companyName());
    cy.get("#contact_company_catchPhrase").type(faker.company.catchPhrase());
    cy.get("#contact_company_bs").type(faker.company.bs());

    cy.get("button")
      .contains("Create")
      .click();

    cy.get("tbody tr:last").contains(firstName);
  });

  it("Should update one contact", () => {
    const phoneNumber = faker.phone.phoneNumber("####-####");
    const website = faker.internet.url();
    const zipCode = faker.address.zipCode("######");

    cy.get(".chevron-cell:first > a").click();
    cy.contains("button", "Update").click();
    cy.contains(/Update \w+ info/).should("be.visible");

    cy.get(".tabs li:nth-child(1) > a").click();
    cy.get("#contact_phone")
      .clear()
      .type(phoneNumber);
    cy.get("#contact_website")
      .clear()
      .type(website);

    cy.get(".tabs li:nth-child(2) > a").click();
    cy.get("#contact_address_zipCode")
      .clear()
      .type(zipCode);
    cy.get(".tabs li:nth-child(3) > a").click();
    cy.get("#contact_company_bs")
      .clear()
      .type(faker.company.bs());

    cy.get('form[name="contact"]').submit();

    cy.contains('[data-label="Phone number"]:first', phoneNumber);
    cy.get("tr.detail").contains(website);
  });

  it("Should delete one contact", () => {
    cy.get(".chevron-cell:first > a").click();
    cy.contains("Remove").click();
    cy.get("tbody tr")
      .its("length")
      .should("be.eq", 8);
  });
});
