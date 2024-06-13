import create from 'zustand';
import Cookies from 'js-cookie';

interface UserStore {
  email: string | null;
  username: string | null;
  userType: string | null;
  userId: string | null;
  setUserEmail: (email: string | null) => void;
  setUsername: (username: string | null) => void;
  setUserType: (userType: string | null) => void;
  setUserId: (userId: string | null) => void;
  clear:() => void
}

const useStore = create<UserStore>((set) => ({
  email: Cookies.get("token") || null,
  username: Cookies.get("username") || null,
  userType: Cookies.get("userType") || null,
  userId: Cookies.get("userId") || null,

  setUserEmail: (email) => {
    set({ email })
    Cookies.set('email', email!)
  },

  setUsername: (username) => {
    set({ username })
    Cookies.set('username', username!)
  },

  setUserType: (userType) => {
    set({ userType })
    Cookies.set('userType', userType!)
  },

  setUserId:(userId) =>{
    set({userId})
    Cookies.set("userId", userId!)
  },

  clear: () => {
    Cookies.remove("userType")
    set({userType: null})
    Cookies.remove("username")
    set({username: null})
    Cookies.remove("email")
    set({email: null})
    Cookies.remove("userId")
    set({userId: null})
  }
}));

export default useStore;