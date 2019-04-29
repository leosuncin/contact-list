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

    cy.getByText(/Add contact/i)
      .click()
      .getByText(/Create contact/i)
      .should("be.visible");

    cy.getByText(/Basic/i)
      .click()
      .getByLabelText(/Full name/i)
      .type(`${firstName} ${lastName}`)
      .getByLabelText(/Username/i)
      .type(faker.internet.userName(firstName, lastName))
      .getByLabelText(/e-mail/i)
      .type(faker.internet.email(firstName, lastName))
      .getByLabelText(/Phone Number/i)
      .type(faker.phone.phoneNumber("####-####"))
      .getByLabelText(/website/i)
      .type(faker.internet.url());

    cy.getByText(/Address/i)
      .click()
      .getByLabelText(/Street/i)
      .type(faker.address.streetAddress())
      .getByLabelText(/Suite/i)
      .type(faker.address.secondaryAddress())
      .getByLabelText(/City/i)
      .type(faker.address.city())
      .getByLabelText(/Zip Code/i)
      .type(faker.address.zipCode("######"))
      .getByPlaceholderText(/latitude/i)
      .type(faker.address.latitude())
      .getByPlaceholderText(/longitude/i)
      .type(faker.address.longitude());

    cy.getByText(/Company/i)
      .click()
      .getByLabelText(/^Name/i)
      .type(faker.company.companyName())
      .getByLabelText(/Catch Phrase/i)
      .type(faker.company.catchPhrase())
      .getByLabelText(/Business/i)
      .type(faker.company.bs());

    cy.getByText(/Create/i, { selector: "button" }).click();

    cy.get(".pagination .pagination-next").click();

    cy.getByText(RegExp(`${firstName} ${lastName}`, "i")).should("be.visible");
  });

  it("Should update one contact", () => {
    const phoneNumber = faker.phone.phoneNumber("####-####");
    const website = faker.internet.url();
    const zipCode = faker.address.zipCode("######");
    const business = faker.company.bs();

    cy.get(".chevron-cell:first > a")
      .click()
      .getByText(/^Update/i)
      .click()
      .getByText(/Update \w+ info/)
      .should("be.visible");

    cy.getByText(/Basic/i)
      .click()
      .getByLabelText(/^phone/i)
      .clear()
      .type(phoneNumber)
      .getByLabelText(/^website/i)
      .clear()
      .type(website);

    cy.getByText(/Address/i)
      .click()
      .getByLabelText(/Zip Code/i)
      .clear()
      .type(zipCode);

    cy.getByText(/Company/i)
      .click()
      .getByLabelText(/Business/i)
      .clear()
      .type(business);

    cy.getByText(/^Edit/i).click();

    cy.contains('[data-label="Phone number"]:first', phoneNumber)
      .get("tr.detail")
      .contains(website);
  });

  it("Should delete one contact", () => {
    cy.get(".chevron-cell:first > a")
      .click()
      .getByText(/^Remove/)
      .click()
      .get("tbody tr")
      .its("length")
      .should("be.eq", 8);
  });
});
