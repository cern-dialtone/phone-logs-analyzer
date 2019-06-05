import React from 'react'
import ReactDOM from 'react-dom'
import { Form, TextArea, Input, Menu } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './index.css'

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

function Interpret(props) {
        console.log(props);
        return (
        <div id='displaylogs' className='displaylogs'><pre>{props.value}</pre></div>
        );
}

function SystemData(props) {
        console.log(props);
        return (
            <div className="right">
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
                    newlogs: null
                };
        console.log(this.state);
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
                <SystemData value={this.state.logs}/>
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