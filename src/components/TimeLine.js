import React from 'react';
import { convertJson, indexOfArray } from '../functions/showCat';
import { Chart } from 'chart.js'

export class TimeLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: this.props.value,
      max: 0,
      min: 9999999,
      loaded: false
    };
  }
  getTimeline(x, date_list) {
    if (!date_list)
      return;
      let timeformated = Object.keys(date_list)[Math.round((x.clientX * (Object.keys(date_list).length - 1)) / window.innerWidth)];
      console.log("timeformated", timeformated);
    this.props.handler({
      timeline: timeformated
    });
    document.getElementById('cursor').style.left = x.clientX + 'px';
    document.getElementById('time').innerHTML="+"+((timeformated-Object.keys(date_list)[0])/1000)+"s";
    document.getElementById('time').style.left = x.clientX + 'px';
    document.getElementById('resetfilters').style.backgroundColor='rgba(0,0,0,0.2)';
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.value !== nextProps.value)
      return (true);
    return (false);
  }

  componentDidUpdate() {
    if (!this.props.value)
      return;
    let logs = convertJson(this.props.value);
    let canvas = document.getElementById('canvas');
    let canv = canvas.getContext('2d');
    canv.width = document.getElementById('canvas').width;
    canv.height = document.getElementById('canvas').height - 10;
    let date = null;
    let date_list = [];
    for (let i = 0; Object.keys(logs)[i]; i++) {
      date = logs[i][logs[i].length - 1];
      if (date && date_list[date] >= 1)
        date_list[date]++;
      else if (date && !date_list[date])
        date_list[date] = 1;
    }
    let data = [];
    for (let i = 0; date_list[Object.keys(date_list)[i]]; i++)
      data[i] = date_list[Object.keys(date_list)[i]];
    var myChart = new Chart(canv, {
        type: 'line',
        data: {
            labels: Object.keys(date_list),
            datasets: [{
                label: 'Number of events',
                data: data,
                borderWidth: 0,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
  }
  render() {
    if (this.props.value)
      return (<div className="timeline" id="timeline" onMouseMove={e => this.getTimeline(e, this.props.value)}>
        <div id="cursor" />
        <div id="time">+0s</div>
        <canvas width={window.innerWidth - 20} height={(20 * window.innerHeight) / 100 - 20} className="canvas" id="canvas" />
      </div>);
    else
      return <div />;
  }
}
