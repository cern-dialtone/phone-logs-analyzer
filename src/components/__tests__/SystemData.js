import React from 'react';
import { render, cleanup } from '@testing-library/react'
import { SystemData } from '../SystemData'

it('SystemData render', () => {
    render(<SystemData />);
});

afterEach(cleanup);

it('SystemData handle bad props', () => {
    let wrong_system = JSON.stringify([{mortde: "rigole"}, {system: "nop"}]);
    const ret = render(<SystemData value={wrong_system}/>).container;
    expect(ret.getElementsByTagName('h3')[0].textContent).toBe("Required informations not found");
});

afterEach(cleanup);

it('SystemData handle bad props', () => {
    let wrong_system = JSON.stringify({system: "nop"});
    const ret = render(<SystemData value={wrong_system}/>).container;
    expect(ret.getElementsByTagName('h3')[0].textContent).toBe("No valid data detected.");
});

afterEach(cleanup);

it('SystemData is working', () => {
    let good_system = [{"some": "things"}, {
        "system":{
           "os":{
              "name":"Mac OS X",
              "version":"10_14_4",
              "resolution":"2560 x 1440",
              "aspectRatio":"1.78",
              "isMobileDevice":false
           },
           "browser":{
              "name":"Chrome",
              "version":"74.0.3729.169",
              "isPromisesSupported":true
           },
           "webrtc":{
              "enabled":true,
              "ortc":false,
              "webSocketsSupported":true,
              "isAudioContextSupported":true,
              "isSctpDataChannelsSupported":true,
              "isRtpDataChannelsSupported":true
           },
           "devices":{
              "getUserMediaAvailable":true,
              "hasMicrophonePermissions":true,
              "canChangeOutputDevice":true,
              "speakers":{
                 "available":true,
                 "count":3,
                 "labels":[
                    "Default - Internal Microphone (Built-in)",
                    "Internal Microphone (Built-in)",
                    "HD Pro Webcam C920 (046d:082d)"
                 ]
              },
              "microphones":{
                 "available":true,
                 "count":3,
                 "labels":[
                    "Default - Internal Microphone (Built-in)",
                    "Internal Microphone (Built-in)",
                    "HD Pro Webcam C920 (046d:082d)"
                 ]
              }
           },
           "ip":{
              "address":"Public: 194.12.179.126",
              "public":true,
              "ipv4":true
           }
        }
     }]
     const ret = render(<SystemData value={JSON.stringify(good_system)}/>).baseElement;
     expect(ret.textContent).not.toMatch("No valid data detected." || "Required informations not found");
});