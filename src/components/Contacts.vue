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
      <template slot="footer">
        <button
          class="button is-primary is-pulled-right"
          @click="showAddContactModal = true"
        >
          Add contact
        </button>
      </template>
    </b-table>
    <b-modal :active.sync="showAddContactModal" has-modal-card ref="parent">
      <form name="contact" @submit.prevent="addContact">
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Create contact</p>
          </header>
          <section class="modal-card-body">
            <b-tabs type="is-boxed" animated>
              <b-tab-item label="Basic" icon="account">
                <b-field label="Full name" horizontal>
                  <b-input v-model="newUser.name" required />
                </b-field>
                <b-field label="Username" horizontal>
                  <b-input v-model="newUser.username" required patter="\\w+" />
                </b-field>
                <b-field label="e-mail" horizontal>
                  <b-input type="email" v-model="newUser.email" required />
                </b-field>
                <b-field label="Phone Number" horizontal>
                  <b-input
                    v-model="newUser.phone"
                    required
                    pattern="[0-9]+(-?[0-9]+)*"
                  />
                </b-field>
                <b-field label="Website" horizontal>
                  <b-input type="url" v-model="newUser.website" required />
                </b-field>
              </b-tab-item>
              <b-tab-item label="Address" icon="home">
                <b-field horizontal label="Street">
                  <b-input v-model="newUser.address.street" required />
                </b-field>
                <b-field horizontal label="Suite">
                  <b-input v-model="newUser.address.suite" required />
                </b-field>
                <b-field horizontal label="City">
                  <b-input v-model="newUser.address.city" required />
                </b-field>
                <b-field horizontal label="Zip Code">
                  <b-input
                    type="number"
                    v-model="newUser.address.zipcode"
                    required
                  />
                </b-field>
                <b-field label="Position" grouped>
                  <b-input
                    type="number"
                    v-model="newUser.address.geo.lat"
                    placeholder="Latitude"
                    required
                  />
                  <b-input
                    type="number"
                    v-model="newUser.address.geo.lng"
                    placeholder="Longitude"
                    required
                  />
                </b-field>
              </b-tab-item>
              <b-tab-item label="Company" icon="factory">
                <b-field horizontal label="Name">
                  <b-input v-model="newUser.company.name" required="required" />
                </b-field>
                <b-field horizontal label="Catch Phrase">
                  <b-input
                    v-model="newUser.company.catchPhrase"
                    required="required"
                  />
                </b-field>
                <b-field horizontal label="Business">
                  <b-input v-model="newUser.company.bs" required="required" />
                </b-field>
              </b-tab-item>
            </b-tabs>
          </section>
          <footer class="modal-card-foot">
            <button class="button" type="button" @click="$refs.parent.close()">
              Cancel
            </button>
            <button class="button is-primary">Add</button>
          </footer>
        </div>
      </form>
    </b-modal>
  </section>
</template>

<script>
const initialUser = {
  name: "",
  username: "",
  email: "",
  address: {
    street: "",
    suite: "",
    city: "",
    zipcode: "",
    geo: {
      lat: "",
      lng: ""
    }
  },
  phone: "",
  website: "",
  company: {
    name: "",
    catchPhrase: "",
    bs: ""
  }
};

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
          label: "Full name"
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
          label: "Phone number"
        }
      ],
      contacts: [],
      loading: true,
      showAddContactModal: false,
      newUser: initialUser
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
    },
    addContact() {
      const id = this.contacts.reduce(
        (max, current) => (max = current.id > max ? current.id : max),
        Number.MIN_SAFE_INTEGER
      );
      this.contacts = [...this.contacts, { id, ...this.newUser }];
      this.newUser = initialUser;
      this.$toast.open({
        message: "Contact created",
        type: "is-success"
      });
      this.$refs.parent.close();
    }
  },
  beforeMount() {
    this.loadContacts();
  }
};
</script>
