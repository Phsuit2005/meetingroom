import { createContext, useContext, useEffect, useState } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from './firebase.js';
import { hasAdminAccess, isAdminEmail } from './adminAccess';
const AuthContext = createContext(null);
export function AuthProvider({children}) {
  const [user,setUser]=useState(null), [ready,setReady]=useState(false);
  const [admin,setAdmin]=useState(false);
  useEffect(()=>onIdTokenChanged(auth,u=>{setUser(u);setAdmin(hasAdminAccess(u));setReady(true)}),[]);
  async function refreshAccount(){if(auth.currentUser){await auth.currentUser.reload();await auth.currentUser.getIdToken(true);setUser(auth.currentUser);setAdmin(hasAdminAccess(auth.currentUser));}}
  return <AuthContext.Provider value={{user,ready,isAdmin:admin,isAdminCandidate:isAdminEmail(user?.email),refreshAccount}}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
