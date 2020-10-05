import React from 'react';
import './App.css';
import { Gauge } from './components/ReactGauge';
/*{//(n) => { return (n % 2 === 0) ? "#FFD25A" : "#FFAA5A"; }
//       } */
// let valor = 0;
// let sum = 1;
function App() {
  return (
    <div className="App">
      <Gauge
        min={0}
        max={100}
        value={50}
        size={500}
        valueFontSize={15}
        textValue={true}
        caption="Don't write too much text\n Or it wont work"
        captionFontSize={5}
        gaugeAngle={230}
        fillBean={(n) => { return ((n % 2 === 0) ? "#6a6a6a" : "#bababa") }}
        fillBeanValue={(n) => { return ((n % 2 === 0) ? "rgb(150, 40, 40)" : "rgb(190, 40, 50)") }}
        move={false}
        animationTime={10000}
      />
    </div>
  );
}

export default App;
