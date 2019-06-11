import React from 'react';
import { convertJson, showCat } from './showCat';
import { showObject } from './showObject';
export class SystemData extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showinginfos: false };
  }
  listdevices(list) {
    let listli = [];
    for (let i = 0; list[i]; i++) listli.push(<li key={i}>{list[i]}</li>);
    return <div>{listli}</div>;
  }
  render() {
    let data;
    if (
      !this.props ||
      !this.props.value ||
      !(data = convertJson(this.props.value))
    )
      return <h3>No valid data detected.</h3>;
    data = data[data.length - 1];
    if (!data.system) return <h3>Required informations not found</h3>;
    return (
      <ul id="Tree">
        <li>
          <span
            className="caret"
            id="browser"
            onClick={() => {
              showCat('browser');
            }}
          >
            Browser
          </span>
          <ul className="nested">
            <li>{data.system.browser.name}</li>
            <li>{data.system.browser.version}</li>
          </ul>
        </li>

        <li>
          <span
            className="caret"
            id="ip"
            onClick={() => {
              showCat('ip');
            }}
          >
            IP
          </span>
          <ul className="nested">
            <li>{data.system.ip.address}</li>
            <li>{data.system.ip.ipv4 ? 'Ipv4' : 'NOT IPV4'}</li>
          </ul>
        </li>

        <li>
          <span
            className="caret"
            id="os"
            onClick={() => {
              showCat('os');
            }}
          >
            OS
          </span>
          <ul className="nested">
            <li>{data.system.os.name}</li>
            <li>{data.system.os.version}</li>
            <li>{data.system.os.resolution}</li>
          </ul>
        </li>

        <li>
          <span
            className="caret"
            id="devices"
            onClick={() => {
              showCat('devices');
            }}
          >
            Devices
          </span>
          <ul className="nested">
            <li>
              <span
                className="caret"
                id="micro"
                onClick={() => {
                  showCat('micro');
                }}
              >
                Microphones
              </span>
              <ul className="nested">
                {this.listdevices(data.system.devices.microphones.labels)}
              </ul>
            </li>
            <li>
              <span
                className="caret"
                id="speakers"
                onClick={() => {
                  showCat('speakers');
                }}
              >
                Speakers
              </span>
              <ul className="nested">
                {this.listdevices(data.system.devices.speakers.labels)}
              </ul>
            </li>
          </ul>
        </li>

        <li>
          <span
            className="caret"
            id="webrtc"
            onClick={() => {
              showCat('webrtc');
            }}
          >
            Webrtc
          </span>
          <ul className="nested">{showObject(data.system.webrtc)}</ul>
        </li>
      </ul>
    );
  }
}
