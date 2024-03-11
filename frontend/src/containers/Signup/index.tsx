import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, Form, Spinner } from 'react-bootstrap'

interface SignupFormType {
  username: string
  email: string
  password: string
}

const Signup: React.FC = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const register: SignupFormType | any = async (formData: SignupFormType) => {
    try {
      const response = await axios.post<SignupFormType>(
        `${process.env.REACT_APP_BACKEND_URL}user/`,
        {
          headers: {
            Accept: 'application/json'
          },
          ...formData
        }
      )
      return response
    } catch (error) {
      return error
    }
  }

  const createUser: any = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    const response: SignupFormType | any = await register({username, email, password})
    setLoading(false)
    if (response.status === 201) {
      navigate('/login')
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
      <h1 className='text-center'>Signup</h1>
      <p className='text-center'>Already have an account? <a href='/login'>Login</a></p>
      {
        loading
          ? <div className='d-flex justify-content-center mt-3'>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          : (
            <Form onSubmit={createUser}>
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

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
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
                Signup
              </Button>
            </Form>
            )
      }
    </div>
  )
}

export default Signup
