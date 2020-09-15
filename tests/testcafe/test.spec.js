import * as faker from "faker";
import { RequestMock } from "testcafe";
import {
  getAllByRole,
  getByLabelText,
  getByPlaceholderText,
  getByRole,
  getByText,
  within,
} from "@testing-library/testcafe";

import users from "../e2e/fixtures/users.json";

const baseUrl = process.env.BASE_URL || "http://localhost:8080";
const mockUsers = RequestMock()
  .onRequestTo("https://jsonplaceholder.typicode.com/users")
  .respond(users, 200, {
    "access-control-allow-credentials": true,
    "access-control-allow-origin": "*",
    "content-type": "application/json; charset=utf-8",
  });

fixture("Contact List")
  .page(baseUrl)
  .requestHooks(mockUsers)
  .beforeEach(async t => {
    await t.eval(() => localStorage.clear());
  });

test("Should show a table with the contacts", async t => {
  await t.expect(getAllByRole("row").count).gte(9);
});

test("Should show the details of one contact", async t => {
  await t.click(within(getAllByRole("row").nth(1)).getByRole("button"));

  await t.expect(getByRole("article").visible).ok();
});

test("Should create one contact", async t => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  await t.click(getByRole("button", { name: /Add contact/i }));
  await t.expect(getByText(/Create contact/i).visible).ok();

  await t
    .click(getByText(/Basic/i))
    .typeText(getByLabelText(/Full name/i), firstName + " " + lastName)
    .typeText(
      getByLabelText(/Username/i),
      faker.internet.userName(firstName, lastName, "example.com"),
    )
    .typeText(
      getByLabelText(/e-mail/i),
      faker.internet.email(firstName, lastName),
    )
    .typeText(
      getByLabelText(/Phone Number/i),
      faker.phone.phoneNumber("####-####"),
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

  await t.click(getByRole("button", { name: /Create/i }));

  await t
    .expect(
      getByRole("row", { name: RegExp(`${firstName} ${lastName}`, "i") })
        .visible,
    )
    .ok();
});

test("Should update one contact", async t => {
  const phoneNumber = faker.phone.phoneNumber("####-####");
  const website = faker.internet.url();
  const zipCode = faker.address.zipCode("######");
  const business = faker.company.bs();
  const options = { replace: true };

  await t.click(within(getAllByRole("row").nth(2)).getByRole("button"));

  await t
    .click(getByRole("button", { name: /^Update/i }))
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

  await t.click(getByRole("button", { name: /^Edit/i }));

  await t.expect(getByRole("cell", { name: phoneNumber }).exists).ok();
  await t.expect(getByRole("article").innerText).contains(website);
});

test("Should delete one contact", async t => {
  await t
    .click(within(getAllByRole("row").nth(3)).getByRole("button"))
    .click(getByRole("button", { name: /^Remove/ }))
    .expect(within(getAllByRole("rowgroup").nth(1)).getAllByRole("row").count)
    .eql(8);
});
