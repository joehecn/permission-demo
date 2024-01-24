import { createRouter, createWebHistory } from 'vue-router'
import SettingView from '../views/SettingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'setting',
      component: SettingView
    },
    {
      path: '/functional-role',
      name: 'functional-role',
      component: () => import('../views/FunctionalRole.vue')
    },
    {
      path: '/area-tree',
      name: 'area-tree',
      component: () => import('../views/AreaTree.vue')
    },
    {
      path: '/organizational-tree',
      name: 'organizational-tree',
      component: () => import('../views/OrganizationalTree.vue')
    },
    {
      path: '/data-role',
      name: 'data-role',
      component: () => import('../views/DataRole.vue')
    },
    {
      path: '/user',
      name: 'user',
      // route level code-splitting
      // this generates a separate chunk (User.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/UserView.vue')
    },
    {
      path: '/schema',
      name: 'schema',
      component: () => import('../views/SchemaView.vue')
    },
    {
      path: '/policies',
      name: 'policies',
      component: () => import('../views/PoliciesView.vue')
    },
    {
      path: '/policy-templates',
      name: 'policy-templates',
      component: () => import('../views/PolicyTemplates.vue')
    }
  ]
})

export default router
