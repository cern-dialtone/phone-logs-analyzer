import React from 'react';
import { Input, Menu } from 'semantic-ui-react';
export class Filters extends React.Component {

  /**
   * This part will only use an handler sent by props. (this.props.handler({obj}))
   * 
   * @param {*} props 
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  resetallfilters(unless)
  {
    document.getElementById('searchbar').style.backgroundColor='transparent';
    document.getElementById('tone_out').style.backgroundColor='transparent';
    document.getElementById('tone_in').style.backgroundColor='transparent';
    document.getElementById('sip').style.backgroundColor='transparent';
    document.getElementById('few').style.backgroundColor='transparent';
    if (unless) {
      document.getElementById(unless).style.backgroundColor='rgb(224, 255, 221)';
      document.getElementById('resetfilters').style.backgroundColor='rgba(0,0,0,0.2)';
    }
  }

  componentDidUpdate() {
    if (!this.props.filter)
    {
      this.resetallfilters(null);
      document.getElementById('resetfilters').style.backgroundColor='transparent';
    }
  }

  render() {
    return (
      <div>
        <h2>Filters</h2>
        <Input id='searchbar'
          focus
          placeholder="Search in logs"
          className="searchbar"
          onChange={() => {
            this.props.handler({
              filter: [document.getElementById('searchbar').value],
              timeline: null
            });
            this.resetallfilters("searchbar");
          }}
        />
        <Menu>
          <Menu.Item id="tone_in"
            onClick={() => {
              this.props.handler({ filter: ['TONE_IN'],
              timeline: null });
              this.resetallfilters("tone_in");
            }}
          >
            Tone_In
          </Menu.Item>
          <Menu.Item id='tone_out'
            onClick={() => {
              this.props.handler({ filter: ['TONE_OUT'],
              timeline: null });
              this.resetallfilters("tone_out");
            }}
          >
            Tone_Out
          </Menu.Item>
          <Menu.Item id='sip'
            onClick={() => {
              this.props.handler({ filter: ['sip'],
              timeline: null });
              this.resetallfilters("sip");
            }}
          >
            SIP
          </Menu.Item>
          <Menu.Item id='few'
            onClick={() => {
              this.props.handler({ filter: ['Warning', 'Error', 'Fail'],
              timeline: null });
              this.resetallfilters("few");
            }}
          >
            Fail/Errors/Warnings
          </Menu.Item>
          <Menu.Item id='resetfilters'
            onClick={() => {
              this.props.handler({ filter: null, timeline: null });
              this.resetallfilters(null);
              document.getElementById('resetfilters').style.backgroundColor='transparent';
            }}
          >
            Reset all filters
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
