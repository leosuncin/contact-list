<template>
  <section class="container">
    <h1 class="title">Contact List</h1>
    <b-table
      :data="contacts"
      :columns="columns"
      striped
      mobile-cards
      :loading="loading"
      paginated
      per-page="10"
      pagination-simple
      ref="table"
      detailed
      detail-key="id"
      show-detail-icon
    >
      <template slot="detail" slot-scope="props">
        <article class="media">
          <figure class="media-left">
            <p class="image is-64x64">
              <img
                :src="'https://api.adorable.io/avatars/64/' + props.row.email"
              />
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{ props.row.name }}&nbsp;</strong>
                <small>@{{ props.row.username }}&nbsp;</small>
                <small>
                  <b-icon icon="map-marker" size="is-small" />
                  ({{ props.row.address.geo.lat }},
                  {{ props.row.address.geo.lng }})
                </small>
                <b-icon icon="web" size="is-small" />
                <a
                  :href="'//' + props.row.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ props.row.website }}</a
                >
                <br />
                <b-icon icon="home" />
                {{ props.row.address.street }}, {{ props.row.address.suite }}.
                {{ props.row.address.city }}, {{ props.row.address.zipcode }}.
                <br />
                <b-icon icon="factory" />
                {{ props.row.company.name }}
                <q>{{ props.row.company.catchPhrase }}</q>
                <i>&nbsp;{{ props.row.company.bs }}</i>
              </p>
            </div>
          </div>
        </article>
      </template>
    </b-table>
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
    },
    toggleRow(id) {
      this.$refs.table.toggleDetails(id);
    }
  },
  beforeMount() {
    this.loadContacts();
  }
};
</script>
