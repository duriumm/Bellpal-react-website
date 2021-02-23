import React, { Component } from 'react';
import './App.css';
import ButtonBar from './components/buttonBar'

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional



function App() {
  return (
    <div
      className="App"
    // style={{ backgroundColor: "#FFEAD0" }}
    >

      <ButtonBar />

    </div>
  );
}


export default App;
