import { runCallbacks, applyFilters, stored } from "@factor/api"
import { getObservables } from "@factor/app"
import Vue from "vue"
import { Route } from "vue-router"
import { FactorPostState } from "@factor/post/types"
import veil from "./veil.vue"
export default (): any => {
  return Vue.extend({
    data() {
      return {
        scrollClass: "",
      }
    },
    computed: {
      post(): FactorPostState {
        return stored("post")
      },
      ui(this: any): string {
        const { meta = {} } = this.$route.matched.find((_: Route) => _.meta.ui) || {}

        const ui = meta.ui || "app"

        return `factor-${ui}`
      },
      classes(this: any): string[] {
        const observables: Record<string, any> = getObservables()

        // Use observables for classes as these can change at any time
        const siteClasses = applyFilters("observable-class-keys", [])
          .map((_: string) => observables[_])
          .filter((_: any) => _ && Array.isArray(_))
          .map((arr: string[]) => arr.join(" "))
          .join(" ")

        return [siteClasses, this.scrollClass]
      },
      injectedComponents(): Function[] {
        const siteComponents = applyFilters("site-components", [
          {
            name: "veil",
            component: veil,
          },
        ])

        return siteComponents.map(
          (_: { name: string; component: Function }) => _.component
        )
      },
    },

    watch: {
      ui: {
        handler: function (to: string, from: string): void {
          if (typeof document != "undefined") {
            const _el = document.documentElement
            _el.classList.remove(from)
            _el.classList.add(to)
          }
        },
      },
    },
    mounted() {
      this.setScrollClass()
      window.addEventListener("scroll", () => this.setScrollClass())
    },

    async serverPrefetch() {
      await runCallbacks("global-prefetch", this.$route)
      return
    },

    methods: {
      setScrollClass(this: any): void {
        this.scrollClass = window.pageYOffset == 0 ? "top" : "scrolled"
      },
    },
  })
}
