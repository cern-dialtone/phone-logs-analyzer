import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { convertJson, showCat, parselog, isJson, indexOfArray, ShowDetails } from '../functions/showCat';
export class Interpret extends React.Component {
  constructor(props) {
    super(props);
    this.state = { treemode: false };
  }
  maketree(obj, filters, time) {
    if (!obj)
      return;
    let tree = [];
    let list = Object.keys(obj);
    for (let i = 0; list[i]; i++) {
      if ((filters &&
        obj[list[i]][0] &&
        indexOfArray(obj[list[i]][0], filters)) ||
        !filters) {
        if ((time &&
          parseInt(Date.parse(obj[list[i]][obj[list[i]].length - 1])) ===
          parseInt(time)) ||
          !time) {
          tree.push(<li key={i}>
            <span className="caret" id={i} onClick={() => {
              showCat(i);
            }}>
              <div className="action">{parselog(obj[list[i]][0])}</div>
              <div className="date">
                {obj[list[i]][obj[list[i]].length - 1]}
              </div>
            </span>
            <ul className="nested">
              <ShowDetails value={obj[list[i]]} />
            </ul>
          </li>);
        }
      }
    }
    return tree;
  }
  displaylogs() {
    return this.state.treemode ? (<ul className="Tree">
      {this.maketree(convertJson(this.props.value), this.props.filter, this.props.time)}
    </ul>) : (this.props.value);
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
          this.setState({ treemode: !this.state.treemode });
        }} />
        <div className="text">Tree mode</div>
      </div>
      <div id="displaylogs" className="displaylogs">
        <pre>{this.displaylogs()}</pre>
      </div>
    </React.Fragment>);
  }
}
