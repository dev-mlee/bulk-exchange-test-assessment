import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, Form, Spinner } from 'react-bootstrap'

interface LoginFormType {
  username: string
  password: string
}

interface Token {
  token: string | null
  id: number | null
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const login: any = async (loginData: LoginFormType) => {
    try {
      const response = await axios.post<LoginFormType>(
        `${process.env.REACT_APP_BACKEND_URL}user/login/`,
        {
          headers: {
            Accept: 'application/json'
          },
          ...loginData
        }
      )
      return response
    } catch (error) {
      return error
    }
  }

  const loginUser: any = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    const response: Token | any = await login({ username, password })
    setLoading(false)
    if (response.status === 200) {
      const token = response?.data?.token || ''
      const id = response?.data?.id || null
      localStorage.setItem('token', token)
      localStorage.setItem('id', id)
      navigate('/home')
    } else {
      const errors = response?.response?.data || {}
      if (Object.values(errors).length > 0) {
        const error: any = Object.values(errors)[0]
        alert(typeof (error) === 'string' ? error : error[0])
      }
    }
  }

  return (
    <div className='container mt-5'>
      <h1 className='text-center'>Login</h1>
      <p className='text-center'>Create an account <a href='/'>Signup</a></p>
      {
        loading
          ? <div className='d-flex justify-content-center mt-3'>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
          : (
            <Form onSubmit={loginUser}>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  value={username}
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                required
              />
              </Form.Group>

              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
            )
      }
    </div>
  )
}

export default Login
