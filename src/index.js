import React from 'react';
import ReactDOM from 'react-dom';
import { Checkbox } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import './tree.css';
import { UploadForm } from './UploadForm';
import { convertJson, showCat, parselog, isJson } from './showCat';
import { SystemData } from './SystemData';
import { Filters } from './Filters';
import { showObject } from './showObject';

var timedata = [];

export default timedata;

function indexOfArray(txt, values) {
  for (let a = 0; values[a]; a++)
    if (txt.toUpperCase().indexOf(values[a].toUpperCase()) > -1) return true;
  return false;
}

function ShowDetails(props) {
  let obj = props.value;
  let list = [];
  for (let a = 0; Object.keys(obj)[a]; a++)
    list.push(
      <li key={a}>
        {typeof obj[Object.keys(obj)[a]] === 'object'
          ? showObject(obj[Object.keys(obj)[a]])
          : obj[Object.keys(obj)[a]]}
      </li>
    );
  return list;
}

class Interpret extends React.Component {
  constructor(props) {
    super(props);
    this.state = { treemode: false };
  }

  maketree(obj, filters, time) {
    if (!obj) return;
    let tree = [];
    let list = Object.keys(obj);
    for (let i = 0; list[i]; i++) {
      if (
        (filters &&
          obj[list[i]][0] &&
          indexOfArray(obj[list[i]][0], filters)) ||
        !filters
      ) {
        if (
          (time &&
            parseInt(Date.parse(obj[list[i]][obj[list[i]].length - 1])) ===
              parseInt(time)) ||
          !time
        ) {
          tree.push(
            <li key={i}>
              <span
                className="caret"
                id={i}
                onClick={() => {
                  showCat(i);
                }}
              >
                <div className="action">{parselog(obj[list[i]][0])}</div>
                <div className="date">
                  {obj[list[i]][obj[list[i]].length - 1]}
                </div>
              </span>
              <ul className="nested">
                <ShowDetails value={obj[list[i]]} />
              </ul>
            </li>
          );
        }
      }
    }
    return tree;
  }

  displaylogs() {
    return this.state.treemode ? (
      <ul className="Tree">
        {this.maketree(
          convertJson(this.props.value),
          this.props.filter,
          this.props.time
        )}
      </ul>
    ) : (
      this.props.value
    );
  }

  treemodeavailable() {
    if (!isJson(this.props.value)) {
      document.getElementById('treemode').style.opacity = '0.5';
      document.getElementById('treemodetoggle').setAttribute('disabled', '');
    } else {
      document.getElementById('treemode').style.opacity = '1';
      document.getElementById('treemodetoggle').removeAttribute('disabled');
    }
  }

  componentDidUpdate() {
    this.treemodeavailable();
  }

  componentDidMount() {
    this.treemodeavailable();
  }

  render() {
    return (
      <React.Fragment>
        <div className="treemode" id="treemode">
          <Checkbox
            id="treemodetoggle"
            toggle
            onClick={() => {
              this.setState({ treemode: !this.state.treemode });
            }}
          />
          <div className="text">Tree mode</div>
        </div>
        <div id="displaylogs" className="displaylogs">
          <pre>{this.displaylogs()}</pre>
        </div>
      </React.Fragment>
    );
  }
}

class TimeLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      max: 0,
      min: 9999999,
      loaded: false
    };
  }

  getTimeline(x, timedata) {
    if (!timedata) return;
    this.props.handler({
      timeline: Object.keys(timedata)[
        Math.round(
          (x.clientX * (Object.keys(timedata).length - 1)) / window.innerWidth
        )
      ]
    });
    document.getElementById('cursor').style.left=x.clientX+"px";
  }

  componentDidUpdate() {
    if (!this.props.value) return;
    let logs = convertJson(this.props.value);
    let canvas = document.getElementById('canvas');
    let canv = canvas.getContext('2d');
    canv.width = document.getElementById('canvas').width;
    canv.height = document.getElementById('canvas').height - 10;
    canv.clearRect(0, 0, 9000, 9000);
    let date = null;
    for (let i = 0; Object.keys(logs)[i]; i++) {
      date = new Date(logs[i][logs[i].length - 1]).getTime();
      if (date && timedata[date] >= 1) timedata[date]++;
      else if (date && !timedata[date]) timedata[date] = 1;
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
        canv.moveTo(
          0,
          (lastdot.y =
            canv.height -
            (timedata[Object.keys(timedata)[i]] * canv.height) / max)
        );
        i++;
      } else canv.moveTo(lastdot.x, lastdot.y);
      canv.lineWidth = 3;
      canv.lineTo(
        (lastdot.x += canv.width / (Object.keys(timedata).length - 1)),
        (lastdot.y =
          canv.height -
          (timedata[Object.keys(timedata)[i]] * canv.height) / max)
      );
      canv.strokeStyle = 'black';
      canv.stroke();
    }
    for (let i = 0; logs[i][0]; i++) {
      if (
        logs[i][0].indexOf('Error') > -1 ||
        logs[i][0].indexOf('Warning') > -1 ||
        logs[i][0].indexOf('Fail') > -1
      ) {
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
      return (
        <div
          className="timeline"
          id="timeline"
          onMouseMove={e => this.getTimeline(e, timedata)}
        >
        <div id="cursor"></div>
          <canvas
            width={window.innerWidth - 20}
            height={(10 * window.innerHeight) / 100 - 20}
            className="canvas"
            id="canvas"
          />
        </div>
      );
    else return <div />;
  }
}

class Events extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  OpenCloseModal() {
    document.getElementById('openclose').classList.toggle('open');
    document.getElementById('eventlist').classList.toggle('open');
  }

  eventlist() {
    let data = convertJson(this.props.value);
    if (!data) return 'No data';
    let tree = [];
    for (let i = 0; Object.keys(data)[i]; i++)
      tree.push(
        <div key={i} className="event">
          {parselog(data[Object.keys(data)[i]][0])}
        </div>
      );
    return tree;
  }

  render() {
    return (
      <div className="modal eventlist" id="eventlist">
        <div
          className="openclose"
          onClick={() => {
            this.OpenCloseModal();
          }}
          id="openclose"
        >
          >
        </div>
        <div className="list">
          <h3>Events list</h3>
          {this.eventlist()}
        </div>
      </div>
    );
  }
}

class Uploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: null,
      filter: null,
      timeline: null
    };
    this.handler = this.handler.bind(this);
  }

  handler(obj) {
    this.setState(obj);
  }

  render() {
    return (
      <div>
        <div className="screen" id="home">
          <h1 className="title">Logs analyzer</h1>
          <UploadForm
            onChange={() => {
              this.setState({ logs: document.getElementById('paste').value });
              if (isJson(document.getElementById('paste').value)) {
                document.getElementById('interpret').classList.toggle('active');
                document.getElementById('home').classList.toggle('active');
              }
            }}
          />
        </div>
        <div className="screen panel" id="interpret">
          <h1>
            Logs analyzer{' '}
            <button
              onClick={() => {
                document.getElementById('home').classList.toggle('active');
                document.getElementById('interpret').classList.toggle('active');
              }}
            >
              Change log file
            </button>
          </h1>
          <Interpret
            value={this.state.logs}
            filter={this.state.filter}
            time={this.state.timeline}
          />
          <div className="right">
            <Filters handler={this.handler} />
            <SystemData value={this.state.logs} />
          </div>
          <TimeLine
            value={isJson(this.state.logs) ? this.state.logs : null}
            handler={this.handler}
          />
          <Events value={this.state.logs} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <div>
    <Uploader />
  </div>,
  document.getElementById('root')
);
