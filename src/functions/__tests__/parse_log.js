import React from 'react';
import { render, cleanup } from '@testing-library/react'
import { getType, getInfos, getTime, getColor } from '../parse_log'

it('getColor works', () => {
    expect(getColor(["color: #4286f4"])).toBe("rgba(66, 134, 244, 0.3)");
    expect(getColor(["color: #428"])).toBe("transparent");
    expect(getColor([null])).toBe("transparent");
    expect(getColor([null])).toBe("transparent");
    expect(getColor(["| Fri, 31 May 2019 12:45:45 GMT "])).toBe("transparent");
});
