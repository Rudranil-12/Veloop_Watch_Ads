import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Preloader from './components/preloader/Preloader';
import { AppDataProvider } from './context/AppDataContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './layouts/AppLayout';
import ExchangeCenter from './pages/ExchangeCenter/ExchangeCenter';
import Tasks from './pages/Tasks/Tasks';
import Offers from './pages/Offers/Offers';
import ReferEarn from './pages/ReferEarn/ReferEarn';
import Wallet from './pages/Wallet/Wallet';
import WithdrawHistory from './pages/WithdrawHistory/WithdrawHistory';
import Profile from './pages/Profile/Profile';
import Support from './pages/Support/Support';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ThemeProvider>
      {loading && <Preloader onDone={() => setLoading(false)} />}
      {!loading && (
        <AppDataProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<ExchangeCenter />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/refer" element={<ReferEarn />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/withdraw-history" element={<WithdrawHistory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/support" element={<Support />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppDataProvider>
      )}
    </ThemeProvider>
  );
}
