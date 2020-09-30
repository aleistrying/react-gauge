import React from 'react';
import './App.css';
import Gauge from './components/ReactGauge';

function App() {
  return (
    <div className="App">
      <Gauge
        value={75}
        min={0}
        max={100}
        amount={30}
        fill={(n) => { return (n % 2 === 0) ? "#FFD25A" : "#FFAA5A"; }}
        gaugeAngle={230}
        guideLine={true}
      />
    </div>
  );
}

export default App;
