import React from 'react';
import { stringify } from 'querystring';

export function showObject(obj) {
  /**
   * Recursive function to fully display event details
   * 
   * @param {object} obj - event child object containing unknown type of data
   * 
   * @return {array} list - List of all data detected
   */
  if (typeof obj !== 'object' || !obj)
    return (
      <span key="_" className="false">
        Can't read data OR NULL
        <br />
      </span>
    );
  let list = [];
  for (let i = 0; Object.keys(obj)[i]; i++) {
    if (typeof obj[Object.keys(obj)[i]] === 'boolean')
      list.push(
        <span key={i + '_'}>
          <b>{Object.keys(obj)[i]}:</b>{' '}
          {obj[Object.keys(obj)[i]] ? (
            <span className="true">true</span>
          ) : (
            <span className="false">false</span>
          )}
          <br />
        </span>
      );
    else if (typeof obj[Object.keys(obj)[i]] === 'string')
      list.push(
        <span key={i + '_'}>
          <b>{Object.keys(obj)[i]}:</b> {obj[Object.keys(obj)[i]]}
          <br />
        </span>
      );
    else if (typeof obj[Object.keys(obj)[i]] === 'object')
      list.push(
        <ul key={i + '_'}>
          <b>{Object.keys(obj)[i]}:</b> {showObject(obj[Object.keys(obj)[i]])}
        </ul>
      );
    else
      list.push(
        <span key={i + '_'}>
          <b>{Object.keys(obj)[i]}:</b> {stringify(obj[Object.keys(obj)[i]])}
          <br />
        </span>
      );
  }
  return list;
}
