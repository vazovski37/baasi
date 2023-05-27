import React, { useState, useEffect } from 'react';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config.js';
import Cookies from 'universal-cookie';
import Folder from './Folder.js';
import createfoldericon from '../icons/add-folder.png';
import foldericon from '../icons/folder.png'

const cookies = new Cookies();

const Photo = () => {
  const [user, setUser] = useState(cookies.get('user'));
  const [folderName, setFolderName] = useState('');
  const [folders, setFolders] = useState([]);
  const [userinfo, setUserinfo] = useState(null);
  const [inFolder, setInfolder] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null); // Track the selected folder
  const [showCreateFolder, setShowCreateFolder] = useState(false); // Track whether to show the folder creation form

  const fetchUser = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserinfo(userDoc.data());
        setFolders(userDoc.data().folders);
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchUser(user);
  }, [user]);

  const handleFolderNameChange = (event) => {
    setFolderName(event.target.value);
  };

  const handleCreateFolder = async () => {
    if (!folderName) {
      alert('Please enter a folder name.');
      return;
    }

    try {
      const folderData = {
        name: folderName,
        id: generateId(),
        medias: [],
      };

      await updateDoc(doc(db, 'users', user), {
        folders: [...folders, folderData],
      });

      setFolderName('');
      fetchUser(user);
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('An error occurred while creating the folder. Please try again.');
    }
    setShowCreateFolder(false);
  };

  const generateId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    setInfolder(true);
  };

  const handleLeaveFolder = () => {
    setSelectedFolder(null);
    setInfolder(false);
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await updateDoc(doc(db, 'users', user), {
        folders: folders.filter((folder) => folder.id !== folderId),
      });

      fetchUser(user);
      console.log('Folder deleted successfully!');
    } catch (error) {
      console.error('Error deleting folder:', error);
      alert('An error occurred while deleting the folder. Please try again.');
    }
  };

  return (
    <div id='photo_rout'>

      {!inFolder ? (
        <>
          <div>
            {showCreateFolder ? (
              <div className="popup">
                <label htmlFor="folderName">Folder Name:</label>
                <input type="text" id="folderName" value={folderName} onChange={handleFolderNameChange} />
                <div>
                  <button id="crossbutton" className="popup_button" onClick={() => setShowCreateFolder(false)}>
                    ❌
                  </button>
                  <button id="acceptbutton" className="popup_button" onClick={handleCreateFolder}>
                    ✅
                  </button>
                </div>
              </div>
            ) : (
              <button id="showcreatefolder" onClick={() => setShowCreateFolder(true)}>
                <img src={createfoldericon} alt="Create Folder" />
              </button>
            )}
          </div>
          <div>
            <h3>Your Folders:</h3>
            {userinfo && userinfo.folders ? (
              <ul className='folder_cont'>
                {userinfo.folders.map((folder) => (
                  <li className='folder' key={folder.id} onClick={() => handleFolderClick(folder)}>
                    <img src={foldericon} />
                    <div>
                      <span>
                        {folder.name}
                      </span>
                    <button className="popup_button" onClick={() => handleDeleteFolder(folder.id)}>❌</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading folders...</p>
            )}
          </div>
        </>
      ) : (
        <>
          <Folder folder={selectedFolder} handleLeaveFolder={handleLeaveFolder}  />
        </>
      )}
    </div>
  );
};

export default Photo;
