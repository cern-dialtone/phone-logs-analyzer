import React from 'react'
import ReactDOM from 'react-dom'
import { Form, TextArea } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './index.css'

const UploadForm = (props) => {
    return (<Form className="upload" onChange={props.onChange}>
        <input type="file"/>
      <TextArea placeholder='Paste logs' style={{marginTop: 50}}/>
    </Form>);
}
export default UploadForm

class Panel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {screen:'upload'};
    }

    render() {
            return <UploadForm onChange={() => this.loadlogs()}/>;
    }
}

class Body extends React.Component {
    render() {
        return <div>
            <h1 className="title">Logs analyzer</h1>
            <Panel />
            </div>;
    }
}

ReactDOM.render(<Body />, document.getElementById('root'));