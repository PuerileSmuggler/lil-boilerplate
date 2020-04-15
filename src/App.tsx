import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import PageVitter from './pages/PageVitter/PageVitter';

interface PropsType {}

const App: React.FunctionComponent<PropsType> = () => {
  return (
    <Provider store={store}>
      <PageVitter/>
    </Provider>
  );
};

export default App;
