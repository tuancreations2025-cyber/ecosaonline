import React, { useEffect, useState } from 'react'
import { getMembers, getPayments, getPosts, addPost } from '../services/mockService'

export default function Dashboard(){
  const [members,setMembers]=useState<any[]>([])
  const [payments,setPayments]=useState<any[]>([])
  const [title,setTitle]=useState('')
  const [body,setBody]=useState('')

  useEffect(()=>{
    let mounted=true
    const load = async ()=>{
      const m = await getMembers()
      const p = await getPayments()
      if(mounted){ setMembers(m); setPayments(p) }
    }
    load()
    return ()=>{ mounted=false }
  },[])

  const submit = async (e:React.FormEvent)=>{
    e.preventDefault()
    if(!title||!body) return alert('Enter title and body for the update')
    await addPost({
      id: Date.now().toString(),
      title,
      content: body,
      author: 'ECOSA Admin',
      createdAt: new Date().toISOString(),
      registerUrl: '/register'
    })
    setTitle('')
    setBody('')
    const m = await getMembers()
    const p = await getPayments()
    setMembers(m)
    setPayments(p)
    alert('Update published')
  }

  return (
    <div>
      <div className="card">
        <h3>Admin Dashboard</h3>
        <p>This page is intended for ECOSA admin review. It is not linked publicly and holds registration and payment data.</p>
      </div>

      <div className="card" style={{marginTop:12}}>
        <h4>Publish Community Update</h4>
        <form onSubmit={submit}>
          <label>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} />
          <label>Message</label>
          <textarea value={body} onChange={e=>setBody(e.target.value)} />
          <div className="actions"><button className="btn">Publish update</button></div>
        </form>
      </div>

      <div className="card" style={{marginTop:12}}>
        <h4>Registered Members ({members.length})</h4>
        <div style={{display:'grid',gap:10,marginTop:10}}>
          {members.slice(0,20).map(member => (
            <div key={member.id} style={{padding:12,background:'#fafafa',borderRadius:10,border:'1px solid rgba(0,0,0,.08)'}}>
              <div><strong>{member.name}</strong> {member.membershipNumber ? `(${member.membershipNumber})` : ''}</div>
              <div style={{color:'#4b5563',fontSize:13}}>{member.email}</div>
              <div style={{color:'#6b7280',fontSize:12}}>{member.yearsAtECI || 'Year group not provided'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{marginTop:12}}>
        <h4>Payment History ({payments.length})</h4>
        <div style={{display:'grid',gap:10,marginTop:10}}>
          {payments.slice(0,20).map(payment => (
            <div key={payment.id} style={{padding:12,background:'#fff',borderRadius:10,border:'1px solid rgba(0,0,0,.08)'}}>
              <div><strong>{payment.memberName || payment.email}</strong></div>
              <div style={{color:'#4b5563',fontSize:13}}>{payment.amount} {payment.currency || 'UGX'} via {payment.method}</div>
              <div style={{color:'#6b7280',fontSize:12}}>{new Date(payment.at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
