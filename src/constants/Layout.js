import { Platform } from 'react-native'
import { Constants } from 'expo'

export default {
  statusBarHeight: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight
}
