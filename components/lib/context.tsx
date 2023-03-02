import React, {createContext, useState, useContext, useEffect} from 'react';
import {users} from './firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserSchema} from '../schema';

const User = createContext({});
const useUser: Function = () => useContext(User);

const UserProvider = ({children}: {children: any}) => {
  let [user, setUser] = useState(UserSchema);
  let [id, setId] = useState('');

  useEffect(() => {
    const subscriber = (async () => {
      let appId = await AsyncStorage.getItem('id');
      setId(appId);
      return users.doc(appId).onSnapshot(documentSnapshot => {
        setUser(documentSnapshot.data());
      });
    })();

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);
  return <User.Provider value={{user, setUser, id}}>{children}</User.Provider>;
};

export {useUser, UserProvider};
