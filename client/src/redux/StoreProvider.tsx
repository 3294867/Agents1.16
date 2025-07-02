import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { setupListeners } from '@reduxjs/toolkit/query';
import store from 'src/redux/store';

interface StoreProviderProps {
  children: ReactNode;
};

const StoreProvider = (props: StoreProviderProps) => {
  useEffect(() => {
    const unsubscribe = setupListeners(store.dispatch);
    return unsubscribe;
  },[]);

  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  )
};

export default StoreProvider;