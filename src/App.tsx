import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store'; // Import your Redux store
import Chat from './components/Chat';  // Import the Chat component
import './index.css'; // Ensure this file contains Tailwind CSS imports

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <Chat />  {/* Render the Chat component */}
      </div>
    </Provider>
  );
}

export default App;
