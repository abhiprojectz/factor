<template>
  <div class="app-manager" :class="vis ? 'show-mobile' : 'standard'">
    <div class="manager-area manager-header">
      <brand-area mode="brand" />
      <mobile-toggle :vis.sync="vis" class="show-mobile" />
    </div>
    <div class="manager-area manager-content">
      <nav-handler />
    </div>
    <brand-area
      mode="account"
      class="manager-area manager-footer"
      :active="active == 'account'"
      @click="active = 'account'"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { currentUser } from "@factor/user"
export default Vue.extend({
  components: {
    navHandler: () => import("./nav.vue"),
    brandArea: () => import("./brand.vue"),
    mobileToggle: () => import("./mobile-toggle.vue"),
  },

  data() {
    return {
      mobileVisible: false,
      active: "",
      vis: false,
    }
  },
  watch: {},
  methods: {
    currentUser,

    getUser(this: any, field: string) {
      if (!field) {
        return this.currentUser
      }
      return this.currentUser ? this.currentUser[field] : undefined
    },
  },
})
</script>
<style lang="less">
.app-manager {
  background: #fff;
  height: 100vh;
  display: grid;
  grid-template-rows: minmax(3rem, auto) 1fr minmax(4rem, auto);
  grid-gap: 1rem;
  overflow: auto;
  padding: 0.5rem;
  position: relative;
  border-right: 1px solid var(--panel-border-color);
  .manager-area {
    min-width: 0;
  }
  .manager-content {
    min-width: 0;
    min-height: 0;
    overflow: auto;
  }

  .show-mobile {
    display: none;
  }
  @media (max-width: 900px) {
    height: auto;
    display: block;
    border-bottom: 1px solid var(--panel-border-color);
    .show-mobile {
      display: block;
    }
    .manager-header {
      display: grid;
      grid-template-columns: 1fr 5rem;
    }

    .manager-footer,
    .manager-content {
      display: none;
    }

    &.show-mobile {
      max-height: 90vh;
      border-bottom: none;
      box-shadow: var(--menu-shadow);
      display: grid;
      .manager-footer,
      .manager-content {
        display: block;
      }
    }
  }
}
</style>
