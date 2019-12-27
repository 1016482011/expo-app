import React from 'react'
import { View, Text, Button, TabHeading } from 'native-base'
import { Icon } from 'expo'

export default class Header extends React.Component {
  render() {
    const { title, leftIcon, rightIcon } = this.props
    const IconType = Icon[this.props.type || 'FontAwesome']
    return (
      <View
        style={{
          width: '100%',
          height: 60,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#3781C6'
        }}
      >
        <View style={{ width: '25%', height: 60 }}>
          {leftIcon && (
            <Button
              transparent
              style={{ height: 60, paddingHorizontal: 20 }}
              onPress={() => this.props.onBackPress()}
            >
              <IconType name={leftIcon} size={32} color="#fff" />
            </Button>
          )}
        </View>
        <View style={{ width: '50%' }}>
          <Text style={{ textAlign: 'center', color: '#fff', fontSize: 20 }}>
            {title}
          </Text>
        </View>
        <View
          style={{
            width: '25%',
            height: 60,
            flexDirection: 'row-reverse'
          }}
        >
          {rightIcon && (
            <Button
              style={{
                height: 60,
                paddingHorizontal: 20
              }}
              transparent
              onPress={() => this.props.onRightPress()}
            >
              <IconType name={rightIcon} size={28} color="#fff" />
            </Button>
          )}
        </View>
      </View>
    )
  }
}
