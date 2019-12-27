import React from 'react'
import { StyleSheet, Image, Dimensions, Alert } from 'react-native'
import { Container, Text, View, Content } from 'native-base'
import _ from 'lodash'
import { connect } from 'react-redux'
import Toast from 'react-native-easy-toast'
import TouchFeedback from '../../components/TouchFeedback'
import StatusBar from '../../components/StatusBar'
import Layout from '../../constants/Layout'
import { IconList } from '../../components/List'
import {
  projectInfoAction,
  userDataInfoAction
} from '../../store/actions/requestAction'

const { statusBarHeight } = Layout

const { width } = Dimensions.get('window')
const bgHeight = 539 * (width / 738)

class Setting extends React.Component {
  componentDidMount() {
    const { userDataInfoAction } = this.props
    userDataInfoAction()
  }

  emptyCheck = v => {
    return _.isEmpty(v) ? '' : v
  }
  _chanageProject = () => {
    const { projectInfoAction } = this.props
    projectInfoAction()
  }
  _logout = () => {
    Alert.alert(
      '警告',
      '确认退出登录？',
      [
        { text: '否', onPress: () => {}, style: 'cancel' },
        {
          text: '是',
          onPress: () => this.props.navigation.replace('Login')
        }
      ],
      { cancelable: false }
    )
  }
  render() {
    const {
      userData: {
        userInfo: { realName, userName, userSex, userUnit, userPhone }
      }
    } = this.props
    const emptyCheck = this.emptyCheck
    return (
      <Container>
        <StatusBar bgColor="#3781C6" />
        <Toast ref="toast" opacity={0.8} />
        <Image
          style={styles.userBgImg}
          source={require('../../assets/imgs/m-user-bg.png')}
        />
        <View style={styles.userLogo}>
          <Image
            style={styles.userLogoImg}
            source={require('../../assets/imgs/m-user-logo.png')}
          />
          <Text style={styles.userLogoName}>{emptyCheck(userName)}</Text>
        </View>
        <Content style={{ backgroundColor: '#F5F5F9' }}>
          <View style={{ paddingBottom: 20 }}>
            <View style={styles.userInfo}>
              <IconList
                iconName="user"
                label={'真实姓名'}
                rightText={emptyCheck(realName)}
              />
              <IconList
                iconName="intersex"
                label={'性别'}
                rightText={emptyCheck(userSex)}
              />
              <IconList
                iconName="building"
                label={'所属单位'}
                rightText={emptyCheck(userUnit)}
              />
              <IconList
                iconName="volume-control-phone"
                label={'联系方式'}
                rightText={emptyCheck(userPhone)}
              />
              {/* <IconListArrow
                iconName="lock"
                label={'修改密码'}
                rightIcon={'angle-right'}
                onPress={() => navigation.navigate('SettingModifyPassword')}
              /> */}
            </View>
            <TouchFeedback
              style={styles.userLogut}
              onPress={this._chanageProject}
            >
              <Text style={{ lineHeight: 44 }}>切换项目</Text>
            </TouchFeedback>
            <TouchFeedback style={styles.userLogut} onPress={this._logout}>
              <Text style={{ lineHeight: 44 }}>退出登录</Text>
            </TouchFeedback>
          </View>
        </Content>
      </Container>
    )
  }
}

export default connect(
  state => ({
    userData: state.userData,
    projectData: state.project
  }),
  { userDataInfoAction, projectInfoAction }
)(Setting)

const styles = StyleSheet.create({
  userBgImg: {
    width,
    height: bgHeight,
    position: 'absolute',
    top: statusBarHeight,
    resizeMode: 'contain'
  },
  userLogo: {
    height: bgHeight,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  userLogoImg: {
    width: width / 4,
    height: width / 4,
    resizeMode: 'contain'
  },
  userLogoName: {
    fontSize: 20,
    color: '#fff',
    marginTop: 15
  },
  userInfo: {
    marginTop: 25,
    paddingVertical: 10,
    backgroundColor: '#fff'
  },
  userLogut: {
    marginTop: 15,
    alignItems: 'center',
    backgroundColor: '#fff'
  }
})
