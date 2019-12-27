import { combineReducers } from 'redux'
import userData from './userData'
import project from './project'
import problem from './problem'
import screen from './screen'
const rootReducer = combineReducers({
  userData,
  project,
  problem,
  screen
})

export default rootReducer
