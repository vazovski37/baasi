import React, { useState, useEffect } from "react";
import { Chat } from "./components/Chat";
import { Auth } from "./components/Auth.js";
import { AppWrapper } from "./components/AppWrapper";
import Cookies from "universal-cookie";
import "./App.css";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase-config.js";

const cookies = new Cookies();

function ChatApp() {
  const user = cookies.get("user");
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [isInChat, setIsInChat] = useState(null);
  const [room, setRoom] = useState("");
  const [newUser, setNewUser] = useState({
    isadmin: false,
  });
  const [newWord, setNewWord] = useState("");
  const [userinfo, setUserinfo] = useState(null);

  const fetchUser = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setUserinfo(userDoc.data());
        console.log(userinfo.isadmin);
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser(user);
  }, [user]);

  const handleLeaveRoom = () => {
    setIsInChat(false);
    setRoom("");
  };

  const handleAddUser = async () => {
    if (userinfo && userinfo.isadmin) {
      // Logic to add a new user to the "users" collection
      try {
        await setDoc(doc(db, "users", newWord), newUser);
        console.log("New user added successfully");
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  const handleCheckboxChange = (e) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      isadmin: e.target.checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddUser();
  };

  if (!isAuth) {
    return (
      <AppWrapper
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        setIsInChat={setIsInChat}
      >
        <Auth setIsAuth={setIsAuth} />
      </AppWrapper>
    );
  }

  return (
    <AppWrapper isAuth={isAuth} setIsAuth={setIsAuth} setIsInChat={setIsInChat}>
      {!isInChat ? (
        <div className="room">
          <label>სიტყვა:</label>
          <input onChange={(e) => setRoom(e.target.value)} />

          <button onClick={() => setIsInChat(true)}>ჩატში შესვლა</button>

          <br />
          <br />
          <br />
          <br />

          {userinfo && userinfo.isadmin && (
            <form onSubmit={handleSubmit}>
              <button type="submit">Add User</button>
              <span>code word</span>
              <input onChange={(e) => setNewWord(e.target.value)} />

              <label>
                Is Admin:
                <input
                  type="checkbox"
                  checked={newUser.isadmin}
                  onChange={handleCheckboxChange}
                />
              </label>
            </form>
          )}
        </div>
      ) : (
        <Chat room={room} handleLeaveRoom={handleLeaveRoom} user={userinfo.name} />
      )}
    </AppWrapper>
  );
}

export default ChatApp;
