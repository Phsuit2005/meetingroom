import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
const AuthContext = createContext(null);
export function AuthProvider({children}) {
  const [user,setUser]=useState(null); const [ready,setReady]=useState(false);
  useEffect(()=>onAuthStateChanged(auth,u=>{setUser(u);setReady(true)}),[]);
  return <AuthContext.Provider value={{user,ready}}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
