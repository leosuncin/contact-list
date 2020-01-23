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

    cy.findByText(/Add contact/i)
      .click()
      .findByText(/Create contact/i)
      .should("be.visible");

    cy.findByText(/Basic/i)
      .click()
      .findByLabelText(/Full name/i)
      .type(`${firstName} ${lastName}`)
      .findByLabelText(/Username/i)
      .type(faker.internet.userName(firstName, lastName))
      .findByLabelText(/e-mail/i)
      .type(faker.internet.email(firstName, lastName))
      .findByLabelText(/Phone Number/i)
      .type(faker.phone.phoneNumber("####-####"))
      .findByLabelText(/website/i)
      .type(faker.internet.url());

    cy.findByText(/Address/i)
      .click()
      .findByLabelText(/Street/i)
      .type(faker.address.streetAddress())
      .findByLabelText(/Suite/i)
      .type(faker.address.secondaryAddress())
      .findByLabelText(/City/i)
      .type(faker.address.city())
      .findByLabelText(/Zip Code/i)
      .type(faker.address.zipCode("######"))
      .findByPlaceholderText(/latitude/i)
      .type(faker.address.latitude())
      .findByPlaceholderText(/longitude/i)
      .type(faker.address.longitude());

    cy.findByText(/Company/i)
      .click()
      .findByLabelText(/^Name/i)
      .type(faker.company.companyName())
      .findByLabelText(/Catch Phrase/i)
      .type(faker.company.catchPhrase())
      .findByLabelText(/Business/i)
      .type(faker.company.bs());

    cy.findByText(/Create/i, { selector: "button" }).click();

    cy.get(".pagination .pagination-next").click();

    cy.findByText(RegExp(`${firstName} ${lastName}`, "i")).should("be.visible");
  });

  it("Should update one contact", () => {
    const phoneNumber = faker.phone.phoneNumber("####-####");
    const website = faker.internet.url();
    const zipCode = faker.address.zipCode("######");
    const business = faker.company.bs();

    cy.get(".chevron-cell:first > a")
      .click()
      .findByText(/^Update/i)
      .click()
      .findByText(/Update \w+ info/)
      .should("be.visible");

    cy.findByText(/Basic/i)
      .click()
      .findByLabelText(/^phone/i)
      .clear()
      .type(phoneNumber)
      .findByLabelText(/^website/i)
      .clear()
      .type(website);

    cy.findByText(/Address/i)
      .click()
      .findByLabelText(/Zip Code/i)
      .clear()
      .type(zipCode);

    cy.findByText(/Company/i)
      .click()
      .findByLabelText(/Business/i)
      .clear()
      .type(business);

    cy.findByText(/^Edit/i).click();

    cy.contains('[data-label="Phone number"]:first', phoneNumber)
      .get("tr.detail")
      .contains(website);
  });

  it("Should delete one contact", () => {
    cy.get(".chevron-cell:first > a")
      .click()
      .findByText(/^Remove/)
      .click()
      .get("tbody tr")
      .its("length")
      .should("be.eq", 8);
  });
});
