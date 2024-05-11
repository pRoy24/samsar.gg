import logo from './logo.svg';
import './App.css';
import { UserProvider } from './contexts/UserContext';
import { AlertDialogProvider } from './contexts/AlertDialogContext';
import { ThirdwebProvider } from "thirdweb/react";
import Home from './components/landing/Home.tsx'
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { BrowserRouter } from 'react-router-dom';
const RPC_URL = process.env.REACT_APP_RPC_URL;

const config = {
  rpcUrl: RPC_URL,
  domain: 'samsar.gg',
  siweUri: 'https://samsr.gg/',
};


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ThirdwebProvider>
          <UserProvider>
            <AlertDialogProvider>
              <AuthKitProvider config={config}>
                <Home />
              </AuthKitProvider>
            </AlertDialogProvider>
          </UserProvider>
        </ThirdwebProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
