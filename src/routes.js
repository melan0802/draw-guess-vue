import guess from '@/pages/guess'
import draw from '@/pages/draw'
import login from '@/pages/login'
import random from '@/pages/random'

const routes = [
  {
    path: '/draw',
    component: draw
  }, {
    path: '/login',
    component: login
  }, {
    path: '/random',
    component: random
  }, {
    path: '/',
    component: guess
  }
]

export default routes