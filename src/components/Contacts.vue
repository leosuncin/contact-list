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
              <div class="buttons is-pulled-right">
                <button
                  class="button is-info"
                  @click="
                    (showFormContactModal = true),
                      (action = 'Edit'),
                      (currentUser = Object.assign({}, props.row))
                  "
                >
                  Edit {{ props.row.username }}
                </button>
                <button
                  class="button is-danger"
                  @click="
                    contacts = contacts.filter(
                      contact => contact.id !== props.row.id
                    )
                  "
                >
                  Remove {{ props.row.username }}
                </button>
              </div>
            </div>
          </div>
        </article>
      </template>
      <template slot="footer">
        <button
          class="button is-primary is-pulled-right"
          @click="(showFormContactModal = true), (action = 'Create')"
        >
          Add contact
        </button>
      </template>
    </b-table>
    <b-modal :active.sync="showFormContactModal" has-modal-card ref="parent">
      <form name="contact" @submit.prevent="submitContact">
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title" v-if="action === 'Create'">
              Create contact
            </p>
            <p class="modal-card-title" v-if="action === 'Edit'">
              Update {{ currentUser.username }} info
            </p>
          </header>
          <section class="modal-card-body">
            <b-tabs type="is-boxed" animated>
              <b-tab-item label="Basic" icon="account">
                <b-field label="Full name" horizontal>
                  <b-input v-model="currentUser.name" required />
                </b-field>
                <b-field label="Username" horizontal>
                  <b-input
                    v-model="currentUser.username"
                    required
                    patter="\\w+"
                  />
                </b-field>
                <b-field label="e-mail" horizontal>
                  <b-input type="email" v-model="currentUser.email" required />
                </b-field>
                <b-field label="Phone Number" horizontal>
                  <b-input
                    v-model="currentUser.phone"
                    required
                    pattern="[0-9]+(-?[0-9]+)*"
                  />
                </b-field>
                <b-field label="Website" horizontal>
                  <b-input type="url" v-model="currentUser.website" required />
                </b-field>
              </b-tab-item>
              <b-tab-item label="Address" icon="home">
                <b-field horizontal label="Street">
                  <b-input v-model="currentUser.address.street" required />
                </b-field>
                <b-field horizontal label="Suite">
                  <b-input v-model="currentUser.address.suite" required />
                </b-field>
                <b-field horizontal label="City">
                  <b-input v-model="currentUser.address.city" required />
                </b-field>
                <b-field horizontal label="Zip Code">
                  <b-input
                    type="number"
                    v-model="currentUser.address.zipcode"
                    required
                  />
                </b-field>
                <b-field label="Position" grouped>
                  <b-input
                    type="number"
                    v-model="currentUser.address.geo.lat"
                    placeholder="Latitude"
                    required
                  />
                  <b-input
                    type="number"
                    v-model="currentUser.address.geo.lng"
                    placeholder="Longitude"
                    required
                  />
                </b-field>
              </b-tab-item>
              <b-tab-item label="Company" icon="factory">
                <b-field horizontal label="Name">
                  <b-input
                    v-model="currentUser.company.name"
                    required="required"
                  />
                </b-field>
                <b-field horizontal label="Catch Phrase">
                  <b-input
                    v-model="currentUser.company.catchPhrase"
                    required="required"
                  />
                </b-field>
                <b-field horizontal label="Business">
                  <b-input
                    v-model="currentUser.company.bs"
                    required="required"
                  />
                </b-field>
              </b-tab-item>
            </b-tabs>
          </section>
          <footer class="modal-card-foot">
            <button class="button" type="button" @click="$refs.parent.close()">
              Cancel
            </button>
            <button class="button is-primary">{{ action }}</button>
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
      showFormContactModal: false,
      currentUser: initialUser,
      action: ""
    };
  },
  methods: {
    async loadContacts() {
      try {
        const json = localStorage.getItem("contacts") || "[]";
        this.contacts = JSON.parse(json) || [];
      } catch (error) {
        this.contacts = [];
      }

      try {
        if (!Array.isArray(this.contacts) || this.contacts.length < 1) {
          const resp = await this.$http.get(
            "https://jsonplaceholder.typicode.com/users"
          );

          if (resp.status === 200) {
            this.contacts = resp.body;
          }
        }
      } catch (error) {
        this.contacts = [];
      } finally {
        this.loading = false;
      }
    },
    toggleRow(id) {
      this.$refs.table.toggleDetails(id);
    },
    submitContact() {
      if (!this.currentUser.id) {
        const id =
          this.contacts.reduce(
            (max, current) => (max = current.id > max ? current.id : max),
            Number.MIN_SAFE_INTEGER
          ) + 1;
        this.contacts = [...this.contacts, { id, ...this.currentUser }];
      } else {
        this.contacts = this.contacts.map(contact =>
          contact.id === this.currentUser.id ? this.currentUser : contact
        );
      }
      this.$toast.open({
        message:
          this.action === "Create"
            ? "Contact created"
            : `${this.currentUser.username}'s info was updated`,
        type: "is-success"
      });
      this.$refs.parent.close();
      this.currentUser = initialUser;
    }
  },
  beforeMount() {
    this.loadContacts();
  },
  watch: {
    contacts(newVal) {
      localStorage.setItem("contacts", JSON.stringify(newVal));
    }
  }
};
</script>
