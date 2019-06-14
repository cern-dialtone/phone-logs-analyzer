import React from 'react';
import { Checkbox, Icon, Table } from 'semantic-ui-react';
import { convertJson, showCat, parselog, isJson, indexOfArray, ShowDetails } from '../functions/showCat';
import { showObject } from '../functions/showObject';
import { getType, getInfos, getColor, getTime } from '../functions/parse_log'

export class Interpret extends React.Component {
  constructor(props) {
    super(props);
    this.state = { treemode: false, sortby: null };
  }

  findtreetomake(txt, id) {
    for (let i = 0; txt[i]; i++)
      if (typeof txt[i] == "object")
        return <div key={(id/i)}><a style={{ color: 'blue', cursor: 'pointer' }} onClick={() => {
          document.getElementById(id+"_"+i+"_tree").classList.toggle('showless');
          document.getElementById(id+"_"+i+"_tree").classList.toggle('infosless');
          document.getElementById(id+"_"+i+"show_more_link").innerHTML=document.getElementById(id+"_"+i+"show_more_link").innerHTML === "Show less" ? "Show more" : "Show less";
        }} id={id+"_"+i+"show_more_link"} key={id+"_"+i+"show_more_link"}>Show more</a>
        <div id={id+"_"+i+"_tree"} key={id+"_"+i+"_tree"} className="infosless">{showObject(txt[i])}</div></div>;
    return;
  }
  maketree(obj, filters, time) {
    if (!obj)
      return;
    let minusdate = null;
    obj.map((x) => { minusdate = (!minusdate || x[x.length-1] < minusdate) ? x[x.length-1] : minusdate});
    let table = [];
    let list = Object.keys(obj);
    for (let i = 0; list[i]; i++) {
      if (((filters && obj[list[i]][0] && indexOfArray(obj[list[i]][0], filters)) || !filters)
      && ((time && parseInt(Date.parse(obj[list[i]][obj[list[i]].length - 1])) === parseInt(time)) || !time))
        table.push(<Table.Row style={{ backgroundColor: getColor(obj[list[i]]) }} key={i+"_tablerow"}>
          <Table.Cell style={{ width: 'min-content' }}>{getType(obj[list[i]])}</Table.Cell>
          <Table.Cell style={{ wordWrap: 'break-word', maxHeight: '300px' }}>{getInfos(obj[list[i]], i)}{this.findtreetomake(obj[list[i]], i)}</Table.Cell>
          <Table.Cell style={{ width: '30px' }}>{getTime(obj[list[i]], [minusdate], i)}</Table.Cell></Table.Row>);
    }
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
          if (i == data.length-1 && count >= data.length-1)
            break;
          if (i == data.length-1)
            i = 0;
        }
    }
    if (this.state.sortby)
      data.reverse();
    return this.state.treemode ? <Table style={{ tableLayout: 'fixed' }} className="details">
      <Table.Header><Table.Row>
        <Table.HeaderCell id="type">Type</Table.HeaderCell>
        <Table.HeaderCell id="infos">Infos</Table.HeaderCell>
        <Table.HeaderCell id="time_cat" onClick={() => {
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
          this.props.handler({ filter: null, timeline: null });
          this.setState({ treemode: !this.state.treemode });
        }} />
        <div className="text">Tree mode</div>
      </div>
      <div id="displaylogs" className="displaylogs">
        {this.displaylogs()}
      </div>
    </React.Fragment>);
  }
}
