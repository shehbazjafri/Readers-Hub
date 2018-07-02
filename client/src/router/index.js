import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/home'
import Reviews from '../components/reviews'
import BookDetails from '../components/book-details'
import SearchPage from '../components/search-page'
import Discussions from '../components/discussions.vue'
import Shelf from '../components/shelf.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/reviews/:id',
      name: 'reviews',
      component: Reviews
    },
    {
      path: '/book-details/:id',
      name: 'book-details',
      component: BookDetails
    },
    {
      path: '/book/search/:searchQuery',
      name: 'search-page',
      component: SearchPage
    },
    {
      path:'/book/discussions/:id',
      name:'discussions',
      component:Discussions
    },
    {
      path:'/user/shelf',
      name:'shelf',
      component:Shelf
    }
  ],
  mode: 'history'
})
