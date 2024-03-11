import React from 'react'
import {
  createBrowserRouter
} from 'react-router-dom'
import Login from './containers/Login'
import Signup from './containers/Signup'
import Home from './containers/Home'
import Update from './containers/Update'

const token = localStorage.getItem('token')

const router = createBrowserRouter([
  {
    path: '/',
    element: <Signup />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/home',
    element: token ? <Home /> : <Login />
  },
  {
    path: '/update',
    element: token ? <Update /> : <Login />
  }
])

export default router
