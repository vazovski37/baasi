import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase-config';
import Cookies from 'universal-cookie';
import addimg from '../icons/addimg.png'


const cookies = new Cookies();

const Folder = ({ folder, handleLeaveFolder,}) => {
  const [code, setCode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState(cookies.get('user'));
  const [inputCode, setInputCode] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [userinfo, setUserinfo] = useState(null);
  const [photos, setPhotos] = useState(folder);


  useEffect(() => {
    fetchUser(user);
  }, [user]);

  const fetchUser = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserinfo(userDoc.data());
        const folderToUpdate = userDoc.data().folders.find((f) => f.id === folder.id);
        if (folderToUpdate) {
          setPhotos(folderToUpdate);
        }
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCodeChange = (event) => {
    setInputCode(event.target.value);
  };

  const handleCodeSubmit = () => {
    if (inputCode === userinfo.code) {
      setCode(true);
    } else {
      alert('gaiare dzma');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }
  
    try {
      const storageRef = ref(storage, `folders/${folder.id}/${selectedFile.name}`);
      await uploadBytes(storageRef, selectedFile);
  
      const downloadURL = await getDownloadURL(storageRef);
      const mediaData = {
        name: selectedFile.name,
        url: downloadURL,
      };
  
      const userDocRef = doc(db, 'users', user);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const folders = userData.folders || [];
  
        const folderIndex = folders.findIndex((f) => f.id === folder.id);
  
        if (folderIndex !== -1) {
          folders[folderIndex].medias = [...folders[folderIndex].medias, mediaData];
  
          await updateDoc(userDocRef, { folders });
        } else {
          console.log('Folder document does not exist. Unable to update.');
        }
      } else {
        console.log('User document does not exist. Unable to update.');
      }
  
      await fetchUser(user);
      setShowCreateFolder(false);
  
      // Fetch the updated user data after upload
    } catch (error) {
      console.error('Error uploading file:', error);
      console.log('An error occurred while uploading the file. Please try again.');
    }
  };
  
  
  const PhotoGallery = ({ photos }) => {
    useEffect(() => {
      // This code will be executed whenever the 'photos' variable changes
      console.log('Photos have changed:', photos);
    }, [photos]);
  
    return (
      <div className='a_imgs'>
        {photos.medias.map((media, index) => (
          <img key={index} src={media.url} alt={media.name} />
        ))}
      </div>
    );
  };
  
  
  
  return (
    <div className='photos'>
      <nav>
        <ul>
          <li >{folder.name}</li>
          <li>
            <button onClick={handleLeaveFolder}>Leave folder</button>
          </li>
        </ul>
      </nav>

      {code ? (
        <div className='imgs'>
          <div>
          {showCreateFolder ? (
              <div className="popup">
                <input type="file" onChange={handleFileChange} />
                <div>
                  <button id="crossbutton" className="popup_button" onClick={() => setShowCreateFolder(false)}>
                    ❌
                  </button>
                  <button id="acceptbutton" className="popup_button" onClick={handleUpload}>
                    ✅
                  </button>
                </div>
              </div>
            ) : (
              <button id="showcreatefolder" onClick={() => setShowCreateFolder(true)}>
                <img src={addimg} alt="Create Folder" />
              </button>
            )}
          </div>
          <div className='a_imgs' >
          <PhotoGallery photos={photos} />
          </div>
        </div>
      ) : (
        <div className='auth'>
            <input
              placeholder="Enter code"
              value={inputCode}
              onChange={handleCodeChange}
            />
            <button onClick={handleCodeSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default Folder;
