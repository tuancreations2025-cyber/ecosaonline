import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerMember } from '../services/mockService'

export default function Register(){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [phone,setPhone]=useState('')
  const [years,setYears]=useState('')
  const nav = useNavigate()

  const submit = async (e:React.FormEvent)=>{
    e.preventDefault()
    if(!name||!email) return alert('Provide name and email')
    try{
      await registerMember({
        name,
        email,
        phone,
        yearsAtECI: years,
      })
      alert('Registered successfully. Your details have been added to the members list.')
      nav('/members')
    }catch(e){
      alert('Could not register right now. Please try again later.')
    }
  }

  return (
    <div className="card">
      <h3>Register</h3>
      <p>Fill in your details below to join the ECOSA members list automatically.</p>
      <form onSubmit={submit}>
        <label>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} />
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Phone</label>
        <input value={phone} onChange={e=>setPhone(e.target.value)} />
        <label>Years at ECI</label>
        <input placeholder="e.g. 2008-2012" value={years} onChange={e=>setYears(e.target.value)} />
        <div className="actions"><button className="btn">Submit registration</button></div>
      </form>
    </div>
  )
}
