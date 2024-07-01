import React from 'react';
import './App.css';
import { Navbar} from './components/Navbar'
import { Routes,Route } from 'react-router-dom';
import {Practice} from './components/pages/Practice';
import Problems from './components/pages/Problems';
import {Home} from './components/pages/Home';
import {Login} from './components/pages/Login';
import {AddEditProblems} from './components/pages/AddEditProblems';

function App() {
  return (
      <div className="App bg-gray-50 min-h-screen text-center p-5">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-800 mb-6">
              Leetbud
          </h1>
        <Navbar/>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems" element={<Login />} />
          <Route path="/AddEditProblems" element={<AddEditProblems />} />
          <Route path="/AddEditProblems/:id" element={<AddEditProblems />} />
        </Routes>
    </div>
  );
}

export default App;
