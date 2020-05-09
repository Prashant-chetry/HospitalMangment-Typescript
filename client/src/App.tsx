import React from 'react';
import NavBar from './components/route/NavBar';
import Routes from './components/route';

const MainApp: React.FC = function () {
  return (
    <>
      <NavBar />
      <Routes />
    </>
  );
};
export default MainApp;
