import React, { useRef, useState, useEffect } from "react";
import { db, auth } from "../firebase-config";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  arrayUnion,
  getDoc,
  doc,
} from "firebase/firestore";

import "../styles/Chat.css";

export const Inroom = ({ room, handleLeaveRoom, userinfo }) => {

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = collection(db, "messages");
  const messagesContainerRef = useRef(null);
  const lowestMessageRef = useRef(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [room]);

  useEffect(() => {
    const lowestMessage = messages[messages.length - 1];
    lowestMessageRef.current = lowestMessage;
  }, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage === "") return;
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: userinfo.name,
      room,
    });

    setNewMessage("");
  };


  

  return (
    <div className="chat-app">
      <div className="header">
        <h1>&lt; {room} /&gt;</h1>
        <button onClick={handleLeaveRoom}>&lt; Leave Room /&gt;</button>
      </div>
      <div className="messages" ref={messagesContainerRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message === lowestMessageRef.current ? "lowest-message" : ""}`}
          >
            <span className="user" style={message.user === userinfo.name ? { color: "#555555" } : { color: "#333" }}>
              &lt;{message.user} /&gt;
            </span>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="new-message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          className="new-message-input"
          placeholder="Type your message here..."
        />
        <button type="submit" className="send-button">
          {">>>"}
        </button>
      </form>
    </div>
  );
};
