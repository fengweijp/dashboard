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

export const fetchSchemas = (): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    const reduceByName = (obj, val) => {
      obj[val.name] = val
      return obj
    }
    return fetch('http://localhost:5000/api/testApp1/schema')
      .then((req) => req.json())
      .then((json) => json.schema.reduce(reduceByName, {}))
      .then(Immutable.fromJS)
      .then((schemas) => dispatch(receiveSchemas(schemas)))
  }
}

export const publishSchemas = (): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    return fetch('http://localhost:5000/api/testApp1/schema', {
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

export const actions = {
  receiveSchemas,
  fetchSchemas,
  addFieldToSchema
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
