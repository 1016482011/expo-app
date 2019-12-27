import React from 'react'
import { Icon } from 'expo'
import Colors from '../constants/Colors'

export const TabBarIcon = class TabBarIcon extends React.Component {
  render() {
    const IconType = Icon[this.props.type || 'FontAwesome']
    return (
      <IconType
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
        color={
          this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault
        }
      />
    )
  }
}

export const TabLargeIcon = class TabLargeIcon extends React.Component {
  render() {
    const IconType = Icon[this.props.type || 'FontAwesome']
    return (
      <IconType
        name={this.props.name}
        size={50}
        style={{ marginTop: -30 }}
        color={Colors.tabIconSelected}
      />
    )
  }
}
