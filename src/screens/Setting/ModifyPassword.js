import React from 'react'
import { StyleSheet } from 'react-native'
import { Container, View, Content, Form, Item, Input, Label } from 'native-base'
import { StackActions, NavigationActions } from 'react-navigation'
import StatusBar from '../../components/StatusBar'
import Header from '../../components/Header'
import FullButton from '../../components/FullButton'

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Login' })]
})

export default class ModifyPassword extends React.Component {
  render() {
    return (
      <Container>
        <StatusBar />
        <Header title={'修改密码'} leftIcon={'angle-left'} />
        <Content style={{ padding: 25 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 3 }}>
            <Form>
              <Item inlineLabel last>
                <Label>旧密码:</Label>
                <Input />
              </Item>
              <Item inlineLabel last>
                <Label>新密码:</Label>
                <Input />
              </Item>
              <Item inlineLabel last>
                <Label>再次确认密码:</Label>
                <Input />
              </Item>
            </Form>
            <View style={{ paddingVertical: 20 }}>
              <FullButton
                title="确认"
                onPress={() => this.props.navigation.dispatch(resetAction)}
              />
            </View>
          </View>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({})
