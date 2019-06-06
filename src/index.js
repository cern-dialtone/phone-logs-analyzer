import React from 'react'
import ReactDOM from 'react-dom'
import { Form, TextArea, Input, Menu, Checkbox } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './index.css'
import './tree.css'

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

    webrtcinfos(webrtc) {
        let list = [];
        for (let i = 0; Object.keys(webrtc)[i]; i++)
            list.push(<li key={i+"_"}>{Object.keys(webrtc)[i]}: {webrtc[Object.keys(webrtc)[i]] ? <span className='true'>true</span> : <span className='true'>false</span>}</li>);
        return (list);
    }

    render() {
        let data;
        if (!this.props || !this.props.value || !(data = convertJson(this.props.value)))
            return (<h3>No valid data detected.</h3>);
            data = data[data.length-1];
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
                            {this.webrtcinfos(data.system.webrtc)}
                        </ul>
                    </li>
                </ul>
            );
    }
}

function Filters(props) {
    return (
        <div>
        <h2>Filters</h2>
        <Input focus placeholder='Search in logs' className='searchbar'/>
        <Menu>
            <Menu.Item>Tone_In</Menu.Item>
            <Menu.Item>Tone_Out</Menu.Item>
            <Menu.Item>SIP</Menu.Item>
            <Menu.Item>Fail/Errors/Warnings</Menu.Item>
            <Menu.Item>Reset all filters</Menu.Item>
        </Menu>
        </div>
    );
}

class Interpret extends React.Component {
    constructor(props) {
        super(props);
        this.state = {treemode: false};
    }

    showDetails(obj) {
        let list = [];
        for (let i = 0; Object.keys(obj)[i]; i++)
            list.push(<li>{Object.keys(obj)[i]}: {obj[Object.keys(obj)[i]]}</li>);
        return (list);
    }

    parselog(string) {
        if (!string)
            return ("Data unreadable");
        let list = (string.indexOf('|') > -1) ? string.split("|") : string;
        return (Array.isArray(list) ? list[1] : list);
    }

    maketree(obj) {
        if (!obj)
            return;
        console.log(obj);
        let tree = [];
        let list = Object.keys(obj);
        for (let i = 0; list[i]; i++)
            tree.push(<li key={i}><span className='caret' id={i} onClick={() => { showCat(i) }}>{this.parselog(obj[list[i]][0])} {obj[list[i]][obj[list[i]].length-1]}</span><ul className='nested'>this.showDetails(obj[list[i]])</ul></li>);
        return (tree);
    }

    displaylogs() {
        return (this.state.treemode ? <ul className="Tree">{this.maketree(convertJson(this.props.value))}</ul> : this.props.value);
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

class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                    logs: null,
                };
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
                    <Interpret value={this.state.logs}/>
                    <div className="right">
                        <Filters />
                        <SystemData value={this.state.logs}/>
                    </div>
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