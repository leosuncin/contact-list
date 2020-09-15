/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />
// https://docs.cypress.io/api/introduction/api.html
const faker = require("faker");

describe("Contact list", () => {
  beforeEach(() => {
    cy.server()
      .route("https://jsonplaceholder.typicode.com/users", "fixture:users.json")
      .as("loadContacts")
      .clearLocalStorage()
      .visit("/")
      .wait(["@loadContacts"]);
  });

  it("Should show a table with the contacts", () => {
    cy.findAllByRole("row").should("have.length.gte", 9);
  });

  it("Should show the details of one contact", () => {
    cy.findAllByRole("row").eq(1).findByRole("button").click();
    cy.findByRole("article").should("exist");
  });

  it("Should create one contact", () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    cy.findByRole("button", { name: /Add contact/i }).click();
    cy.findByText(/Create contact/i).should("be.visible");

    cy.findByText(/Basic/i).click();
    cy.findByLabelText(/Full name/i).type(`${firstName} ${lastName}`);
    cy.findByLabelText(/Username/i).type(
      faker.internet.userName(firstName, lastName)
    );
    cy.findByLabelText(/e-mail/i).type(
      faker.internet.email(firstName, lastName)
    );
    cy.findByLabelText(/Phone Number/i).type(
      faker.phone.phoneNumber("####-####")
    );
    cy.findByLabelText(/website/i).type(faker.internet.url());

    cy.findByText(/Address/i).click();
    cy.findByLabelText(/Street/i).type(faker.address.streetAddress());
    cy.findByLabelText(/Suite/i).type(faker.address.secondaryAddress());
    cy.findByLabelText(/City/i).type(faker.address.city());
    cy.findByLabelText(/Zip Code/i).type(faker.address.zipCode("######"));
    cy.findByPlaceholderText(/latitude/i).type(faker.address.latitude());
    cy.findByPlaceholderText(/longitude/i).type(faker.address.longitude());

    cy.findByText(/Company/i).click();
    cy.findByLabelText(/^Name/i).type(faker.company.companyName());
    cy.findByLabelText(/Catch Phrase/i).type(faker.company.catchPhrase());
    cy.findByLabelText(/Business/i).type(faker.company.bs());

    cy.findByRole("button", { name: /Create/i }).click();

    cy.get(".pagination .pagination-next").click();

    cy.findByRole("row", {
      name: RegExp(`${firstName} ${lastName}`, "i"),
    }).should("be.visible");
  });

  it("Should update one contact", () => {
    const phoneNumber = faker.phone.phoneNumber("####-####");
    const website = faker.internet.url();
    const zipCode = faker.address.zipCode("######");
    const business = faker.company.bs();

    cy.findAllByRole("row").eq(2).findByRole("button").click();
    cy.findByRole("button", { name: /^Update/i }).click();
    cy.findByText(/Update \w+ info/).should("be.visible");

    cy.findByText(/Basic/i).click();
    cy.findByLabelText(/^phone/i)
      .clear()
      .type(phoneNumber);
    cy.findByLabelText(/^website/i)
      .clear()
      .type(website);

    cy.findByText(/Address/i).click();
    cy.findByLabelText(/Zip Code/i)
      .clear()
      .type(zipCode);

    cy.findByText(/Company/i).click();
    cy.findByLabelText(/Business/i)
      .clear()
      .type(business);

    cy.findByText(/^Edit/i).click();

    cy.findByRole("cell", { name: phoneNumber });
    cy.findByRole("article").contains(website);
  });

  it("Should delete one contact", () => {
    cy.findAllByRole("row").eq(3).findByRole("button").click();
    cy.findByRole("button", { name: /^Remove/ }).click();
    cy.findAllByRole("row").should("have.length.gte", 8);
  });
});
