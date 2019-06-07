import React from 'react'
import ReactDOM from 'react-dom'
import { Form, TextArea, Input, Menu, Checkbox } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './index.css'
import './tree.css'
import { stringify } from 'querystring';

const UploadForm = (props) => {
    return (<Form className="upload" id='file' onChange={props.onChange}>
        <input type="file"/>
      <TextArea placeholder='Paste logs' id='paste' style={{marginTop: 50}}/>
    </Form>);
}
export default UploadForm

function showCat(id) {
    document.getElementById(id).parentElement.querySelector(".nested").classList.toggle("active");
    document.getElementById(id).classList.toggle("caret-down");
}

function parselog(string) {
    if (!string)
        return ("Data unreadable");
    let list = (string.indexOf('|') > -1) ? string.split("|") : string;
    return (Array.isArray(list) ? list[1] : list);
}

function convertJson(json) {
    if (isJson(json))
        return JSON.parse(json);
    return false;
}

function isJson(txt) {
    try {
        JSON.parse(txt);
    } catch (e) {
        return false;
    }
    return (txt ? true : false);
}

class SystemData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showinginfos: false};
    }

    listdevices(list) {
        let listli = [];
        for (let i = 0; list[i]; i++)
          listli.push(<li key={i}>{list[i]}</li>);
        return (<div>{listli}</div>);
    }

    render() {
        let data;
        if (!this.props || !this.props.value || !(data = convertJson(this.props.value)))
            return (<h3>No valid data detected.</h3>);
            data = data[data.length-1];
            if (!data.system)
                return (<h3>Required informations not found</h3>);
            return (
                <ul id="Tree">
                    <li><span className="caret" id='browser' onClick={() => { showCat('browser') }}>Browser</span>
                        <ul className="nested">
                            <li>{data.system.browser.name}</li>
                            <li>{data.system.browser.version}</li>
                        </ul>
                    </li>

                    <li><span className="caret" id='ip' onClick={() => { showCat('ip') }}>IP</span>
                        <ul className="nested">
                            <li>{data.system.ip.address}</li>
                            <li>{data.system.ip.ipv4 ? 'Ipv4' : 'NOT IPV4'}</li>
                        </ul>
                    </li>

                    <li><span className="caret" id='os' onClick={() => { showCat('os') }}>OS</span>
                        <ul className="nested">
                            <li>{data.system.os.name}</li>
                            <li>{data.system.os.version}</li>
                            <li>{data.system.os.resolution}</li>
                        </ul>
                    </li>

                    <li><span className="caret" id='devices' onClick={() => { showCat('devices') }}>Devices</span>
                        <ul className="nested">
                            <li><span className="caret" id='micro' onClick={() => { showCat('micro') }}>Microphones</span>
                                <ul className="nested">
                                    {this.listdevices(data.system.devices.microphones.labels)}
                                </ul>
                            </li>
                            <li><span className="caret" id='speakers' onClick={() => { showCat('speakers') }}>Speakers</span>
                                <ul className="nested">
                                    {this.listdevices(data.system.devices.speakers.labels)}
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li><span className="caret" id='webrtc' onClick={() => { showCat('webrtc') }}>Webrtc</span>
                        <ul className="nested">
                            {showObject(data.system.webrtc)}
                        </ul>
                    </li>
                </ul>
            );
    }
}

class Filters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
            <h2>Filters</h2>
            <Input focus placeholder='Search in logs' className='searchbar' onChange={() => { this.props.handler({filter: document.getElementById('searchbar').value}) }} id='searchbar'/>
            <Menu>
                <Menu.Item onClick={() => { this.props.handler({filter: 'TONE_IN'}) }}>Tone_In</Menu.Item>
                <Menu.Item onClick={() => { this.props.handler({filter: 'TONE_OUT'}) }}>Tone_Out</Menu.Item>
                <Menu.Item onClick={() => { this.props.handler({filter: 'sip'}) }}>SIP</Menu.Item>
                <Menu.Item onClick={() => { this.props.handler({filter: 'Fail'}) }}>Fail/Errors/Warnings</Menu.Item>
                <Menu.Item onClick={() => { this.props.handler({filter: null}) }}>Reset all filters</Menu.Item>
            </Menu>
            </div>
        );
    }
}

function showObject(obj) {
    if (typeof obj !== "object" || !obj)
        return (<span key="_" className="false">Can't read data OR NULL<br/></span>);
    let list = [];
    for (let i = 0; Object.keys(obj)[i]; i++)
    {
        if (typeof obj[Object.keys(obj)[i]] === "boolean")
            list.push(<span key={i+"_"}><b>{Object.keys(obj)[i]}:</b> {obj[Object.keys(obj)[i]] ? <span className='true'>true</span> : <span className='false'>false</span>}<br/></span>);
        else if (typeof obj[Object.keys(obj)[i]] === "string")
            list.push(<span key={i+"_"}><b>{Object.keys(obj)[i]}:</b> {obj[Object.keys(obj)[i]]}<br/></span>);
        else if (typeof obj[Object.keys(obj)[i]] === "object")
            list.push(<ul key={i+"_"}><b>{Object.keys(obj)[i]}:</b> {showObject(obj[Object.keys(obj)[i]])}</ul>);
        else
            list.push(<span key={i+"_"}><b>{Object.keys(obj)[i]}:</b> {stringify(obj[Object.keys(obj)[i]])}<br/></span>);
    }
    return (list);
}

function ShowDetails(props) {
    let obj = props.value;
    let list = [];
    for (let a = 0; Object.keys(obj)[a]; a++)
        list.push(<li key={a}>{(typeof obj[Object.keys(obj)[a]] === "object") ? showObject(obj[Object.keys(obj)[a]]) : obj[Object.keys(obj)[a]]}</li>);
    return (list);
}

class Interpret extends React.Component {
    constructor(props) {
        super(props);
        this.state = {treemode: false};
    }

    maketree(obj, filters) {
        if (!obj)
            return;
        let tree = [];
        let list = Object.keys(obj);
        for (let i = 0; list[i]; i++)
        {
            if ((filters && obj[list[i]][0] && obj[list[i]][0].indexOf(filters) > -1) || !filters)
              tree.push(<li key={i}><span className='caret' id={i} onClick={() => { showCat(i) }}><div className="action">{parselog(obj[list[i]][0])}
              </div><div className="date">{obj[list[i]][obj[list[i]].length-1]}</div></span><ul className='nested'><ShowDetails value={obj[list[i]]}/></ul></li>);
        }
        return (tree);
    }

    displaylogs() {
        return (this.state.treemode ? <ul className="Tree">{this.maketree(convertJson(this.props.value), this.props.filter)}</ul> : this.props.value);
    }

    treemodeavailable() {
        if (!isJson(this.props.value))
        {
            document.getElementById('treemode').style.opacity='0.5';
            document.getElementById('treemodetoggle').setAttribute('disabled', '');
        }
        else
        {
            document.getElementById('treemode').style.opacity='1';
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
        return (
            <React.Fragment>
                <div className="treemode" id='treemode'><Checkbox id="treemodetoggle" toggle onClick={() => { this.setState({treemode: (!this.state.treemode)}) }}/>
                    <div className="text">Tree mode</div>
                </div>
                <div id='displaylogs' className='displaylogs'><pre>{this.displaylogs()}</pre></div>
            </React.Fragment>
        );
    }
}

class TimeLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate() {
        if (!this.props.value)
            return;
        let logs = convertJson(this.props.value);
        let canvas = document.getElementById('canvas');
        let canv = canvas.getContext("2d");
        canv.width = window.innerWidth;
        canv.height = 5*window.innerHeight/100;
        canv.clearRect(0,0,9000,9000);
        console.log(logs);
    //    let timedata = [];
        for (let i = 0; Object.keys(logs)[i]; i++)
        {
            console.log(logs[Object.keys(logs)[i]][logs[Object.keys(logs)[i]].length-1]);
            //timedata[].push();
        }
    }

    render() {
        if (this.props.value)
            return (<canvas width={window.innerWidth} height={5*window.innerHeight/100} className="canvas" id="canvas"></canvas>);
        else
            return (<div></div>);
    }
}

class Events extends React.Component {
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
            return "No data";
        let tree = [];
        for (let i = 0; Object.keys(data)[i]; i++){
            console.log(i);
            tree.push(<div key={i} className="event">{parselog(data[Object.keys(data)[i]][0])}</div>);
        }
              return (tree);
    }

    render() {
        return (<div className="modal eventlist" id="eventlist">
            <div className="openclose" onClick={() => { this.OpenCloseModal() }} id="openclose">></div>
            <div className="list">
            <h3>Events list</h3>
            {this.eventlist()}
            </div></div>);
    }
}

class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                    logs: null,
                    filter: null,
                };
        this.handler = this.handler.bind(this);
    }

    handler(obj) {
        this.setState(obj);
    }

    render() {
        return (
            <div>
                <div className="screen">
                <h1 className="title">Logs analyzer</h1>
                <UploadForm onChange={() => { this.setState({logs: document.getElementById('paste').value}); 
        window.scrollTo({
            top: window.innerHeight,
            left: 0,
            behavior: 'smooth'
          });
          }} />
                </div>
                <div className="screen panel" id='interpret'>
                    <Interpret value={this.state.logs} filter={this.state.filter}/>
                    <div className="right">
                        <Filters handler={this.handler}/>
                        <SystemData value={this.state.logs}/>
                    </div>
                    <TimeLine value={(isJson(this.state.logs)) ? this.state.logs : null} handler={this.handler}/>
                    <Events value={this.state.logs}/>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
            <div>
              <Uploader />
            </div>
    , document.getElementById('root'));