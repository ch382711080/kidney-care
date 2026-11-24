import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    tab?: boolean
    description?: string
    icon?: string
  }
}

export {}
