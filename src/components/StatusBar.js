import React from 'react'
import { View } from 'native-base'
import Layout from '../constants/Layout'

export default class StatusBar extends React.Component {
  render() {
    const { bgColor } = this.props
    const backgroundColor = bgColor ? bgColor : '#3351AB'
    return (
      <View
        style={{
          backgroundColor,
          height: Layout.statusBarHeight
        }}
      />
    )
  }
}
