/* @flow */

import Immutable, { List } from 'immutable'

// ------------------------------------
// Constants
// ------------------------------------
export const PROJECTS_RECEIVE = 'PROJECTS_RECEIVE'
export const PROJECTS_ADD = 'PROJECTS_ADD'

// ------------------------------------
// Actions
// ------------------------------------

export const receiveProjects = (projects) => ({
  type: PROJECTS_RECEIVE,
  projects
})

export const addProject = (projectName) => ({
  type: PROJECTS_ADD,
  projectName
})

export const fetchProjects = (): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    return fetch(`http://${__SERVER_ADDR__}/api/secret/list-all-apps`)
      .then((req) => req.json())
      .then((json) => json.apps)
      .then(Immutable.fromJS)
      .then((projects) => dispatch(receiveProjects(projects)))
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PROJECTS_RECEIVE]: (state, action) => action.projects,
  [PROJECTS_ADD]: (state, action) => state.push(action.projectName)
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function projectsReducer (state = List(), action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
