import React from 'react';
import './App.css';
import { Gauge } from './components/ReactGauge';
/*{//(n) => { return (n % 2 === 0) ? "#FFD25A" : "#FFAA5A"; }
//       } */
// let valor = 0;
// let sum = 1;
function App() {
  // setInterval(() => {
  //   if (valor >= 100 || valor < 0) {
  //     sum *= -1;
  //   }
  //   console.log(valor)
  //   valor += sum;
  // // }, 1000);
  //     <Gauge
  //       value={26}
  //       min={0}
  //       max={100}
  //       fillBean="#bababa"

  //       gaugeAngle={230}
  //     />
  return (
    <div className="App">
      <Gauge
        min={0}
        max={50}
        value={25}
        size={1000}
        valueFontSize={15}
        textValue={true}
        caption="Porcentaje de Datos si escribes texto"
        captionFontSize={5}
        gaugeAngle={230}
        fillBean="#bababa"
        move={true}
        animationTime={1000000}
      />
    </div>
  );
}

export default App;
