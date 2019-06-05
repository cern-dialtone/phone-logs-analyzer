import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default class FilterMenu extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
        <Menu>
          <Menu.Item
            name='Tone_In'
            active={activeItem === 'Tone_In'}
            onClick={this.handleItemClick}
          >
            Tone_In
          </Menu.Item>
  
          <Menu.Item name='Tone_Out' active={activeItem === 'Tone_Out'} onClick={this.handleItemClick}>
            Tone_Out
          </Menu.Item>
  
          <Menu.Item
            name='SIP'
            active={activeItem === 'SIP'}
            onClick={this.handleItemClick}
          >
            SIP
          </Menu.Item>
  
          <Menu.Item
            name='error'
            active={activeItem === 'error'}
            onClick={this.handleItemClick}
          >
            Fail/Error/Warnings
          </Menu.Item>

          <Menu.Item
            name='reset'
            active={activeItem === 'reset'}
            onClick={this.handleItemClick}
          >
            reset all filters
          </Menu.Item>
        </Menu>
    )
  }
}