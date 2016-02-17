import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import schemas from './modules/schemas'
import projects from './modules/projects'

export default combineReducers({
  schemas,
  projects,
  router
})
