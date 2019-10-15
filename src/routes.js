import guess from '@/pages/guess'
import draw from '@/pages/draw'
import login from '@/pages/login'

const routes = [
  {
    path: '/draw',
    component: draw
  }, {
    path: '/login',
    component: login
  }, {
    path: '/',
    component: guess
  }
]

export default routes