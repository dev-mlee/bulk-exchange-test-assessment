import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, Form, Spinner } from 'react-bootstrap'

interface UserDataType {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  password: string
}

const Update: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [first_name, setFirstName] = useState<string>('')
  const [last_name, setLastName] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const getDetails: any = async () => {
    try {
      const user_id = localStorage.getItem('id')
      const response = await axios.get<UserDataType>(
        `${process.env.REACT_APP_BACKEND_URL}user/${user_id}/`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${localStorage.getItem('token') ?? ''}`
          }
        }
      )
      return response
    } catch (error) {
      return error
    }
  }

  useEffect(() => {
    const getDetailsResponse = getDetails()
    getDetailsResponse.then((response: any) => {
      if (response.status === 200) {
        setUsername(response.data.username)
        setEmail(response.data.email)
        setFirstName(response.data.first_name)
        setLastName(response.data.last_name)
      }
    })
  }, [])

  const update: any = async (
    formData: UserDataType
  ) => {
    try {
      const user_id = localStorage.getItem('id')
      const response = await axios.patch<UserDataType>(
        `${process.env.REACT_APP_BACKEND_URL}user/${user_id}/`,
        formData,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${localStorage.getItem('token') ?? ''}`
          }
        }
      )
      return response
    } catch (error) {
      return error
    }
  }

  const updateUser: any = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    const response: UserDataType | any = await update(
      {
        username,
        email,
        first_name,
        last_name,
        password
      }
    )
    setLoading(false)
    if (response.status === 200) {
      navigate('/home')
    } else {
      const errors = response?.response?.data || {}
      if (Object.values(errors).length > 0) {
        const error: any = Object.values(errors)[0]
        alert(typeof (error) === 'string' ? error : error[0])
      }
    }
  }

  const home: any = (event: React.FormEvent) => {
    event.preventDefault()
    navigate('/home')
  }

  return (
    <div className='container mt-5'>
      <h1 className='text-center'>Update Profile</h1>
      {
        loading
          ? <div className='d-flex justify-content-center mt-3'>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          : (
            <Form onSubmit={updateUser}>
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

              <Form.Group className="mb-3" controlId="formBasicFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  value={first_name}
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter First Name"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicLastName">
                <Form.Label>Surname</Form.Label>
                <Form.Control
                  value={last_name}
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter Surname"
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
                Update
              </Button>
            </Form>
            )
      }
      <br />
      <Button variant="secondary" type="submit" onClick={home}>
        Home
      </Button>
    </div>
  )
}

export default Update
