import * as faker from "faker";
import { Selector, RequestMock } from "testcafe";
import * as users from "./fixtures/users.json";

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
  // .requestHooks(mockUsers) /* Esto no funciona */
  .afterEach(async t => {
    await t.eval(() => localStorage.clear());
  });

test("Should show a table with the contacts", async t => {
  await t.expect(Selector("tbody tr").visible).ok();
});

test("Should show the details of one contact", async t => {
  await t.click(".chevron-cell:first-of-type > a");

  await t.expect(Selector("tr.detail").visible).ok();
});

test("Should create one contact", async t => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  await t.click(".table-footer .is-primary");

  await t.expect(Selector('form[name="contact"]').visible).ok();

  await t.click(".tabs li:nth-child(1) > a");

  await t.typeText("#contact_name", firstName + " " + lastName);
  await t.typeText(
    "#contact_username",
    faker.internet.userName(firstName, lastName)
  );
  await t.typeText("#contact_email", faker.internet.email(firstName, lastName));
  await t.typeText("#contact_phone", faker.phone.phoneNumber("####-####"));
  await t.typeText("#contact_website", faker.internet.url());

  await t.click(".tabs li:nth-child(2) > a");

  await t.typeText("#contact_address_street", faker.address.streetAddress());
  await t.typeText("#contact_address_suite", faker.address.secondaryAddress());
  await t.typeText("#contact_address_city", faker.address.city());
  await t.typeText("#contact_address_zipCode", faker.address.zipCode("######"));
  await t.typeText("#contact_address_geo_lat", faker.address.latitude());
  await t.typeText("#contact_address_geo_lng", faker.address.longitude());

  await t.click(".tabs li:nth-child(3) > a");

  await t.typeText("#contact_company_name", faker.company.companyName());
  await t.typeText("#contact_company_catchPhrase", faker.company.catchPhrase());
  await t.typeText("#contact_company_bs", faker.company.bs());

  await t.click(
    Selector(".modal-card")
      .find("button")
      .withText("Create")
  );

  await t.click(".pagination .pagination-next");

  await t
    .expect(Selector("tbody tr:last-of-type").textContent)
    .contains(firstName);
});
