import React from 'react'
import {
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation'
import ProListScreen from '../screens/home/ProList'
import ProAddScreen from '../screens/home/ProAdd'
import SettingScreen from '../screens/home/Setting'
import { TabBarIcon, TabLargeIcon } from '../components/TabBarIcon'

// 创键问题列表页导航
const ProListStack = createStackNavigator({
  ProListScreen: {
    screen: ProListScreen
  }
})
ProListStack.navigationOptions = {
  tabBarLabel: '清单',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'folder-open-o'} />
  ),
  activeTintColor: '#3781C6'
}

// 创键问题添加页导航
const ProAddStack = createStackNavigator({
  ProAddScreen
})
ProAddStack.navigationOptions = {
  tabBarLabel: '录问题',
  tabBarIcon: ({ focused }) => (
    <TabLargeIcon focused={focused} name={'pluscircle'} type={'AntDesign'} />
  ),
  activeTintColor: '#3781C6'
}

export default createBottomTabNavigator(
  {
    ProListStack,
    ProAddStack,
    SettingStack: {
      screen: SettingScreen,
      navigationOptions: {
        tabBarLabel: '我的',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon focused={focused} name={'user-o'} />
        ),
        activeTintColor: '#3781C6'
      }
    }
  },
  {
    initialRouteName: 'ProListStack'
  }
)
