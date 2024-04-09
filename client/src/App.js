import logo from './logo.svg';
import './App.css';
import { UserProvider } from './contexts/UserContext';

import Home from './components/landing/Home.tsx'
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { BrowserRouter } from 'react-router-dom';

const config = {
  rpcUrl: 'https://optimism-mainnet.infura.io/v3/cbf1c4121d61444f826aa0d9e29697fa',
  domain: 'samsaraboard.com',
  siweUri: 'https://samsaraboard.com/login',
};


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <UserProvider>
      <AuthKitProvider config={config}>
        <Home />
      </AuthKitProvider>
      </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
