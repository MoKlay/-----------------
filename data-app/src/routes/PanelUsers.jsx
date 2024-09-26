import React, { useEffect, useState } from "react";
import $ from "jquery";

export default function PanelUsers() {
    const [login, setLogin] = useState("");
    const [pass, setPassword] = useState("");
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState("user")
    
  
    useEffect(() => {
      $.getJSON('/users', (data) => setUsers(data))
    }, [users])
  
    const onChangeLogin = (e) => {
      setLogin(e.target.value);
    }
  
    const onGenerate = () => {
  
      login !== "" && $.post('/api/generate', {login}, (data) => {
        setPassword(data.pass);
      })
    }
  
    const onCreate = () => {
      $.post('/api/create', {login, pass, role}, () => {
        setLogin("")
        setPassword("")
        alert("Создано")
      })
    }
  
    return (
      <div className="App">
        <div className="formCreate">
          <div className="con_create">
            <input type="text" onChange={onChangeLogin} placeholder="Логин" value={login}/>
            <button onClick={onGenerate}>Сгенерировать</button>
          </div>
          {pass && 
          <div className="info">
          <p>Логин: <b>{login}</b></p>
          <p>Пароль: <b>{pass}</b></p>
          <label>
            Роль: 
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
            </select>
          </label>
          <button onClick={onCreate}>Создать</button>
          </div>}
  
        </div>
        <div className="datatable">
            {Object.entries(users).map(([login, obj]) => {
              if (obj.role !== 'superadmin')
              return (
                <div className="row" key={login}>
                  <p>Логин: <b>{login}</b></p>
                  <p>Пароль: <b>{obj.pass}</b></p>
                  <p>Роль: <b>{obj.role}</b></p>
                  <button onClick={() => $.post('/api/delete', {login})}>Удалить</button>
                </div>
              );
  
            })}
        </div>
      </div>
    );
}
