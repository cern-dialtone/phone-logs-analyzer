import React from 'react';
import { Checkbox, Icon, Table } from 'semantic-ui-react';
import { convertJson, showCat, parselog, isJson, indexOfArray, ShowDetails } from '../functions/showCat';
import { showObject } from '../functions/showObject';
export class Interpret extends React.Component {
  constructor(props) {
    super(props);
    this.state = { treemode: false };
  }
  getType(txt) {
    if (!txt || !txt[0])
      return;
    let data = null;
    if (txt[0].indexOf('APP:') > -1)
      data = txt[0].split('%c')[1];
    else if (txt[0].indexOf('|') > -1)
      data = txt[0].split('|')[1];
    else if (txt[0].indexOf('hashed token:') > -1)
      data = txt[0].split(':')[0];
    else if (txt[0].indexOf('Warning:') > -1)
      data = 'Warning';
    else if (txt[0].indexOf(':') > -1)
      data = txt[0].substr(0, txt[0].lastIndexOf(':'));
    else if (typeof txt[0] == "string")
      data = txt[0];
    return data;
  }
  getInfos(txt, id) {
    if (!txt || !txt[0])
      return;
    let data = null;
      if (txt[0].indexOf('|') > -1)
      data = txt[0].split('|')[2];
    else if (txt[0].indexOf('APP:') > -1)
      data = txt[0].split('%c')[2];
    else if (txt[0].indexOf('hashed token:') > -1)
      data = txt[0].split(':')[1];
    else if (txt[0].indexOf('Warning:') > -1)
      data = txt[0].substr(txt[0].indexOf(':')+1, txt[0].indexOf(':').length);
    else if (txt[0].indexOf(':') > -1)
      data = txt[0].substr(txt[0].lastIndexOf(':')+1, txt[0].lastIndexOf(':').length);
    else if (typeof txt[0] == "string")
      data = txt[0];
    return data;
  }
  getTime(txt, start, id) {
    if (!txt || !txt[0] || !start)
      return;
    let current_time = parseInt(Date.parse(txt[txt.length-1]));
    let start_time = parseInt(Date.parse(start[start.length-1]));
    return "+"+(current_time-start_time)/1000+"s";
  }
  getColor(txt) {
    let r, g, b;
    for (let i = 0; txt[i]; i++)
      if (typeof txt[i] == "string" && txt[i].indexOf('color') > -1) {
        let color = txt[i].substr(txt[i].indexOf('#')+1, txt[i].indexOf('#').length);
        r = parseInt("0x"+color.substr(0, 2));
        g = parseInt("0x"+color.substr(3, 2));
        b = parseInt("0x"+color.substr(4, 2));
        color = "rgba("+r+", "+g+", "+b+", 0.3)";
        return color;
      }
    return "transparent";
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
    let table = [];
    let list = Object.keys(obj);
    for (let i = 0; list[i]; i++) {
      if (((filters && obj[list[i]][0] && indexOfArray(obj[list[i]][0], filters)) || !filters)
      && ((time && parseInt(Date.parse(obj[list[i]][obj[list[i]].length - 1])) === parseInt(time)) || !time))
        table.push(<Table.Row style={{ backgroundColor: this.getColor(obj[list[i]]) }} key={i+"_tablerow"}>
          <Table.Cell style={{ width: 'min-content' }}>{this.getType(obj[list[i]])}</Table.Cell>
          <Table.Cell style={{ wordWrap: 'break-word' }}>{this.getInfos(obj[list[i]], i)}{this.findtreetomake(obj[list[i]], i)}</Table.Cell>
          <Table.Cell style={{ width: '30px' }}>{this.getTime(obj[list[i]], obj[list[0]], i)}</Table.Cell></Table.Row>);
    }
    return table;
  }
  displaylogs() {
    return this.state.treemode ? <Table style={{ tableLayout: 'fixed' }} className="details"><Table.Header><Table.Row><Table.HeaderCell>Type</Table.HeaderCell><Table.HeaderCell>Infos</Table.HeaderCell><Table.HeaderCell>Time</Table.HeaderCell></Table.Row></Table.Header><Table.Body>
    {this.maketree(convertJson(this.props.value), this.props.filter, this.props.time)}</Table.Body></Table> : <pre>{this.props.value}</pre>;
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
