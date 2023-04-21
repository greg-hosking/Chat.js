import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import Verification from './pages/auth/Verification';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Sidenav from './components/Sidenav';
import Rooms from './pages/Rooms';
import Room from './pages/Room';
import Friends from './pages/Friends';
import Settings from './pages/Settings';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <div className='public-content-container'>
              <Outlet />
            </div>
          }
        >
          <Route path='/' element={<SignIn />} />
          <Route path='sign-in' element={<SignIn />} />
          <Route path='sign-up' element={<SignUp />} />
          <Route path='verification' element={<Verification />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route path='reset-password' element={<ResetPassword />} />
        </Route>
        <Route
          path='/'
          element={
            <>
              <Sidenav />
              <div className='private-content-container'>
                <Outlet />
              </div>
            </>
          }
        >
          <Route path='/rooms' element={<Rooms />} />
          <Route path='/rooms/:roomName' element={<Room />} />
          <Route path='/friends' element={<Friends />} />
          <Route path='/settings' element={<Settings />} />
        </Route>
        <Route path='*' element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
