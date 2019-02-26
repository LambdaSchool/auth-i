import React, { useState } from 'react';

function Form(props) {
  const [username, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  let user = { username: username, password: password };
  return (
    <>
      <form method="POST" onSubmit={e => props.loginUser(e, user)}>
        <h2>Login</h2>
        <input
          value={username}
          onChange={e => setFirstName(e.target.value)}
          placeholder="First name"
          type="text"
          name="username"
          required
        />

        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          name="password"
          required
        />
        <button type="submit">Submit</button>
        <h2> OR </h2>
      </form>
    </>
  );
}
export default Form;
