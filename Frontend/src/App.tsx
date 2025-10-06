import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { Protected } from './auth/Protected';
import Home from './pages/Home';
import Trips from './pages/Trips';
import Matches from './pages/Matches';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Callback from './pages/Callback';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <div>
      <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ddd' }}>
        <Link to="/">Home</Link>
        <Link to="/trips">Trips</Link>
        <Link to="/matches">Matches</Link>
        <Link to="/bookings">Bookings</Link>
        <Link to="/me">Mi Perfil</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
        <Route
          path="/trips"
          element={
            <Protected>
              <Trips />
            </Protected>
          }
        />
        <Route
          path="/matches"
          element={
            <Protected>
              <Matches />
            </Protected>
          }
        />
        <Route
          path="/bookings"
          element={
            <Protected>
              <Bookings />
            </Protected>
          }
        />
        <Route
          path="/me"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;

