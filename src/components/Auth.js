import { useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { auth, db } from "../firebase-config.js";
import "../styles/Auth.css";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const Auth = ({ setIsAuth,  }) => {
  const [secretWord, setSecretWord] = useState("");

  const checkSecretWord = async () => {
    const secretWordRef = doc(db, "users", secretWord);
    const secretWordDoc = await getDoc(secretWordRef);

    
    if (secretWordDoc.exists()) {
      cookies.set("auth-token", true);
      cookies.set("user", secretWord)
      setIsAuth(true);
    } else {
      alert("gaiare dzmaa");
    }
  };

  const handleSecretWordChange = (event) => {
    setSecretWord(event.target.value);
  };

  return (
    <div className="auth">
      <label>კოდური სიტყვა {">>>"}</label>
      <input type="text" value={secretWord} onChange={handleSecretWordChange} />
      <button onClick={checkSecretWord} className="logIn-btn">
        შესვლა
      </button>
    </div>
  );
};
