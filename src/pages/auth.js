import React, { useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase-config.js";
import Cookies from "universal-cookie";

const Auth = () => {
  const [secretWord, setSecretWord] = useState("");
  const cookies = new Cookies();

  const checkSecretWord = async () => {
    console.log('qqq');
    const secretWordRef = doc(db, "users", secretWord);
    
    try {
      const secretWordDoc = await getDoc(secretWordRef);
      
      if (secretWordDoc.exists()) {
        cookies.set("auth-token", true);
        cookies.set("user", secretWord);

        window.location.href = "/chat";
      } else {
        alert("gaiare dzmaa");
      }
    } catch (error) {
      console.error("Error retrieving secret word document:", error);
    }

    console.log('bbb');
  };

  const handleSecretWordChange = (event) => {
    setSecretWord(event.target.value);
  };

  return (
    <div className="auth">
      <input type="text" placeholder="secret" value={secretWord} onChange={handleSecretWordChange} />
      <button onClick={checkSecretWord} className="logIn-btn">
        Log In
      </button>
    </div>
  );
};

export default Auth;
