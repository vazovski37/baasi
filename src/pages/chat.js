import { useState, useEffect } from "react";
import React from "react";
import Cookies from "universal-cookie";
import { getDoc, setDoc, doc } from "firebase/firestore"; // Add necessary imports for Firestore
import { auth, db } from "../firebase-config.js";
import { Inroom } from "./inRoom";
import addFavChat from "../icons/add.png";
import enterInChat from "../icons/chat.png";

const cookies = new Cookies();

const Chat = () => {
  const [secretWord, setSecretWord] = useState("");
  const user = cookies.get("user");
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [isInChat, setIsInChat] = useState(null);
  const [room, setRoom] = useState("");
  const [newUser, setNewUser] = useState({
    isadmin: false,
    name: "",
    favrooms: [],
  });
  const [newWord, setNewWord] = useState("");
  const [userinfo, setUserinfo] = useState(null);
  const [newfavchat, setNewfavchat] = useState("");

  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isFavChatVisible, setIsFavChatVisible] = useState(false);

  const fetchUser = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setUserinfo(userDoc.data());
        console.log(userinfo);
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
      try {
        const newUserDoc = doc(db, "users", newWord);
        await setDoc(newUserDoc, {
          isadmin: newUser.isadmin,
          name: newUser.name,
          favrooms: newUser.favrooms,
        });
        alert("New user added successfully");
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

  const handleNameChange = (e) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      name: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddUser();
  };

  const addFavChatToUser = async () => {
    if (newfavchat) {
      try {
        const userDocRef = doc(db, "users", user);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userObj = userDoc.data();
          const updatedFavRooms = [...userObj.favrooms, newfavchat];
          await setDoc(userDocRef, {
            ...userObj,
            favrooms: updatedFavRooms,
          });
          console.log("Chat added to favrooms");
          setUserinfo((prevUserInfo) => ({
            ...prevUserInfo,
            favrooms: updatedFavRooms,
          }));
          setNewfavchat("");
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error adding chat to favrooms:", error);
      }
    }
  };

  const removeChatFromFavrooms = async (chatName) => {
    if (userinfo) {
      try {
        const userDocRef = doc(db, "users", user);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userObj = userDoc.data();
          const updatedFavRooms = userObj.favrooms.filter(
            (roomName) => roomName !== chatName
          );
          await setDoc(userDocRef, {
            ...userObj,
            favrooms: updatedFavRooms,
          });
          console.log("Chat removed from favrooms");
          setUserinfo((prevUserInfo) => ({
            ...prevUserInfo,
            favrooms: updatedFavRooms,
          }));
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error removing chat from favrooms:", error);
      }
    }
  };

  return (
    <div className="chat_rout">
      {!isInChat ? (
        <div>
          <div className="chat_manipulation">
            <div>
              <button onClick={() => setIsChatVisible(!isChatVisible)}>
                <img src={enterInChat} alt="Enter in chat" />
              </button>
              {isChatVisible ? (
                <div className="popup">
                  <input
                    placeholder="type new room name"
                    onChange={(e) => setRoom(e.target.value)}
                  />
                  <div>
                    <button
                      id="crossbutton"
                      className="popup_button"
                      onClick={() => {
                        setIsChatVisible(!isChatVisible);
                      }}
                    >
                      ❌
                    </button>
                    <button
                      id="acceptbutton"
                      className="popup_button"
                      onClick={() => {
                        setIsInChat(true);
                        setIsChatVisible(!isChatVisible);
                      }}
                    >
                      ✅
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div>
              <button
                onClick={() => setIsFavChatVisible(!isFavChatVisible)}
              >
                <img src={addFavChat} alt="Add favorite chat" />
              </button>
              {isFavChatVisible ? (
                <div className="popup">
                  <input
                    placeholder="add fav chat"
                    onChange={(e) => setNewfavchat(e.target.value)}
                    value={newfavchat}
                  />
                  <div>
                    <button
                      id="crossbutton"
                      className="popup_button"
                      onClick={() => {
                        setIsFavChatVisible(!isFavChatVisible);
                      }}
                    >
                      ❌
                    </button>
                    <button
                      id="acceptbutton"
                      className="popup_button"
                      onClick={() => {
                        addFavChatToUser();
                        setIsFavChatVisible(!isFavChatVisible);
                      }}
                    >
                      ✅
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div>
            {userinfo &&
              userinfo.favrooms &&
              userinfo.favrooms.map((roomName, index) => (
                <div key={index} className="fav_chat">
                  <li
                    onClick={() => {
                      setRoom(roomName);
                      setIsInChat(true);
                    }}
                  >
                    <span>{roomName}</span>
                    <button
                      onClick={() => removeChatFromFavrooms(roomName)}
                    >
                      ❌
                    </button>
                  </li>
                </div>
              ))}
          </div>

          <br />
          <br />
          <br />
          <br />

          {userinfo && userinfo.isadmin && (
            <form onSubmit={handleSubmit}>
              <h2>Add User</h2>
              <div>
                <label>Code Word:</label>
                <input onChange={(e) => setNewWord(e.target.value)} />
              </div>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={handleNameChange}
                />
              </div>
              <div>
                <label>
                  Is Admin:
                  <input
                    type="checkbox"
                    checked={newUser.isadmin}
                    onChange={handleCheckboxChange}
                  />
                </label>
              </div>
              <button type="submit">Submit</button>
            </form>
          )}
        </div>
      ) : (
        <Inroom
          room={room}
          handleLeaveRoom={handleLeaveRoom}
          userinfo={userinfo}
        />
      )}
    </div>
  );
};

export default Chat;
