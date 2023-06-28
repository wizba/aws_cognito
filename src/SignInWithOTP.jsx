import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
const SignInWithOTP = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [mfaType, setMfaType] = useState('email');
  const [mfaDestination, setMfaDestination] = useState('');

  const [otp, setOTP] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');


  /**
   * initiate the signin process by calling initiateAuth
   * allows you to skip 2MF if not congured or login 
   * 
   */
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const signInOpts = {
        username: username,
        password: password
      };

      const signedInUser = await Auth.signIn(signInOpts);
      console.log(signedInUser)
      setUser(signedInUser);
     
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleInitiateMfa = async (e) => {
    e.preventDefault();
    try {
      const mfaMetadata = {
        mfaId: "934723-328423-347",
        mfaType: mfaType,
        destination: mfaDestination
      };

      const newUser = await Auth.sendCustomChallengeAnswer(user, " ", mfaMetadata);
      console.log(newUser); // Do something with the response
      setUser(newUser);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  /**
   * used to verify OTP with aws by calling respondToAuthChallenge
   * returns the user session
   */
  const handleSignInCode = async (e) => {
    e.preventDefault();
    try {
      const signedInUser = await Auth.sendCustomChallengeAnswer(user, otp);
      console.log(signedInUser)
      setUser(signedInUser);
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
          mfaType: 'sms'
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
      <h1>Sign In</h1>
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
      <form onSubmit={handleInitiateMfa}>
        <label>
          MFA:
          <input type="radio" value="email" name="type" defaultChecked onChange={(e) => {setMfaType(e.target.value)}}/> Email
          <input type="radio" value="sms" name="type" onChange={(e) => {setMfaType(e.target.value)}}/> SMS
          <input type="text" value={mfaDestination} onChange={(e) => { setMfaDestination(e.target.value);}} />
        </label>
        <button type="submit">Initiate MFA</button>
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

