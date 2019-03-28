<template>
  <section class="container">
    <h1 class="title">Contact List</h1>
    <b-table
      :data="contacts"
      :columns="columns"
      :striped="true"
      :mobile-cards="true"
      :loading="loading"
    ></b-table>
  </section>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        {
          field: "id",
          label: "ID",
          numeric: true
        },
        {
          field: "name",
          label: "Name"
        },
        {
          field: "username",
          label: "Username"
        },
        {
          field: "email",
          label: "e-mail"
        },
        {
          field: "phone",
          label: "Phonenumber"
        }
      ],
      contacts: [],
      loading: true
    };
  },
  methods: {
    async loadContacts() {
      const resp = await this.$http.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      this.loading = false;
      if (resp.status === 200) {
        this.contacts = resp.body;
      }
    }
  },
  beforeMount() {
    this.loadContacts();
  }
};
</script>
