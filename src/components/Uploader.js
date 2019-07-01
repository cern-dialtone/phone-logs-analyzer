import React from 'react';
import { UploadForm } from './UploadForm';
import { isJson } from '../functions/showCat';
import { SystemData } from './SystemData';
import { Filters } from './Filters';
import { Interpret } from './Interpret';
import { TimeLine } from './TimeLine';
import { Events } from './Events';
import { Button } from 'semantic-ui-react'
import "semantic-ui-css/semantic.min.css";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: null,
      filter: null, // filter: {Array} containing words to find
      timeline: null, // POSIX TIME ONLY
      sortby: null // only one value available : 'time'
    };
    this.handler = this.handler.bind(this);
  }
  handler(obj) {
    this.setState(obj);
  }
  loadJson(e) {
    this.setState({ logs: e });
  }
  changePanel(e) {
    if (isJson(e)) {
      document.getElementById('interpret').classList.toggle('active');
      document.getElementById('home').classList.toggle('active');
    }
  }
  render() {
    return (<div>
      <div className="screen" id="home">
        <h1 className="title">Logs analyzer</h1>
        <UploadForm handler={this.handler} onChange={(e) => this.changePanel(e)} />
      </div>
      <div className="screen panel" id="interpret">
        <h1 className="bigtitle">
          Logs analyzer{' '}
          <Button primary onClick={() => {
            document.getElementById('home').classList.toggle('active');
            document.getElementById('interpret').classList.toggle('active');
          }}>
            Change log file
            </Button>
        </h1>
        <Interpret value={this.state.logs} filter={this.state.filter} time={this.state.timeline} handler={this.handler}/>
        <div className="right">
          <Filters handler={this.handler} filter={this.state.filter} time={this.state.timeline}/>
          <SystemData value={this.state.logs} />
        </div>
        <TimeLine value={isJson(this.state.logs) ? this.state.logs : null} handler={this.handler} filter={this.state.filter}/>
        <Events value={this.state.logs} />
      </div>
    </div>);
  }
}
