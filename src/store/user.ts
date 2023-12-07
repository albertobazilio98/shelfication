import { defineStore } from 'pinia';
import { User } from 'firebase/auth';

export interface IUser {
  name: string
  uid: string
}

export interface IUserStore {
  user?: IUser
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): IUserStore => ({
    user: undefined,
  }),
  getters: {
    uid: (state) => state.user?.uid,
  },
  actions: {
    setUser(user: User) {
      this.user = {
        name: user.displayName!,
        uid: user.uid,
      };
    },
    destroyUser() {
      this.user = undefined;
    },
  },
});
