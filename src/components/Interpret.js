import React from 'react';
import { Checkbox, Table } from 'semantic-ui-react';
import { convertJson, isJson, indexOfArray } from '../functions/showCat';
import { showObject } from '../functions/showObject';
import { getType, getInfos, getColor, getTime } from '../functions/parse_log'

export class Interpret extends React.Component {
  constructor(props) {
    super(props);
    this.state = { treemode: true, sortby: null };
  }

  findtreetomake(txt, id) {
    for (let i = 0; txt[i]; i++)
      if (typeof txt[i] == "object")
        return <div key={(id/i)}><span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => {
          document.getElementById(id+"_"+i+"_tree").classList.toggle('showless');
          document.getElementById(id+"_"+i+"_tree").classList.toggle('infosless');
          document.getElementById(id+"_"+i+"show_more_link").innerHTML=document.getElementById(id+"_"+i+"show_more_link").innerHTML === "Show less" ? "Show more" : "Show less";
        }} id={id+"_"+i+"show_more_link"} key={id+"_"+i+"show_more_link"}>Show more</span>
        <div id={id+"_"+i+"_tree"} key={id+"_"+i+"_tree"} className="infosless">{showObject(txt[i])}</div></div>;
    return;
  }
  maketree(obj, filters, time) {
    if (!obj)
      return;
    let minusdate = null;
    let log_counter = 0;
    for (let i = 0; obj[Object.keys(obj)[i]]; i++)
      minusdate = (!minusdate || obj[Object.keys(obj)[i]][obj[Object.keys(obj)[i]].length-1] < minusdate) ? obj[Object.keys(obj)[i]][obj[Object.keys(obj)[i]].length-1] : minusdate;
    let table = [];
    let list = Object.keys(obj);
    for (let i = 0; list[i]; i++) {
      if (((filters && obj[list[i]][0] && indexOfArray(obj[list[i]][0], filters)) || !filters)
      && ((time && parseInt(Date.parse(obj[list[i]][obj[list[i]].length - 1])) === parseInt(time)) || !time)) {
        log_counter++;
        table.push(<Table.Row style={{ backgroundColor: getColor(obj[list[i]]) }} key={i+"_tablerow"}>
          <Table.Cell style={{ width: 'min-content' }}>{getType(obj[list[i]])}</Table.Cell>
          <Table.Cell style={{ wordWrap: 'break-word', maxHeight: '300px' }}>{getInfos(obj[list[i]], i)}{this.findtreetomake(obj[list[i]], i)}</Table.Cell>
          <Table.Cell style={{ width: '30px' }}>{getTime(obj[list[i]], [minusdate], i)} <span style={{ float: 'right' }} className="date">{obj[list[i]][obj[list[i]].length-1]}</span></Table.Cell></Table.Row>);
      }
    }
    if (document.getElementById('events_nbr'))
      document.getElementById('events_nbr').innerHTML=log_counter;
    return table;
  }

  sorted(data) {
    let i = 0;
    while (data[i+1])
    {
      if (data[i][data[i].length-1] > data[i+1][data[i+1].length-1])
        return (false);
      i++;
    }
    return (true);
  }

  displaylogs() {
    let data = convertJson(this.props.value);
    if (!this.sorted(data))
    {
      let count = 0;
      let i = 0;
        while (1)
        {
          if (data[i] && data[i+1] && data[i][data[i].length-1] > data[i+1][data[i+1].length-1])
          {
            let tmp = data[i];
            data[i] = data[i+1];
            data[i+1] = tmp;
            count = 0;
          }
          else
            count++;
          i++;
          if (i === data.length-1 && count >= data.length-1)
            break;
          if (i === data.length-1)
            i = 0;
        }
    }
    if (this.state.sortby)
      data.reverse();
    return this.state.treemode ? <Table style={{ tableLayout: 'fixed' }} className="details">
      <Table.Header><Table.Row>
        <Table.HeaderCell id="type">Type (<span id='events_nbr'></span> events)</Table.HeaderCell>
        <Table.HeaderCell id="infos">Infos</Table.HeaderCell>
        <Table.HeaderCell id="time_cat" onClick={() => {
          document.getElementById('time_cat').classList.toggle("sorted");
          this.setState({sortby: (!this.state.sortby ? 'time' : null)});
        }}>Time</Table.HeaderCell></Table.Row></Table.Header><Table.Body>
    {this.maketree(data, this.props.filter, this.props.time)}</Table.Body></Table> : <pre>{this.props.value}</pre>;
  }
  treemodeavailable() {
    if (!isJson(this.props.value)) {
      document.getElementById('treemode').style.opacity = '0.5';
      document.getElementById('treemodetoggle').setAttribute('disabled', '');
    }
    else {
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
    return (<React.Fragment>
      <div className="treemode" id="treemode">
        <Checkbox id="treemodetoggle" toggle onClick={() => {
          if (this.state.treemode)
            document.getElementById('treemodetoggle').setAttribute('checked', '');
          else
            document.getElementById('treemodetoggle').removeAttribute('checked');
          this.props.handler({ filter: null, timeline: null });
          this.setState({ treemode: !this.state.treemode });
        }} />
        <div className="text">Raw mode</div>
      </div>
      <div id="displaylogs" className="displaylogs">
        {this.displaylogs()}
      </div>
    </React.Fragment>);
  }
}
