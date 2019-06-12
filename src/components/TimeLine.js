import React from 'react';
import { convertJson } from '../functions/showCat';
import { timedata } from '../index';
export class TimeLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      max: 0,
      min: 9999999,
      loaded: false
    };
  }
  getTimeline(x, timedata) {
    if (!timedata)
      return;
    this.props.handler({
      timeline: Object.keys(timedata)[Math.round((x.clientX * (Object.keys(timedata).length - 1)) / window.innerWidth)]
    });
    document.getElementById('cursor').style.left = x.clientX + 'px';
  }
  componentDidUpdate() {
    if (!this.props.value)
      return;
    let logs = convertJson(this.props.value);
    let canvas = document.getElementById('canvas');
    let canv = canvas.getContext('2d');
    canv.width = document.getElementById('canvas').width;
    canv.height = document.getElementById('canvas').height - 10;
    canv.clearRect(0, 0, 9000, 9000);
    let date = null;
    for (let i = 0; Object.keys(logs)[i]; i++) {
      date = new Date(logs[i][logs[i].length - 1]).getTime();
      if (date && timedata[date] >= 1)
        timedata[date]++;
      else if (date && !timedata[date])
        timedata[date] = 1;
    }
    let min = 999999;
    let max = 0;
    for (let i = 0; Object.keys(timedata)[i]; i++) {
      max =
        timedata[Object.keys(timedata)[i]] > max
          ? timedata[Object.keys(timedata)[i]]
          : max;
      min =
        timedata[Object.keys(timedata)[i]] < min
          ? timedata[Object.keys(timedata)[i]]
          : min;
    }
    let lastdot = { x: 0, y: canv.height };
    for (let i = 0; Object.keys(timedata)[i]; i++) {
      canv.beginPath();
      if (i === 0) {
        canv.moveTo(0, (lastdot.y =
          canv.height -
          (timedata[Object.keys(timedata)[i]] * canv.height) / max));
        i++;
      }
      else
        canv.moveTo(lastdot.x, lastdot.y);
      canv.lineWidth = 3;
      canv.lineTo((lastdot.x += canv.width / (Object.keys(timedata).length - 1)), (lastdot.y =
        canv.height -
        (timedata[Object.keys(timedata)[i]] * canv.height) / max));
      canv.strokeStyle = 'black';
      canv.stroke();
    }
    for (let i = 0; logs[i] && logs[i][0]; i++) {
      if (logs[i][0].indexOf('Error') > -1 ||
        logs[i][0].indexOf('Warning') > -1 ||
        logs[i][0].indexOf('Fail') > -1) {
        canv.beginPath();
        canv.moveTo((i * window.innerWidth) / logs.length, 0);
        canv.lineTo((i * window.innerWidth) / logs.length, canv.height);
        canv.strokeStyle = 'red';
        canv.stroke();
      }
    }
  }
  render() {
    if (this.props.value)
      return (<div className="timeline" id="timeline" onMouseMove={e => this.getTimeline(e, timedata)}>
        <div id="cursor" />
        <canvas width={window.innerWidth - 20} height={(10 * window.innerHeight) / 100 - 20} className="canvas" id="canvas" />
      </div>);
    else
      return <div />;
  }
}
