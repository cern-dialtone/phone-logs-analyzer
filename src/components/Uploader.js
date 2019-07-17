import React from 'react';
import { UploadForm } from './UploadForm';
import { isJson } from '../functions/showCat';
import { SystemData } from './SystemData';
import { Filters } from './Filters';
import { Interpret } from './Interpret';
import { TimeLine } from './TimeLine';
import { Events } from './Events';
import { Button, Grid, Segment } from 'semantic-ui-react'
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

  split_actions(str) {
    let next = [];
    let cut = 0;
    let tmp = "";

    for (let i=0; str.charAt(i); i++)
    {
      if (str.charAt(i) === '\n' && str.charAt(i) === '\n' && str.charAt(i+1) !== ' ')
        cut = 1;
      if (cut) {
        next.push(tmp);
        tmp = "";
        cut = 0;
      }
      else
        tmp += str.charAt(i);
    }
    return (next);
  }

  split_data(array) {
    let next = [];
    let cut = 0;
    let tmp = "";
    let count = 0;

    for (let a = 0; a < array.length; a++) {
      next[a] = [];
      count = 0;
      for (let i=0; array[a].charAt(i); i++)
      {
        if (array[a].substr(i, 3) === ' | ' && count < 2)
        {
          i += 2;
          count++;
          next[a].push(tmp);
          tmp = "";
        }
        else
          tmp += array[a].charAt(i);
      }
      next[a].push(tmp);
    }
    return (next);
  }

  convertToJson(e) {
    let tmp;
    let next = [];

    tmp = this.split_actions(e);
    tmp = this.split_data(tmp);
    for (let a = 0; a < tmp.length; a++){

      tmp[a][2] = tmp[a][2].split('\'');
      tmp[a][2] = tmp[a][2].join('"');
      tmp[a][2] = tmp[a][2].split('undefined');
      tmp[a][2] = tmp[a][2].join('""');
    console.log(tmp[a][2]);
      tmp[a][2] = JSON.parse("["+tmp[a][2]+"]");}
    console.log(tmp);
  }

  changePanel(e) {
    e = this.convertToJson(e);
    if (isJson(e)) {
      document.getElementById('interpret').classList.toggle('active');
      document.getElementById('home').classList.toggle('active');
    }
  }
  render() {
    return (
    <div>
      <div className="screen" id="home">
        <h1 className="title">Logs analyzer</h1>
        <UploadForm handler={this.handler} onChange={(e) => this.changePanel(e)} />
      </div>
      <div className="screen panel" id="interpret">

      <Grid stackable columns={1}>
          <Grid.Column>
            <Segment width={16}>
              <h1 className="bigtitle">
                Logs analyzer{' '}
                <Button primary onClick={() => {
                  document.getElementById('home').classList.toggle('active');
                  document.getElementById('interpret').classList.toggle('active');
                }}>
                  Change log file
                  </Button>
              </h1>
            </Segment>
          </Grid.Column>
        </Grid>

        <Grid stackable doubling columns={2}>
          <Grid.Column width={6}>
            <Segment>
              <Filters handler={this.handler} filter={this.state.filter} time={this.state.timeline}/>
              <SystemData value={this.state.logs}/>
            </Segment>
          </Grid.Column>
          <Grid.Column width={10}>
            <Segment style={{ marginBottom: '20%' }}>
              <Interpret value={this.state.logs} filter={this.state.filter} time={this.state.timeline} handler={this.handler}/>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
      <Events value={this.state.logs}/>
      <TimeLine value={isJson(this.state.logs) ? this.state.logs : null} handler={this.handler} filter={this.state.filter}/>
    </div>);
  }
}
