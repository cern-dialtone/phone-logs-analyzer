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

    tmp = e.split("\n");
    tmp.pop();
    tmp = this.split_data(tmp);
    for (let a = 0; a < tmp.length; a++) {
      tmp[a][3] = JSON.parse(tmp[a][3]);
    }
    console.log(tmp);
    for (let a = 0; a < tmp.length; a++) {
      next[a] = [];
      console.log("NOT processed json : ", tmp[a]);
      tmp_date = new Date(tmp[a][1]).toString();
      if  (typeof tmp[a][3][0] === "object")
        next[a].push(JSON.stringify(Object.keys(tmp[a][3][0])[0]));
      else
        next[a].push(tmp[a][3][0]);
      if (tmp[a][3][1])
        next[a].push(tmp[a][3][1]);
      else
        next[a].push(tmp[a][3][0]);
      next[a].push(tmp_date);
      console.log("Processed json : ", next[a]);
    }
    next.push({
      "system":{
         "os":{
            "name":"Mac OS X",
            "version":"10_14_4",
            "resolution":"2560 x 1440",
            "aspectRatio":"1.78",
            "isMobileDevice":false
         },
         "browser":{
            "name":"Chrome",
            "version":"74.0.3729.169",
            "isPromisesSupported":true
         },
         "webrtc":{
            "enabled":true,
            "ortc":false,
            "webSocketsSupported":true,
            "isAudioContextSupported":true,
            "isSctpDataChannelsSupported":true,
            "isRtpDataChannelsSupported":true
         },
         "devices":{
            "getUserMediaAvailable":true,
            "hasMicrophonePermissions":true,
            "canChangeOutputDevice":true,
            "speakers":{
               "available":true,
               "count":3,
               "labels":[
                  "Default - Internal Microphone (Built-in)",
                  "Internal Microphone (Built-in)",
                  "HD Pro Webcam C920 (046d:082d)"
               ]
            },
            "microphones":{
               "available":true,
               "count":3,
               "labels":[
                  "Default - Internal Microphone (Built-in)",
                  "Internal Microphone (Built-in)",
                  "HD Pro Webcam C920 (046d:082d)"
               ]
            }
         },
         "ip":{
            "address":"Public: 194.12.179.126",
            "public":true,
            "ipv4":true
         }
      }
   });
   console.log(tmp);
    return (JSON.stringify(next));
  }

  changePanel(e) {
    e = this.convertToJson(e);
    this.setState({ logs: e });
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
