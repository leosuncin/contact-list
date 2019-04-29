import * as faker from "faker";
import { Selector, RequestMock } from "testcafe";
import {
  getByText,
  getByLabelText,
  getByPlaceholderText,
  addTestcafeTestingLibrary
} from "testcafe-testing-library";

import users from "../e2e/fixtures/users.json";

const baseUrl = process.env.BASE_URL || "http://localhost:8080";
const mockUsers = RequestMock() // eslint-disable-line no-unused-vars
  .onRequestTo("https://jsonplaceholder.typicode.com/users")
  .respond(users, 200, {
    "access-control-allow-credentials": true,
    "access-control-allow-origin": "*",
    "content-type": "application/json; charset=utf-8"
  });
/* global fixture */
fixture("Contact List")
  .page(baseUrl)
  .requestHooks(mockUsers)
  .beforeEach(async t => {
    addTestcafeTestingLibrary(t);
    await t.eval(() => localStorage.clear());
  });

test("Should show a table with the contacts", async t => {
  await t.expect(Selector("tbody tr").count).gte(9);
});

test("Should show the details of one contact", async t => {
  await t.click(".chevron-cell:first-of-type > a");

  await t.expect(Selector("tr.detail").count).eql(1);
});

test("Should create one contact", async t => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  await t.click(getByText(/Add contact/i));
  await t.expect(getByText(/Create contact/i).visible).ok();

  await t
    .click(getByText(/Basic/i))
    .typeText(getByLabelText(/Full name/i), firstName + " " + lastName)
    .typeText(
      getByLabelText(/Username/i),
      faker.internet.userName(firstName, lastName, "example.com")
    )
    .typeText(
      getByLabelText(/e-mail/i),
      faker.internet.email(firstName, lastName)
    )
    .typeText(
      getByLabelText(/Phone Number/i),
      faker.phone.phoneNumber("####-####")
    )
    .typeText(getByLabelText(/website/i), faker.internet.url());

  await t
    .click(getByText(/Address/i))
    .typeText(getByLabelText(/Street/i), faker.address.streetAddress())
    .typeText(getByLabelText(/Suite/i), faker.address.secondaryAddress())
    .typeText(getByLabelText(/City/i), faker.address.city())
    .typeText(getByLabelText(/Zip Code/i), faker.address.zipCode("######"))
    .typeText(getByPlaceholderText(/latitude/i), faker.address.latitude())
    .typeText(getByPlaceholderText(/longitude/i), faker.address.longitude());

  await t
    .click(getByText(/Company/i))
    .typeText(getByLabelText(/^Name/i), faker.company.companyName())
    .typeText(getByLabelText(/Catch Phrase/i), faker.company.catchPhrase())
    .typeText(getByLabelText(/Business/i), faker.company.bs());

  await t.click(getByText(/Create/i, { selector: "button" }));

  await t.click(".pagination .pagination-next");

  await t
    .expect(getByText(RegExp(`^${firstName} ${lastName}$`, "i")).visible)
    .ok();
});

test("Should update one contact", async t => {
  const phoneNumber = faker.phone.phoneNumber("####-####");
  const website = faker.internet.url();
  const zipCode = faker.address.zipCode("######");
  const business = faker.company.bs();
  const options = { replace: true };

  await t.click(".chevron-cell:first-of-type > a");

  await t
    .click(getByText(/^Update/i))
    .expect(getByText(/Update \w+ info/).visible)
    .ok();

  await t
    .click(getByText(/Basic/i))
    .typeText(getByLabelText(/^phone/i), phoneNumber, options)
    .typeText(getByLabelText(/^website/i), website, options);

  await t
    .click(getByText(/Address/i))
    .typeText(getByLabelText(/Zip Code/i), zipCode, options);

  await t
    .click(getByText(/Company/i))
    .typeText(getByLabelText(/Business/i), business, options);

  await t.click(getByText(/^Edit/i));

  await t
    .expect(
      Selector('[data-label="Phone number"]').withText(phoneNumber).exists
    )
    .ok();
  await t.expect(Selector("tr.detail").innerText).contains(website);
});

test("Should delete one contact", async t => {
  await t
    .click(".chevron-cell:first-of-type > a")
    .click(getByText(/^Remove/))
    .expect(Selector("tbody tr").count)
    .eql(8);
});
