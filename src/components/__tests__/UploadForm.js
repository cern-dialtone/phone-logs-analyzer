import React from 'react';
import { App } from '../Uploader'
import { render, cleanup } from '@testing-library/react'

it ('App render without crashing', () => {
  render(<App />, document.createElement('div'));
});