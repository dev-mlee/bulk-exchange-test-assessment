import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from 'react-bootstrap'

interface UserDataType {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [first_name, setFirstName] = useState<string>('')
  const [last_name, setLastName] = useState<string>('')

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

  const update: any = (event: React.FormEvent) => {
    event.preventDefault()
    navigate('/update')
  }

  const logout: any = (event: React.FormEvent) => {
    event.preventDefault()
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className='container mt-5'>
      <h1 className='text-center'>Home</h1>
      <div className='text-center mb-2'>
        Email: {email}
        <br />
        Username: {username ? username : '-----'}
        <br />
        First Name: {first_name ? first_name : '-----'}
        <br />
        Surname: {last_name ? last_name : '-----'}
      </div>
      <Button variant="primary" type="button" onClick={update}>
        Update Profile
      </Button>
      &ensp;
      <Button variant="secondary" type="button" onClick={logout}>
        Logout
      </Button>
    </div>
  )
}

export default Home
