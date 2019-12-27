import { createAppContainer, createStackNavigator } from 'react-navigation'
import SettingModifyPassword from '../screens/Setting/ModifyPassword'
import MiddlePageResult from '../screens/MiddlePage/Result'
import ReadProblemDetail from '../screens/read/ProblemDetail'
import ProblemEdit from '../screens/edit/problemEdit'
import Home from './HomeTab'
import Login from '../screens/Login'
import Wait from '../screens/Wait'
import Project from '../screens/Project'

const AppNavigator = createStackNavigator(
  {
    // 首页
    Home: {
      screen: Home,
      navigationOptions: () => ({
        header: null
      })
    },
    // 广告预留页
    Wait: {
      screen: Wait,
      navigationOptions: () => ({
        header: null
      })
    },
    // 登录页
    Login: {
      screen: Login,
      navigationOptions: () => ({
        header: null
      })
    },
    // 项目选择
    Project: {
      screen: Project
    },
    // 修改密码
    SettingModifyPassword: {
      screen: SettingModifyPassword,
      navigationOptions: () => ({
        header: null
      })
    },
    // 中间结果页
    MiddlePageResult,
    // 问题详情页
    ReadProblemDetail,
    // 修改问题
    ProblemEdit
  },
  {
    initialRouteName: 'Wait',
    defaultNavigationOptions: {
      headerLeft: null
    }
  }
)

export default createAppContainer(AppNavigator)
