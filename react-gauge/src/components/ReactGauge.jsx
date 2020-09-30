import React from "react";
const Gauge = ({
  value = 50,

  min = 0,

  max = 100,

  label,

  units,
  amount = 15,
  fill = "black",
  gaugeAngle = 180,
  guideLine = false,
  dBetween = 2,
}) => {
  min = parseFloat(min);
  max = parseFloat(max);
  value = parseFloat(value);
  let beans = new Array(amount);
  let beanWidth = 2;
  let beancurve = beanWidth / 2;
  let v = 20;
  let a = beanWidth * 2;
  let h = 50,
    k = 50;
  let drawBean = `M ${h},${k} a ${beancurve} ${beancurve} 0 0 1 ${beanWidth},0 v ${beanWidth} a ${beancurve} ${beancurve} 0 0 1 -${beanWidth},0 v -${beanWidth} z`;
  let compensation = 90;

  if (gaugeAngle > 180) {
    compensation += (gaugeAngle - 180) / 2;
  } else if (gaugeAngle < 180) {
    compensation -= (180 - gaugeAngle) / 2;
  }
  console.log(compensation);
  for (let i = 0; i < beans.length; i++) {
    beans[i] = (
      <path
        id={"gaugeBean" + (i + 1)}
        key={i}
        fill={fill == null ? "black" : fill(i)}
        stroke="none"
        transform={`rotate(${
          i * (gaugeAngle / (beans.length - 1)) - compensation
        } ${h} ${k})
                    translate(-${beanWidth / 2} -${v})`}
        d={drawBean} //"M 50,50 a 0.5 0.5 0 0 1 1,0 v 1 a 0.5 0.5 0 0 1 -1,0 v -1 z"
      />
    );
  }
  //validar errores posibles
  if (min >= max) {
    console.log("valor minimo no puede ser mayor al maximo.");
    console.log("max", max);
    console.log("min", min);
    min = max - max * 100;
  }
  if (value > max) {
    console.log("valor no puede ser mayor al maximo.");
    console.log("max", max);
    console.log("value", value);
    value = max;
  }
  if (value < min) {
    console.log("valor no puede ser menor al minimo.");
    console.log("value", value);
    console.log("min", min);
  }

  let displayAngle1 = gaugeAngle / 2 - 90;
  let displayAngle2 = (gaugeAngle * ((value - max / 2) / max)) / 2 - 90;
  console.log(displayAngle1);

  let drawPipe1 = `M ${h},${k - a - v} A 23.5 23.5 0 0 0 
  ${Math.cos((displayAngle1 / 180) * Math.PI) * (a + v) + h}
  ${Math.sin((displayAngle1 / 180) * Math.PI) * (a + v) + k}`;

  console.log(displayAngle2);
  let drawPipe2 = `M ${h},${k - a - v} A 23.5 23.5 0 0 1 
  ${Math.cos((displayAngle2 / 180) * Math.PI) * (a + v) + h}
  ${Math.sin((displayAngle2 / 180) * Math.PI) * (a + v) + k}`; //hacer dos ellipses.
  let pipe1 = (
    <path
      id="gaugePipe"
      strokeLinecap="round"
      strokeWidth="1"
      stroke="black"
      fill="none"
      d={drawPipe1}
    />
  );
  let pipe2 = null;
  if (value > max / 2) {
    pipe2 = (
      <path
        id="gaugePipe"
        strokeLinecap="round"
        strokeWidth="1"
        stroke="black"
        fill="none"
        d={drawPipe2}
      />
    );
  }
  return (
    <div>
      <svg
        style={{
          border: "1ph solid pink",
        }}
        width="20em"
        viewBox="0 0 100 100"
      >
        {beans}
        {pipe1}
        {pipe2}
        {guideLine ? (
          <path strokeWidth="0.1" stroke="black" d="M 0 50 h 100" />
        ) : null}
        {guideLine ? (
          <path strokeWidth="0.1" stroke="black" d="M 50 0 v 100" />
        ) : null}
      </svg>
    </div>
  );
};

export default Gauge;
