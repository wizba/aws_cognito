import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
const SignInWithOTP = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOTP] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');

  /**
   * initiate the signin process
   * allows you to skip 2MF if not congured or login 
   * 
   */
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const signInOpts = {
        username: username,
        password: password,
        validationData: {
          authType: 'email',
          sendTo:"johann@wamly.io",
          skipMultiFactorAuthentication:"false"
        },
      };

      const signedInUser = await Auth.signIn(signInOpts);
      setUser(signedInUser);
     
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  /**
   * used to verify OTP with aws
   * returns the user session
   */
  const handleSignInCode = async (e) => {
    e.preventDefault();
    try {
      const response = await Auth.sendCustomChallengeAnswer(user, otp);
      console.log(response); // Do something with the response
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const signUpOpts = {
        username: username,
        password: password,
        attributes: {
          email: email // Include the email attribute
        },
        validationData: {
          authType: 'sms'
        },
      };

      const newUser = await Auth.signUp(signUpOpts);
      setUser(newUser.user);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Sign In / Sign Up</h1>
      <form onSubmit={handleSignIn}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Sign In</button>
      </form>
      <form onSubmit={handleSignInCode}>
        <label>
          OTP:
          <input type="text" value={otp} onChange={(e) => setOTP(e.target.value)} />
        </label>
        <button type="submit">Verify OTP</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
  <label>
    Username:
    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
  </label>
  <label>
    Password:
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </label>
  <label>
    Email:
    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
  </label>
  <button type="submit">Sign Up</button>
</form>
    </div>
  );
};

export default SignInWithOTP;

