import React from 'react';
import { Input, Menu } from 'semantic-ui-react';
export class Filters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (<div>
            <h2>Filters</h2>
            <Input focus placeholder='Search in logs' className='searchbar' onChange={() => { this.props.handler({ filter: [document.getElementById('searchbar').value], timeline: null }); }} id='searchbar' />
            <Menu>
                <Menu.Item onClick={() => { this.props.handler({ filter: ['TONE_IN'] }); }}>Tone_In</Menu.Item>
                <Menu.Item onClick={() => { this.props.handler({ filter: ['TONE_OUT'] }); }}>Tone_Out</Menu.Item>
                <Menu.Item onClick={() => { this.props.handler({ filter: ['sip'] }); }}>SIP</Menu.Item>
                <Menu.Item onClick={() => { this.props.handler({ filter: ['Warning', 'Error', 'Fail'] }); }}>Fail/Errors/Warnings</Menu.Item>
                <Menu.Item onClick={() => { this.props.handler({ filter: null, timeline: null }); }}>Reset all filters</Menu.Item>
            </Menu>
        </div>);
    }
}
