import React from 'react'
import { Text, ListItem, Left, Button, Body, Right } from 'native-base'
import { FontAwesome } from '@expo/vector-icons'
import TouchFeedback from './TouchFeedback'

export const ListSelect = props => {
  const { style, title, content } = props
  return (
    <TouchFeedback
      onPress={() => props.onPress()}
      style={{
        width: '100%',
        flexDirection: 'row',
        ...style
      }}
    >
      <Text>{title}</Text>
      <Text style={{ color: '#333333', fontSize: 16, paddingHorizontal: 10 }}>
        {content}
      </Text>
      <FontAwesome
        name="angle-right"
        size={26}
        color="#999999"
        style={{ position: 'absolute', right: 0, top: 8 }}
      />
    </TouchFeedback>
  )
}

export const IconList = props => {
  const { iconName, iconSize, iconColor, label, rightText } = props
  return (
    <ListItem icon>
      <Left>
        <Button>
          <FontAwesome
            name={iconName}
            size={iconSize || 22}
            color={iconColor || '#fff'}
          />
        </Button>
      </Left>
      <Body>
        <Text>{label}</Text>
      </Body>
      <Right>
        <Text>{rightText}</Text>
      </Right>
    </ListItem>
  )
}

export const IconListArrow = props => {
  const { iconName, iconSize, iconColor, label, rightIcon } = props
  return (
    <ListItem icon>
      <Left>
        <Button>
          <FontAwesome
            name={iconName}
            size={iconSize || 22}
            color={iconColor || '#fff'}
          />
        </Button>
      </Left>
      <Body>
        <TouchFeedback onPress={() => this.props.onPress()}>
          <Text>{label}</Text>
        </TouchFeedback>
      </Body>
      <Right>
        <FontAwesome name={rightIcon} size={22} color="#A8A8A8" />
      </Right>
    </ListItem>
  )
}
