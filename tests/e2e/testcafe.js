import * as faker from "faker";
import { Selector, RequestMock } from "testcafe";
import {
  getByText,
  getByLabelText,
  getByPlaceholderText,
  addTestcafeTestingLibrary
} from "testcafe-testing-library";

import users from "./fixtures/users.json";

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

  await t.click(getByText(/Basic/i));
  await t.typeText(getByLabelText(/Full name/i), firstName + " " + lastName);
  await t.typeText(
    getByLabelText(/Username/i),
    faker.internet.userName(firstName, lastName)
  );
  await t.typeText(
    getByLabelText(/e-mail/i),
    faker.internet.email(firstName, lastName)
  );
  await t.typeText(
    getByLabelText(/Phone Number/i),
    faker.phone.phoneNumber("####-####")
  );
  await t.typeText(getByLabelText(/website/i), faker.internet.url());

  await t.click(getByText(/Address/i));

  await t.typeText(getByLabelText(/Street/i), faker.address.streetAddress());
  await t.typeText(getByLabelText(/Suite/i), faker.address.secondaryAddress());
  await t.typeText(getByLabelText(/City/i), faker.address.city());
  await t.typeText(
    getByLabelText(/Zip Code/i),
    faker.address.zipCode("######")
  );
  await t.typeText(getByPlaceholderText(/latitude/i), faker.address.latitude());
  await t.typeText(
    getByPlaceholderText(/longitude/i),
    faker.address.longitude()
  );

  await t.click(getByText(/Company/i));
  await t.typeText(getByLabelText(/^Name/i), faker.company.companyName());
  await t.typeText(
    getByLabelText(/Catch Phrase/i),
    faker.company.catchPhrase()
  );
  await t.typeText(getByLabelText(/Business/i), faker.company.bs());

  await t.click(getByText(/Create/i, { selector: "button" }));

  await t.click(".pagination .pagination-next");

  await t
    .expect(getByText(RegExp(`${firstName} ${lastName}`, "i")).visible)
    .ok();
});

test("Should update one contact", async t => {
  const phoneNumber = faker.phone.phoneNumber("####-####");
  const website = faker.internet.url();
  const zipCode = faker.address.zipCode("######");
  const business = faker.company.bs();
  const options = { replace: true };

  await t.click(".chevron-cell:first-of-type > a");

  await t.click(getByText(/^Update/i));
  await t.expect(getByText(/Update \w+ info/).visible).ok();

  await t.click(getByText(/Basic/i));
  await t.typeText(getByLabelText(/^phone/i), phoneNumber, options);
  await t.typeText(getByLabelText(/^website/i), website, options);

  await t.click(getByText(/Address/i));
  await t.typeText(getByLabelText(/Zip Code/i), zipCode, options);

  await t.click(getByText(/Company/i));
  await t.typeText(getByLabelText(/Business/i), business, options);

  await t.click(getByText(/^Edit/i));

  await t
    .expect(
      Selector('[data-label="Phone number"]').withText(phoneNumber).exists
    )
    .ok();
  await t.expect(Selector("tr.detail").innerText).contains(website);
});

test("Should delete one contact", async t => {
  await t.click(".chevron-cell:first-of-type > a");
  await t.click(getByText(/^Remove/));
  await t.expect(Selector("tbody tr").count).eql(8);
});
