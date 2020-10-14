import React, { useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, handleFBLogin, handleGoogleSignIn, handleSignOut, initializeLoginFramework, signInWithEmailAndPassword } from './LoginManager';

function Login() {
  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({ 
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false
  });

  initializeLoginFramework();

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const googleSignIn = () => {
    handleGoogleSignIn()
    .then(res => {
      handleResponse(res, true); 
    })
  }

  const signOut = () => {
    handleSignOut()
    .then(res => {
      handleResponse(res, false);    
    })
  }

  const fbSignIn = () =>{
    handleFBLogin()
    .then(res => {
      handleResponse(res, true);    
    })
  }

  const handleResponse =(res, redirect) =>{
    setUser(res);
    setLoggedInUser(res);
    if(redirect){
      history.replace(from);
    }
  }

  const handleBlur = (event) => {
    let isFieldValid = true;
    if(event.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value)
    }
    if(event.target.name === 'password'){
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber =  /\d{1}/.test(event.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo.[event.target.name] = event.target.value; 
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (event) => {
    if( newUser && user.email && user.password){
      createUserWithEmailAndPassword(user.name, user.email, user.password)
      .then(res => {
        handleResponse(res, true); 
      })
    }

    if(!newUser && user.email && user.password){
      signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        handleResponse(res, true); 
      })
    }
    event.preventDefault();
  }
  
  return (
    <div style={{textAlign: 'center'}}>
      <br/>
      {
        user.isSignedIn ? <button onClick={signOut}>Sign out</button>:
        <button onClick={googleSignIn}>Sign in with Google</button>
      }
      <br/><br/>
      <button onClick ={fbSignIn}>Sign in using Facebook</button>
      {
        user.isSignedIn && <div>
            <p>Welcome, {user.name}</p>
            <p>Your email: {user.email}</p>
            <img src ={user.photo} alt="" ></img>
          </div>
      }
      
      <h3>Our own authentication system</h3>
      <input type="checkbox" onChange={()=> setNewUser(!newUser)}name="newUser" id =""/>
      <label htmlFor="newUser">New User Registration</label>
      <form onSubmit = {handleSubmit}>
        {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your name"/>}<br/> 
        <input type="text" name="email" onBlur={handleBlur} placeholder="Write email" required/><br/>
        <input type="password" name="password" onBlur={handleBlur} placeholder="Your password" required/>
        <br/><br/>
        <input type="submit" value={newUser ? 'Sign up' : 'Sign In'}/>
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      {user.success && <p style={{color: 'green'}}>User {newUser ? 'Created' : 'Logged In' }Succesfully</p>}
    </div>
  );
}

export default Login;
