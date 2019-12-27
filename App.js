import React from 'react'
import { AppLoading, Font, Asset, Icon, Updates } from 'expo'
import { StyleProvider, Root } from 'native-base'
import { SafeAreaView } from 'react-navigation'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import Toast from 'react-native-easy-toast'
import { setToast, showToast } from './src/helper/toast'
import AppNavigator from './src/navigation/Index'
import reducer from './src/store/reducers/index'
import NavigationService from './src/navigation/NavigationService'
import getTheme from './src/assets/theme/components'
import variables from './src/assets/theme/variables/variables'

const store = createStore(reducer, applyMiddleware(thunk))

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  }
  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      )
    } else {
      return (
        <Provider store={store}>
          <StyleProvider style={getTheme(variables)}>
            <Root>
              <SafeAreaView style={{ flex: 1 }}>
                <AppNavigator
                  ref={navigatorRef => {
                    NavigationService.setTopLevelNavigator(navigatorRef)
                  }}
                />
                <Toast
                  ref={toastRef => {
                    this.toastRef = toastRef
                    setToast(toastRef)
                  }}
                  opacity={0.8}
                />
              </SafeAreaView>
            </Root>
          </StyleProvider>
        </Provider>
      )
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./src/assets/imgs/m-login-bg.png'),
        require('./src/assets/imgs/m-login-logo.png'),
        require('./src/assets/imgs/m-login-form-bg.png')
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font,
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf')
      })
    ])
  }

  _handleLoadingError = error => {
    console.warn(error)
  }

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true })
  }
}
