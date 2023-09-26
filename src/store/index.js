import { createStore, useStore as vuexUseStore } from 'vuex';
import app from './modules/app';
import user from './modules/user';
import agent from './modules/agent';
import game from './modules/game';

export default () => {
  const store = createStore({
    strict: true,
    modules: {
      app: app(),
      user: user(),
      agent: agent(),
      game: game(),
    },
  });

  return store; // storeDispatchWarp(store);
};

export const useStore = () => vuexUseStore();
