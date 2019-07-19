import React from 'react';
import { UploadForm } from './UploadForm';
import { convertJson } from '../functions/showCat';
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
      if (str.charAt(i) === '\n' && str.charAt(i+1) !== ' ')
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
    let tmp = "";
    let count = 0;

    for (let b = 0; b < array.length; b++) {
      next[b] = [];
      count = 0;
      tmp = "";
      for (let i=0; array[b].charAt(i); i++)
      {
        if (array[b].substr(i, 3) === ' | ' && count < 3)
        {
          i += 2;
          count++;
          next[b].push(tmp);
          tmp = "";
        }
        else
          tmp += array[b].charAt(i);
      }
      next[b].push(tmp);
    }
    return (next);
  }

  convertToJson(e) {
    let tmp;
    let tmp_date;
    let next = [];
    let system = false;
    let diff = 0; // used to jump system rows and stay sync (avoid this: 0,1,3,4,5,7...)

    tmp = e.split("\n");
    tmp.pop();
    tmp = this.split_data(tmp);
    for (let a = 0; a < tmp.length; a++) {
      if (tmp[a][3] && tmp[a][2] === "SYSTEM") {
        system = tmp[a][3].substr(1,tmp[a][3].length-2);
        system = system.split("\\\"");
        system = system.join("\"");
        system = JSON.parse(system);
        diff++; // jump
        continue;
      }
      next[a-diff] = [];
      tmp_date = new Date(tmp[a][1]).toString();
      
      // Filter part (Type)
        next[a-diff].push(tmp[a][2]);
      
      // Action Name part
      if (tmp[a].length < 4)
        next[a-diff].push(tmp[a][2]);
      else if (tmp[a][3].length >= 1)
        next[a-diff].push(tmp[a][3]);
      else
        next[a-diff].push(tmp[a][3]);
      
      // Object Part
      if (tmp[a].length < 4)
        next[a-diff].push(tmp[a][2]);
      else if (typeof tmp[a][3] === "object" && tmp[a][3].length > 1)
        next[a-diff].push(JSON.parse(tmp[a][3]));
      else
        next[a-diff].push(tmp[a][3]);

      // Adding Date ALWAYS as last parameter
      next[a-diff].push(tmp_date);
    }
    next.push(system);
    return (JSON.stringify(next));
  }

  changePanel(e) {
    let tmp;

    e = this.convertToJson(e);
    tmp = convertJson(e);
    console.log(tmp);
    this.setState({ logs: e });
    console.log((tmp) ? "Valid Json" : "Invalid Json", (tmp && tmp[tmp.length-1] && tmp[tmp.length-1].system) ? "got system data" : "No system data");
    if (tmp && tmp[tmp.length-1] && tmp[tmp.length-1].system) {
      document.getElementById('interpret').classList.toggle('active');
      document.getElementById('home').classList.toggle('active');
    }
  }
  render() {
    let tmp;
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
      <TimeLine value={((tmp = convertJson(this.state.logs)) && tmp[tmp.length-1].system) ? this.state.logs : null} handler={this.handler} filter={this.state.filter}/>
    </div>);
  }
}
