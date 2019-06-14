import React from 'react';
import { convertJson, parselog } from '../functions/showCat';
import { getInfos, getTime } from '../functions/parse_log';
export class Events extends React.Component {
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
    if (!data)
      return 'No data';
    let tree = [];
    for (let i = 0; Object.keys(data)[i]; i++)
      tree.push(<div key={i} className="event">
        {getInfos(data[i])} <span style={{ float: 'right' }}>{getTime(data[i], data[0], i*6)}</span>
      </div>);
    return tree;
  }
  render() {
    return (<div className="modal eventlist" id="eventlist">
      <div className="openclose" onClick={() => {
        this.OpenCloseModal();
      }} id="openclose">
        >
        </div>
      <div className="list">
        <h3>Events list</h3>
        {this.eventlist()}
      </div>
    </div>);
  }
}
