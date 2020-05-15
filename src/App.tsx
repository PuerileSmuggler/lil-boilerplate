import React from 'react';
import logo from './logo.svg';
import { Provider } from 'react-redux';
import './App.css';
import { store } from './store';
import ParityPage from './pages/ParityPage';

interface PropsType {}

const App: React.FunctionComponent<PropsType> = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <ParityPage />
      </div>
    </Provider>
  );
};

export default App;
