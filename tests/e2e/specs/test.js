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

    cy.getByText(/Add contact/i).click();
    cy.getByText(/Create contact/i).to.be("visible");

    cy.getByText(/Basic/i).click();
    cy.getByLabelText(/Full name/i).type(`${firstName} ${lastName}`);
    cy.getByLabelText(/Username/i).type(
      faker.internet.userName(firstName, lastName)
    );
    cy.getByLabelText(/e-mail/i).type(
      faker.internet.email(firstName, lastName)
    );
    cy.getByLabelText(/Phone Number/i).type(
      faker.phone.phoneNumber("####-####")
    );
    cy.getByLabelText(/website/i).type(faker.internet.url());

    cy.getByText(/Address/i).click();
    cy.getByLabelText(/Street/i).type(faker.address.streetAddress());
    cy.getByLabelText(/Suite/i).type(faker.address.secondaryAddress());
    cy.getByLabelText(/City/i).type(faker.address.city());
    cy.getByLabelText(/Zip Code/i).type(faker.address.zipCode("######"));
    cy.getByPlaceholderText(/latitude/i).type(faker.address.latitude());
    cy.getByPlaceholderText(/longitude/i).type(faker.address.longitude());

    cy.getByText(/Company/i).click();
    cy.getByLabelText(/^Name/i).type(faker.company.companyName());
    cy.getByLabelText(/Catch Phrase/i).type(faker.company.catchPhrase());
    cy.getByLabelText(/Business/i).type(faker.company.bs());

    cy.getByText(/Create/i, { selector: "button" }).click();

    cy.get(".pagination .pagination-next").click();

    cy.getByText(RegExp(`${firstName} ${lastName}`, "i")).to.be("visible");
  });

  it("Should update one contact", () => {
    const phoneNumber = faker.phone.phoneNumber("####-####");
    const website = faker.internet.url();
    const zipCode = faker.address.zipCode("######");
    const business = faker.company.bs();

    cy.get(".chevron-cell:first > a").click();
    cy.getByText(/^Update/i).click();
    cy.getByText(/Update \w+ info/).should("be.visible");

    cy.getByText(/Basic/i).click();
    cy.getByLabelText(/^phone/i)
      .clear()
      .type(phoneNumber);
    cy.getByLabelText(/^website/i)
      .clear()
      .type(website);

    cy.getByText(/Address/i).click();
    cy.getByLabelText(/Zip Code/i)
      .clear()
      .type(zipCode);

    cy.getByText(/Company/i).click();
    cy.getByLabelText(/Business/i)
      .clear()
      .type(business);

    cy.getByText(/^Edit/i).click();

    cy.contains('[data-label="Phone number"]:first', phoneNumber);
    cy.get("tr.detail").contains(website);
  });

  it("Should delete one contact", () => {
    cy.get(".chevron-cell:first > a").click();
    cy.getByText(/^Remove/).click();
    cy.get("tbody tr")
      .its("length")
      .should("be.eq", 8);
  });
});
