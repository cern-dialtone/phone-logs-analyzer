import React from 'react';
import { convertJson, parselog } from '../functions/showCat';
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
        {parselog(data[Object.keys(data)[i]][0])}
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
