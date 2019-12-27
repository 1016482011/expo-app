import React from 'react'
import { Updates } from 'expo'
import { Image, AsyncStorage } from 'react-native'
import { View } from 'native-base'
import { connect } from 'react-redux'
import _ from 'lodash'
import { TokenModify } from '../helper/client'
import { proSelectAction } from '../store/actions/projectAction'
import { showToast } from '../helper/toast'

class Wait extends React.Component {
  componentDidMount() {
    const { navigation } = this.props
    // this.updateAssets()
    this.laodData().then(v => {
      navigation.replace(v)
    })
  }
  // updateAssets = async () => {
  //   try {
  //     const update = await Updates.checkForUpdateAsync()
  //     if (update.isAvailable) {
  //       showToast('开始更新')
  //       await Updates.fetchUpdateAsync()
  //       Updates.reloadFromCache()
  //       showToast('更新结束')
  //     }
  //   } catch (e) {
  //     console.log(e)
  //     showToast('更新失败')
  //   }
  // }
  laodData = async () => {
    const { proSelectAction } = this.props
    const token = await AsyncStorage.getItem('token')
    const proSelect = await AsyncStorage.getItem('proSelect')
    const domain = await AsyncStorage.getItem('domain')
    if (!_.isEmpty(token)) TokenModify(token)
    if (!_.isEmpty(proSelect)) proSelectAction(JSON.parse(proSelect))
    return _.isEmpty(token) || _.isEmpty(proSelect) || _.isEmpty(domain)
      ? 'Login'
      : 'Home'
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Image
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: null,
            height: null
          }}
          source={require('.././../assets/images/splash.png')}
        />
      </View>
    )
  }
}

export default connect(
  state => ({
    state: state
  }),
  { proSelectAction }
)(Wait)
