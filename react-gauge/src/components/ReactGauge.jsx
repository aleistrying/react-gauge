import React from "react";
class Gauge extends React.Component {
    constructor(props) {
        super();
        // this.state.value = parseFloat(props.value) || 50;
        this.min = parseFloat(props.min) || 0;
        this.max = parseFloat(props.max) || 100;
        this.caption = props.caption || "Eficiencia";
        this.amount = parseInt(props.amount) || 25;
        this.fillBean = props.fillBean || "#bababa";
        this.barColor = props.barColor || "rgb(96, 197, 75)";
        this.barDotColor = props.barDotColor || "rgba(83, 167, 66,1)";
        this.lineStrokeColor = props.lineStrokeColor || "#bababa";
        this.gaugeAngle = parseFloat(props.gaugeAngle) || 200;
        this.guideLine = props.guideLine || false;
        this.fontFamily = props.fontFamily || "Lato";
        this.fontWeight = props.fontWeight || "200";
        this.captionFontSize = props.captionFontSize || 15;
        this.valueFontSize = props.valueFontSize || 15;
        this.width = props.size || 500;
        this.height = props.size || 500;
        this.textValue = props.textValue || false;
        this.animationSpeed = 0.1;// move/time )
        this.animationTime = props.animationTime || 15000;
        if (this.animationTime <= 2000) {
            this.animationTime = 10000;
        }
        this.state = { value: parseFloat(props.value) || 50, moveFactor: 1 };

        this.updateSpeed = this.animationTime * this.animationSpeed / (this.max - this.min);
        this.polarToCartesian = this.polarToCartesian.bind(this);
        this.describeArc = this.describeArc.bind(this);
        this.moveBar = this.moveBar.bind(this);


        //variables to create objects(beans,and curved lines)
        this.dotRadius = 1;
        this.beans = Array(this.amount);
        this.beanWidth = 1;
        this.beancurve = this.beanWidth * 1 / 4;
        this.v = 20;
        this.a = this.beanWidth * 3;
        this.h = 50;
        this.k = 50;
        this.compensation = 90;
        if (this.gaugeAngle > 180) {
            this.compensation += this.gaugeAngle / 2 - 90;
        } else if (this.gaugeAngle < 180) {
            this.compensation -= 90 - this.gaugeAngle / 2;
        }

    }

    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
        };
    }

    describeArc(x, y, radius, startAngle, endAngle) {
        var start = this.polarToCartesian(x, y, radius, endAngle - 90);
        var end = this.polarToCartesian(x, y, radius, startAngle - 90);

        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M",
            start.x,
            start.y,
            "A",
            radius,
            radius,
            0,
            arcSweep,
            0,
            end.x,
            end.y,
        ].join(" ");

        return d;
    }
    moveBar(n) {
        this.setState((state) => ({
            value: state.value + n
        }));
    }

    componentDidMount() {
        if (this.props.move === true) {
            this.timerID = setInterval(() => {
                if (this.state.value <= this.min && this.state.moveFactor === -1) {
                    this.setState((state) => {
                        state.moveFactor = 1
                    });
                }
                else if (this.state.value >= this.max && this.state.moveFactor === 1) {
                    this.setState((state) => {
                        state.moveFactor = -1
                    });
                }
                this.moveBar(this.animationSpeed * this.state.moveFactor);

            }, this.updateSpeed);
        }
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    render() { 
        this.drawBean = `M ${this.h},${this.k} a ${this.beancurve} ${this.beancurve} 0 0 1 ${this.beanWidth},0 v ${this.beanWidth} a ${this.beancurve} ${this.beancurve} 0 0 1 -${this.beanWidth},0 v -${this.beanWidth} z`;
        this.beans = [];
        for (let i = 0; i < this.amount; i++) {
            this.beans.push(
                <path
                    id={"gaugeBean" + (i + 1)}
                    key={i}
                    fill={
                        this.state.value <= (this.max / this.amount) * i
                            ? typeof this.fillBean
                                ? this.fillBean
                                : this.fillBean(i)
                            : "rgb(194, 60, 60)"
                    }
                    transform={`rotate(${i * (this.gaugeAngle / (this.amount - 1)) - this.compensation
                        } ${this.h} ${this.k})
                          translate(-${this.beanWidth / 2} -${this.v})`}
                    d={this.drawBean} //"M 50,50 a 0.5 0.5 0 0 1 1,0 v 1 a 0.5 0.5 0 0 1 -1,0 v -1 z"
                />
            );
        }
        console.log(this.beans);
        //validar errores posibles
        if (this.min >= this.max) {
            // console.log("valor this.minimo no puede ser mayor al this.maximo.");
            // console.log("this.max", this.max);
            // console.log("this.min", this.min);
            this.min = this.max - this.max * 2;
        }
        if (this.state.value > this.max) {
            // console.log("valor no puede ser mayor al this.maximo.");
            // console.log("this.max", this.max);
            // console.log("this.state.value", this.state.value);
            this.setState((state) => {
                state.value = this.max;
            });
        }
        if (this.state.value < this.min) {
            // console.log("valor no puede ser menor al this.minimo.");
            // console.log("this.state.value", this.state.value);
            // console.log("this.min", this.min);
        }
        this.dotLocation = this.polarToCartesian(
            this.h,
            this.k,
            this.a + this.v,
            this.gaugeAngle * (this.state.value / this.max) -
            this.gaugeAngle / 2
        );
        return (
            <svg
                style={{
                    border: "1ph solid pink",
                }}
                width={this.width}
                height={this.height}
                viewBox={[20, 20, 60, 60].join(" ")}
            >
                {this.beans}
                <path
                    key="totalbar"
                    strokeLinecap="round"
                    strokeWidth="0.8"
                    fill="none"
                    d={this.describeArc(
                        this.h,
                        this.k,
                        this.a + this.v,
                        90 - this.gaugeAngle / 2,
                        this.gaugeAngle - this.gaugeAngle / 2 + 90
                    )}
                    stroke={this.lineStrokeColor}
                /> <path
                    key="valuebar"
                    strokeLinecap="round"
                    strokeWidth="0.8"
                    fill="none"
                    d={this.describeArc(
                        this.h,
                        this.k,
                        this.a + this.v,
                        90 - this.gaugeAngle / 2,
                        this.gaugeAngle * (this.state.value / this.max) - this.gaugeAngle / 2 + 90
                    )}
                    stroke={this.barColor}
                />

                <circle
                    cx={
                        this.dotLocation.x
                    }
                    cy={
                        this.dotLocation.y
                    }
                    r={this.dotRadius}
                    fill={this.barDotColor}
                />
                {this.caption ? (
                    <text textAnchor="middle" x={this.h} y={this.k + this.v} id="captionGaugeId" fontFamily={this.fontFamily} fontWeight={this.fontWeight} fontSize={this.captionFontSize + "px"}>
                        {this.caption}
                    </text>
                ) : ""}
                {this.textValue ? (
                    <text textAnchor="middle" x={this.h} y={this.k + this.v / 2} id="textValueGaugeId" fontFamily={this.fontFamily} fontWeight={this.fontWeight} fontSize={this.valueFontSize + "px"}>
                        {Math.round(this.state.value)}
                    </text>
                ) : ""}

                {this.guideLine ? (
                    <path strokeWidth="0.1" stroke="black" d="M 0 50 h 100" />
                ) : ""}
                {this.guideLine ? (
                    <path strokeWidth="0.1" stroke="black" d="M 50 0 v 100" />
                ) : ""}
            </svg>
        );
    }
}

// const Gauge = ({
//     value = 50,
//     min = 0,
//     max = 100,
//     caption = "a",
//     amount = 25,
//     fillBean = "#bababa",
//     barColor = "rgb(96, 197, 75)",
//     barDotColor = "rgb(83, 167, 66)",
//     lineStrokeColor = "#bababa",
//     gaugeAngle = 180,
//     guideLine = false,
// }) => {
//     min = parseFloat(min);
//     max = parseFloat(max);
//     value = parseFloat(value);
//     let dotRadius = 1;
//     let beans = new Array(amount);
//     let beanWidth = 1.2;
//     let beancurve = beanWidth / 2;
//     let v = 20;
//     let a = beanWidth * 3;
//     let h = 50,
//         k = 50;
//     let drawBean = `M ${h},${k} a ${beancurve} ${beancurve} 0 0 1 ${beanWidth},0 v ${beanWidth} a ${beancurve} ${beancurve} 0 0 1 -${beanWidth},0 v -${beanWidth} z`;
//     let compensation = 90;

//     if (gaugeAngle > 180) {
//         compensation += gaugeAngle / 2 - 90;
//     } else if (gaugeAngle < 180) {
//         compensation -= 90 - gaugeAngle / 2;
//     }
//     for (let i = 0; i < beans.length; i++) {
//         beans[i] = (
//             <path
//                 id={"gaugeBean" + (i + 1)}
//                 key={i}
//                 fill={
//                     value <= (max / amount) * i
//                         ? typeof fillBean
//                             ? fillBean
//                             : fillBean(i)
//                         : "rgb(194, 60, 60)"
//                 }
//                 transform={`rotate(${i * (gaugeAngle / (beans.length - 1)) - compensation
//                     } ${h} ${k})
//                     translate(-${beanWidth / 2} -${v})`}
//                 d={drawBean} //"M 50,50 a 0.5 0.5 0 0 1 1,0 v 1 a 0.5 0.5 0 0 1 -1,0 v -1 z"
//             />
//         );
//     }
//     //validar errores posibles
//     if (min >= max) {
//         console.log("valor minimo no puede ser mayor al maximo.");
//         console.log("max", max);
//         console.log("min", min);
//         min = max - max * 100;
//     }
//     if (value > max) {
//         console.log("valor no puede ser mayor al maximo.");
//         console.log("max", max);
//         console.log("value", value);
//         value = max;
//     }
//     if (value < min) {
//         console.log("valor no puede ser menor al minimo.");
//         console.log("value", value);
//         console.log("min", min);
//     }

//     function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
//         var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

//         return {
//             x: centerX + radius * Math.cos(angleInRadians),
//             y: centerY + radius * Math.sin(angleInRadians),
//         };
//     }

//     function describeArc(x, y, radius, startAngle, endAngle) {
//         var start = polarToCartesian(x, y, radius, endAngle - 90);
//         var end = polarToCartesian(x, y, radius, startAngle - 90);

//         var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

//         var d = [
//             "M",
//             start.x,
//             start.y,
//             "A",
//             radius,
//             radius,
//             0,
//             arcSweep,
//             0,
//             end.x,
//             end.y,
//         ].join(" ");

//         return d;
//     }
//     return (
//         <svg
//             style={{
//                 border: "1ph solid pink",
//             }}
//             width="300"
//             height="300"
//             viewBox="0 0 100 100"
//         >
//             {beans}
//             <path
//                 key="1"
//                 strokeLinecap="round"
//                 strokeWidth="0.8"
//                 fill="none"
//                 d={describeArc(
//                     h,
//                     k,
//                     a + v,
//                     90 - gaugeAngle / 2,
//                     gaugeAngle - gaugeAngle / 2 + 90
//                 )}
//                 stroke={lineStrokeColor}
//             />
//             <path
//                 key="2"
//                 strokeLinecap="round"
//                 strokeWidth="0.8"
//                 fill="none"
//                 d={describeArc(
//                     h,
//                     k,
//                     a + v,
//                     90 - gaugeAngle / 2,
//                     gaugeAngle * (value / max) - gaugeAngle / 2 + 90
//                 )}
//                 stroke={barColor}
//             />
//             {caption ? (
//                 <text x={h} y={k} id={caption + "id"}>
//                     caption
//                 </text>
//             ) : null}
//             <circle
//                 cx={
//                     polarToCartesian(
//                         h,
//                         k,
//                         a + v,
//                         gaugeAngle * (value / max) - gaugeAngle / 2
//                     ).x
//                 }
//                 cy={
//                     polarToCartesian(
//                         h,
//                         k,
//                         a + v,
//                         gaugeAngle * (value / max) - gaugeAngle / 2
//                     ).y
//                 }
//                 r={dotRadius}
//                 fill={barDotColor}
//             />
//             {guideLine ? (
//                 <path strokeWidth="0.1" stroke="black" d="M 0 50 h 100" />
//             ) : null}
//             {guideLine ? (
//                 <path strokeWidth="0.1" stroke="black" d="M 50 0 v 100" />
//             ) : null}
//         </svg>
//     );
// };

export { Gauge };
