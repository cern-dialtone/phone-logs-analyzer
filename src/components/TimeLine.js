import React from 'react';
import { convertJson } from '../functions/showCat';
import { Chart } from 'chart.js'

export class TimeLine extends React.Component {
  /**
   * Handle TimeLine and time filter
   * 
   * @param {*} props 
   */
  constructor(props) {
    super(props);
    this.state = {
      logs: this.props.value,
      max: 0,
      min: Infinity,
      loaded: false,
      date_list: null,
    };
  }

  getTimeline(x, date_list) {
    /**
     * Find proportionnal equivalent between date and cursor position
     * 
     * @param {int} x - event.clientX
     * @param {Array} date_list - date_list is formated :
     *                                                      date_list['| Fri, 31 May 2019 12:48:42 GMT'] = 52; // 52 is the number of events at this date
     */
    if (!date_list)
      return;
    let timeformated = Object.keys(date_list)[Math.round(x * (Object.keys(date_list).length-1) / window.innerWidth)];
    timeformated = new Date(timeformated).getTime(); // we need to get POSIX format date
    this.props.handler({
      timeline: timeformated
    });
    document.getElementById('cursor').style.left = x + 'px';
    document.getElementById('time').innerHTML="+"+((timeformated-(new Date(Object.keys(date_list)[0]).getTime()))/1000)+"s";
    document.getElementById('time').style.left = x + 'px';
    document.getElementById('resetfilters').style.backgroundColor='rgba(0,0,0,0.2)';
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.value !== nextProps.value) // there's no need to update if logs don't change
      return (true);
    return (false);
  }

  componentDidUpdate() {
    if (!this.props.value)
      return;
    let logs = convertJson(this.props.value);
    let canvas = document.getElementById('canvas');
    let canv = canvas.getContext('2d');
    canv.clearRect(0,0,9000,9000);
    canv.width = document.getElementById('canvas').width;
    canv.height = document.getElementById('canvas').height - 10;
    let date = null;
    let date_list = [];
    let labels = [];
    for (let i = 0; Object.keys(logs)[i]; i++) {    // counting number of events by date
      date = logs[i][logs[i].length - 1];
      if (date && date_list[date] >= 1)
        date_list[date]++;
      else if (date && !date_list[date]) {
        date_list[date] = 1;
        labels.push("");   // add a blank value at labels array because there is no "hide labels" parameter in chartJs yet.
      }
    }
    document.getElementById('startDate').innerHTML=Object.keys(date_list)[0];
    document.getElementById('endDate').innerHTML=Object.keys(date_list)[Object.keys(date_list).length-1];
    this.setState({date_list: date_list});
    let data = [];
    for (let i = 0; date_list[Object.keys(date_list)[i]]; i++)
      data[i] = date_list[Object.keys(date_list)[i]];
    new Chart(canv, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of events',
                data: data,
                borderWidth: 0,
            }]
        },
        options: {
          tooltips: {
            callbacks: {
               label: function(tooltipItem) {
                      return tooltipItem.yLabel;
               }
            }
          },
          legend: {
            labels: {
              fontSize: 0
            },
            display: false
          },
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
      return (<div className="timeline" id="timeline" onMouseMove={e => this.getTimeline(e.clientX, this.state.date_list)}>
        <div id="cursor" />
        <div id="time">+0s</div>
        <canvas width={window.innerWidth - 20} height={(20 * window.innerHeight) / 100 - 20} className="canvas" id="canvas" />
      
        <div id="startDate"></div>
        <div id="endDate"></div>
      </div>);
    else
      return <div />;
  }
}
