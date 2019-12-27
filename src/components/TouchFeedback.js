import React from 'react'
import {
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform
} from 'react-native'
import { View } from 'native-base'

class TouchFeedbackAndroid extends React.Component {
  render() {
    const { children, style } = this.props
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackground()}
        onPress={() => this.props.onPress()}
      >
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    )
  }
}

class TouchFeedbackIos extends React.Component {
  render() {
    const { children, style } = this.props
    return (
      <TouchableOpacity style={style} onPress={() => this.props.onPress()}>
        {children}
      </TouchableOpacity>
    )
  }
}

export default (Platform.OS === 'ios' ? TouchFeedbackIos : TouchFeedbackAndroid)
