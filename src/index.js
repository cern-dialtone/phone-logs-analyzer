import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './style/index.css';
import './style/tree.css';
import { Uploader } from './components/Uploader';

export var timedata = [];

export default timedata;

ReactDOM.render(
  <div>
    <Uploader />
  </div>,
  document.getElementById('root')
);
