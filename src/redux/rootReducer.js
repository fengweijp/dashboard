import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import schemas from './modules/schemas'

export default combineReducers({
  schemas,
  router
})
