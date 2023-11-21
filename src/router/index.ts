// Composables
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/colecoes',
  },
  {
    path: '/colecoes',
    children: [
      {
        name: 'list-collections',
        path: '',
        component: () => import('@/views/collection/List.vue'),
      },
      {
        name: 'create-collection',
        path: 'criar',
        component: () => import('@/views/collection/Create.vue'),
      },
      {
        name: 'collection-details',
        path: ':id',
        component: () => import('@/views/collection/Details.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
