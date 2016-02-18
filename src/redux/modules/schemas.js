/* @flow */

import Immutable, { Map } from 'immutable'

// ------------------------------------
// Constants
// ------------------------------------
export const SCHEMAS_RECEIVED = 'SCHEMAS_RECEIVED'
export const SCHEMAS_SCHEMA_ADDED = 'SCHEMAS_SCHEMA_ADDED'
export const SCHEMAS_FIELD_ADDED = 'SCHEMAS_FIELD_ADDED'
export const SCHEMAS_FIELD_REMOVED = 'SCHEMAS_FIELD_REMOVED'

// ------------------------------------
// Actions
// ------------------------------------

export const receiveSchemas = (schemas) => ({
  type: SCHEMAS_RECEIVED,
  schemas
})

export const addSchema = (schemaName) => ({
  type: SCHEMAS_SCHEMA_ADDED,
  schemaName
})

export const addFieldToSchema = (schemaName, field) => ({
  type: SCHEMAS_FIELD_ADDED,
  schemaName,
  field: Immutable.fromJS(field)
})

export const removeFieldFromSchema = (schemaName, fieldName) => ({
  type: SCHEMAS_FIELD_REMOVED,
  schemaName,
  fieldName
})

export const fetchSchemas = (projectName): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    const reduceByName = (obj, val) => {
      obj[val.name] = val
      return obj
    }
    const checkStatus = (response) => {
      if (response.status >= 200 && response.status < 300) {
        return response
      } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
      }
    }
    return fetch(`http://${__SERVER_ADDR__}/api/${projectName}/schema`)
      .then(checkStatus)
      .then((req) => req.json())
      .then((json) => json.schema.schema.reduce(reduceByName, {}))
      .then(Immutable.fromJS)
      .then((schemas) => dispatch(receiveSchemas(schemas)))
      .catch((err) => console.log(err))
  }
}

export const publishSchemas = (projectName): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    return fetch(`http://${__SERVER_ADDR__}/api/${projectName}/schema`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        schema: Object.values(getState().schemas.toJS())
      })
    })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SCHEMAS_RECEIVED]: (state, action) => state.mergeDeep(action.schemas),
  [SCHEMAS_SCHEMA_ADDED]: (state, action) => state.set(action.schemaName, Immutable.fromJS({
    name: action.schemaName,
    kind: 'OBJECT',
    fields: []
  })),
  [SCHEMAS_FIELD_ADDED]: (state, action) => (
    state.updateIn([action.schemaName, 'fields'], (fields) => (
      fields.push(action.field))
    )
  ),
  [SCHEMAS_FIELD_REMOVED]: (state, action) => (
    state.updateIn([action.schemaName, 'fields'], (fields) => (
      fields.filter((field) => field.get('name') !== action.fieldName))
    )
  )
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function schemasReducer (state = Map(), action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
