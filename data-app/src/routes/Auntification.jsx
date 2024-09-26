import React, { useState } from 'react'
import $ from 'jquery'

export default function Auntification({getLoding}) {
  const [login, setLogin] = useState('')
  const [pass, setPass] = useState('')

  const [errLogin, setErrLogin] = useState('')
  const [errPass, setErrPass] = useState('')
  const [err, setErr] = useState('')

  function Auntification(e) {
    e.preventDefault()
    $.post('/auntification', {login, pass}, data => {
      if (data) {
        setErrLogin(data.login)
        setErrPass(data.pass)
        setErr(data.err)
      }
      else {
        sessionStorage.setItem('logining', true)
      }
    })
  }

  function handleLogin(e) {
    setErrLogin('')
    setErr('')
    setLogin(e.target.value)
  }
  function handlePass(e) {
    setErrPass('')
    setErr('')
    setPass(e.target.value)
  }

  return (
    <form onSubmit={Auntification}>
      <h1>Auntification</h1>
      <input type="text" placeholder="Логин" value={login} onChange={handleLogin}/>
      <p>{errLogin}</p>
      <input type="password" placeholder="Пароль" value={pass} onChange={handlePass}/>
      <p>{errPass}</p>
      <button>Войти</button>
      <p>{err}</p>
    </form>
  )
}
