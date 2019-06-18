import React from 'react';
import { Interpret } from '../Interpret'
import { render, cleanup } from '@testing-library/react'

it ('Interpet render without crashing', () => {
  render(<Interpret />, document.createElement('div'));
});

it ('Interpret render without valid props', () => {
    render(<Interpret time='654' value='okay' filter='mmh' handler={null}/>, document.createElement('div'));
});