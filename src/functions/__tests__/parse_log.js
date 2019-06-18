import React from 'react';
import { render, cleanup } from '@testing-library/react'
import { getType, getInfos, getTime, getColor } from '../parse_log'

it('getType works', () => {
    expect(getType(["i18next::backendConnector: loaded namespace translations for language en"])).toBe("i18next::backendConnector");
    expect(getType(["i18next: initialized"])).toBe("i18next");
    expect(getType(["%cAPP:INFO %cLogin user with code...%c +0ms"])).toBe("APP:INFO ");
    expect(getType(["Fri May 31 2019 14:48:45 GMT+0200 (Central European Summer Time) | sip.ua | configuration parameters after validation:"])).toBe(" sip.ua ");
});

it('getInfos works', () => {
    expect(getInfos(["i18next::backendConnector: loaded namespace translations for language en"])).toBe(" loaded namespace translations for language en");
    expect(getInfos(["i18next: initialized"])).toBe(" initialized");
    expect(getInfos(["%cAPP:INFO %cLogin user with code...%c +0ms"])).toBe("Login user with code...");
    expect(getInfos(["Fri May 31 2019 14:48:45 GMT+0200 (Central European Summer Time) | sip.ua | configuration parameters after validation:"])).toBe(" configuration parameters after validation:");
});

it('getTime works', () => {
    expect(getTime(["| Fri, 31 May 2019 12:48:45 GMT "], ["| Fri, 31 May 2019 12:49:45 GMT "])).toBe("+"+((parseInt(Date.parse("| Fri, 31 May 2019 12:48:45 GMT ")) - parseInt(Date.parse("| Fri, 31 May 2019 12:49:45 GMT ")))/1000)+"s");
    expect(getTime(["| Fri, 31 May 2019 12:49:45 GMT "], ["| Fri, 31 May 2019 12:45:45 GMT "])).toBe("+"+((parseInt(Date.parse("| Fri, 31 May 2019 12:49:45 GMT ")) - parseInt(Date.parse("| Fri, 31 May 2019 12:45:45 GMT ")))/1000)+"s");
    expect(getTime([null], ["| Fri, 31 May 2019 12:45:45 GMT "])).toBe();
    expect(getTime([null], [null])).toBe();
    expect(getTime(["| Fri, 31 May 2019 12:45:45 GMT "], [null])).toBe();
});

it('getColor works', () => {
    expect(getColor(["color: #4286f4"])).toBe("rgba(66, 134, 244, 0.3)");
    expect(getColor(["color: #428"])).toBe("transparent");
    expect(getColor([null])).toBe("transparent");
    expect(getColor([null])).toBe("transparent");
    expect(getColor(["| Fri, 31 May 2019 12:45:45 GMT "])).toBe("transparent");
});