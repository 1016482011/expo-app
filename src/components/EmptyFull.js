import React, { Component } from 'react'
import { Image, Dimensions } from 'react-native'
import { View, Text } from 'native-base'

const { height, width } = Dimensions.get('window')

export default class EmptyFull extends Component {
  render() {
    const { tips } = this.props
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            style={{
              width: width * 0.75,
              height: width * 0.75,
              resizeMode: 'contain'
            }}
            source={require('../assets/imgs/m-page-empty.png')}
          />
          <Text>{tips}</Text>
        </View>
      </View>
    )
  }
}
