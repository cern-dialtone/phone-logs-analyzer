import React from 'react'
import ReactDOM from 'react-dom'
import { Form, TextArea, Input, Menu } from 'semantic-ui-react'
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

function convertJson(json) {
    return (JSON.parse(json));
}

class SystemData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showinginfos: false};
    }

    componentDidMount() {
        var toggler = document.getElementsByClassName("caret");
        console.log(toggler);
        var i;

        for (i = 0; i < toggler.length; i++) {
            console.log("adding eventlistener for toggler n"+i);
            toggler[i].addEventListener("click", function() {
                this.parentElement.querySelector(".nested").classList.toggle("active");
                this.classList.toggle("caret-down");
            });
        }
    }

    render(props) {

    console.log(props);
        let data;
        if (!this.props || !this.props.value || !(data = convertJson(this.props.value)))
            return (<h3>No valid data detected.</h3>);
            data = data[data.length-1];
            return (
                <ul id="Tree">
                    <li><span className="caret">Browser</span>
                        <ul className="nested">
                            <li>
                                {data.system.browser.name}
                            </li>
                            <li>
                                {data.system.browser.version}
                            </li>
                        </ul>
                    </li>

                    <li><span className="caret">IP</span>
                        <ul className="nested">
                            <li>
                                {data.system.ip.address}
                            </li>
                            <li>
                                {data.system.ip.ipv4}
                            </li>
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
                <div id='displaylogs' className='displaylogs'><pre>{this.state.logs}</pre></div>
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