import { createRouter, createWebHistory } from 'vue-router'

const Layout = () => import('../layout/Layout.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Home = () => import('../views/Home.vue')
const Publish = () => import('../views/Publish.vue')
const Message = () => import('../views/Message.vue')
const Mine = () => import('../views/Mine.vue')
const Detail = () => import('../views/Detail.vue')
const OrderConfirm = () => import('../views/OrderConfirm.vue')
const OrderList = () => import('../views/OrderList.vue')
const OrderDetail = () => import('../views/OrderDetail.vue')
const NotFound = () => import('../views/NotFound.vue')

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/', redirect: '/home' },
  {
    path: '/',
    component: Layout,
    children: [
      { path: 'home', component: Home },
      { path: 'publish', component: Publish },
      { path: 'goods/edit', name: 'GoodsEdit', component: Publish, meta: { title: '编辑商品' } },
      { path: 'message', component: Message },
      { path: 'mine', component: Mine },
      { 
        path: 'goods/detail', 
        name: 'GoodsDetail', 
        component: Detail,
        meta: { title: '商品详情' } 
      },
      { 
        path: 'order/confirm', 
        name: 'OrderConfirm', 
        component: OrderConfirm,
        meta: { title: '确认订单' } 
      },
      { 
        path: 'order/detail', 
        name: 'OrderDetail', 
        component: OrderDetail,
        meta: { title: '订单详情' } 
      },
      { 
        path: 'order/list', 
        name: 'OrderList', 
        component: OrderList,
        meta: { title: '我的订单' } 
      }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const whiteList = ['/login', '/register']
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token || whiteList.includes(to.path)) {
    next()
  } else {
    next('/login')
  }
})

export default router