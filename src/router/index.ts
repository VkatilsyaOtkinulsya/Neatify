import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import type { AuthToken } from '@/features/auth/types/auth.types';

const routes: RouteRecordRaw[] = [
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/pages/Auth/SignUp.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('@/pages/Auth/SignIn.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/',
    component: () => import('@/pages/Main/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'main',
        name: 'main',
        component: () => import('@/pages/Main/Home.vue'),
      },
      {
        path: 'spaces/:workspaceId',
        component: () => import('@/pages/Spaces/WorkspaceLayout.vue'),
        props: true,
        meta: { requiresAuth: true },
        children: [
          {
            path: 'projects',
            name: 'workspace-projects',
            component: () => import('@/modules/Space/SpaceProjects.vue'),
            props: true,
          },
          {
            path: ':projectId',
            component: () => import('@/modules/Project/ProjectDetails.vue'),
            children: [
              {
                path: '',
                redirect: (to) => ({
                  name: 'review',
                  params: to.params,
                }),
              },
              {
                path: 'review',
                name: 'review',
                component: () => import('@/modules/Review/Review.vue'),
              },
              {
                path: 'board',
                name: 'board',
                component: () => import('@/features/board/components/Board.vue'),
              },
              {
                path: 'table',
                name: 'table',
                component: () => import('@/modules/Table/Table.vue'),
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: '/account',
    component: () => import('@/pages/ClientProfile.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/signup',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, _from, next) => {
  const tokens = JSON.parse(localStorage.getItem('userTokens') || '{}') as AuthToken;
  const isAutheticated: boolean = !!tokens.accessToken;

  if (to.meta.requiresAuth && !isAutheticated) {
    next({ name: 'signin' });
  } else if ((to.name === 'signin' || to.name === 'signup') && isAutheticated) {
    next({ name: 'main' });
  } else {
    next();
  }
});

export default router;
