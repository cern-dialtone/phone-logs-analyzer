import React from 'react';
import { UploadForm } from './UploadForm';
import { isJson } from '../functions/showCat';
import { SystemData } from './SystemData';
import { Filters } from './Filters';
import { Interpret } from './Interpret';
import { TimeLine } from './TimeLine';
import { Events } from './Events';
export class Uploader extends React.Component {
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
  loadJson(e) {
    this.setState({ logs: e });
    this.changePanel();
  }
  changePanel() {
    if (isJson(this.state.logs)) {
      document.getElementById('interpret').classList.toggle('active');
      document.getElementById('home').classList.toggle('active');
    }
  }
  render() {
    return (<div>
      <div className="screen" id="home">
        <h1 className="title">Logs analyzer</h1>
        <UploadForm onChange={e => {
          if (document.getElementById('paste').value) {
            this.setState({ logs: document.getElementById('paste').value });
            this.changePanel();
            return;
          }
          else if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            reader.onloadend = e => {
              this.loadJson(e.target.result);
            };
            reader.readAsText(e.target.files[0]);
          }
          this.changePanel();
        }} />
      </div>
      <div className="screen panel" id="interpret">
        <h1>
          Logs analyzer{' '}
          <button onClick={() => {
            document.getElementById('home').classList.toggle('active');
            document.getElementById('interpret').classList.toggle('active');
          }}>
            Change log file
            </button>
        </h1>
        <Interpret value={this.state.logs} filter={this.state.filter} time={this.state.timeline} />
        <div className="right">
          <Filters handler={this.handler} />
          <SystemData value={this.state.logs} />
        </div>
        <TimeLine value={isJson(this.state.logs) ? this.state.logs : null} handler={this.handler} />
        <Events value={this.state.logs} />
      </div>
    </div>);
  }
}
