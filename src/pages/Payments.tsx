import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { addPayment, findMemberByEmail, registerMember } from '../services/mockService'

const purposeOptions = ['Membership', 'Insurance', 'Sacco', 'Project Donation'] as const
type Purpose = typeof purposeOptions[number]

export default function Payments(){
  const [searchParams] = useSearchParams()
  const requestedPurpose = searchParams.get('purpose')
  const initialPurpose: Purpose = purposeOptions.includes(requestedPurpose as Purpose) ? (requestedPurpose as Purpose) : 'Membership'

  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [phone,setPhone]=useState('')
  const [years,setYears]=useState('')
  const [amount,setAmount]=useState('20000')
  const [purpose,setPurpose]=useState<Purpose>(initialPurpose)
  const [method,setMethod]=useState<'mpesa'|'mtn'|'airtel'|'card'>('mpesa')

  const submit = async (e:React.FormEvent)=>{
    e.preventDefault()
    if(!name||!email||!amount) return alert('Provide name, email and amount')
    if((method==='mpesa' || method==='mtn' || method==='airtel') && !phone) return alert('Enter phone number')

    const existing = await findMemberByEmail(email)
    let member = existing
    if (!member) {
      member = await registerMember({
        name,
        email,
        phone,
        yearsAtECI: years,
      })
    } else if (!member.membershipNumber) {
      member = await registerMember({
        ...member,
        membershipNumber: `EC-${Date.now()}`,
      })
    }

    const payment = {
      id: `pay_${Date.now()}`,
      memberId: member.id,
      memberName: member.name,
      email: member.email,
      purpose,
      amount,
      currency: 'UGX',
      method,
      phone,
      paid: true,
      at: new Date().toISOString(),
    }

    try{
      if(method==='mpesa' || method==='mtn' || method==='airtel'){
        const res = await fetch('http://localhost:4000/api/payments/initiate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({provider:method, amount: Number(amount), phone})})
        const j = await res.json()
        if(j && j.ok){ alert(`${method.toUpperCase()} initiated. Follow prompts on your phone.`) }
        else if(j && j.message){ alert(j.message) }
      } else {
        const res = await fetch('http://localhost:4000/api/create-checkout-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:Math.round(Number(amount)),currency:'ugx'})})
        const j = await res.json()
        if(j.url){ window.location.href = j.url; return }
      }
    }catch(e){
      await addPayment(payment)
      alert('Payment recorded locally. Your membership is now registered.')
      setAmount('20000')
      setPhone('')
      setYears('')
      return
    }

    await addPayment(payment)
    setAmount('20000')
    setPhone('')
    setYears('')
    alert(`Thank you, ${name}. You are now registered as a member.`)
  }

  const handleContributePay = () => {
    setAmount('20000')
    setMethod('mpesa')
    alert('Contribution amount set to UGX 20,000. Enter your details and submit.')
  }

  const handleDonate = () => {
    const entered = window.prompt('Enter donation amount in UGX')
    if (!entered) return
    setAmount(entered.trim())
    setMethod('card')
    alert(`Donation amount set to UGX ${entered.trim()}. Enter your details and submit.`)
  }

  return (
    <>
      <div className="card">
        <h3>Payments</h3>
        <p>Pay your ECOSA membership fee or donate to support alumni initiatives. Payments automatically add you to the members list.</p>

        <form onSubmit={submit}>
          <label>Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} />
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
          <label>Phone</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} />
          <label>Years at ECI</label>
          <input value={years} onChange={e=>setYears(e.target.value)} placeholder="e.g. 2008-2012" />
          <label>Payment purpose</label>
          <select value={purpose} onChange={e=>setPurpose(e.target.value as any)}>
            <option value="Membership">Membership</option>
            <option value="Insurance">Insurance</option>
            <option value="Sacco">Sacco</option>
            <option value="Project Donation">Project Donation</option>
          </select>
          <label>Amount (UGX)</label>
          <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="20000" />

          <label style={{marginTop:8}}>Payment method</label>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <button type="button" className={`field-btn${method==='mpesa' ? ' active' : ''}`} onClick={()=>setMethod('mpesa')}>M-Pesa</button>
            <button type="button" className={`field-btn${method==='mtn' ? ' active' : ''}`} onClick={()=>setMethod('mtn')}>MTN</button>
            <button type="button" className={`field-btn${method==='airtel' ? ' active' : ''}`} onClick={()=>setMethod('airtel')}>Airtel</button>
            <button type="button" className={`field-btn${method==='card' ? ' active' : ''}`} onClick={()=>setMethod('card')}>Card</button>
          </div>

          {(method==='mpesa' || method==='mtn' || method==='airtel') && (
            <div>
              <label>Phone (international format, e.g. 2567xxxxxxx)</label>
              <input value={phone} onChange={e=>setPhone(e.target.value)} />
            </div>
          )}

          <div className="actions"><button className="btn">{method==='card' ? 'Pay with Card' : `Pay with ${method.toUpperCase()}`}</button></div>
        </form>
        <p style={{color:'#6b7280',marginTop:12}}>Payments will record your membership and update the members list automatically.</p>
      </div>
    </>
  )
}
