import { create } from 'zustand'
import { User } from '../types/user'
import userData from '../data/users.json'

interface UserStore {
  users: User[]
  currentUser: User | null
  fetchUsers: () => void
  setCurrentUser: (user: User) => void
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  currentUser: null,
  fetchUsers: () => {
    set({ users: userData.users })
    set({ currentUser: userData.users[0] }) // Set first user as current user
  },
  setCurrentUser: (user) => set({ currentUser: user })
})) 