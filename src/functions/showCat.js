import React from 'react';
import { showObject } from './showObject';
import { isArray } from 'util';

export function showCat(id) {
  document
  .getElementById(id)
  .parentElement.querySelector('.nested')
  .classList.toggle('active');
  document.getElementById(id).classList.toggle('caret-down');
}
export function convertJson(json) {
  /**
   * Convert JSON if it's a valid value
   * 
   * @param {string} json - log raw
   * 
   * @return {object || boolean} - Will return converted json or false if it fail. 
   */
  if (isJson(json)) return JSON.parse(json);
  return false;
}
export function isJson(txt) {
  try {
    JSON.parse(txt);
  } catch (e) {
    return false;
  }
  let data = JSON.parse(txt);
  return txt && data[data.length-1] && data[data.length-1].system ? true : false;
}
export function indexOfArray(txt, values) {
  for (let a = 0; txt && values && values[a]; a++)
    if (txt.toUpperCase().indexOf(values[a].toUpperCase()) > -1) return true;
  return false;
}
export function ShowDetails(props) {
  if (!props || !props.value || !Array.isArray(props.value))
    return;
  let obj = props.value;
  let list = [];
  for (let a = 0; Object.keys(obj)[a]; a++)
    list.push(
      <li key={a}>
        {typeof obj[Object.keys(obj)[a]] === 'object'
          ? showObject(obj[Object.keys(obj)[a]])
          : obj[Object.keys(obj)[a]]}
      </li>
    );
  return list;
}
