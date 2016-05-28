import { isScalar, isValidValueForType, parseValue } from '../../utils/graphql'
import { Field } from '../../types/types'

function valueOrDefault (value: any, field: Field): any {
  if (value !== null && value !== undefined) {
    return value
  }

  if (field.defaultValue !== undefined) {
    return field.defaultValue
  }
  return null
}

export function valueToString (value: any, field: Field, returnNull: boolean): string {
  const fieldValue = isScalar(field.typeIdentifier)
    ? valueOrDefault(value, field)
    : (value !== null ? value.id : null)

  if (fieldValue === null) {
    return returnNull ? 'null' : ''
  }

  if (field.isList) {
    if (field.typeIdentifier === 'String') {
      return `[${fieldValue.map((e) => `"${e}"`).toString()}]`
    } else {
      return `[${fieldValue.toString()}]`
    }
  } else {
    return fieldValue.toString()
  }
}

function valueToGQL (value: any, field: Field): string {
  if (!isScalar(field.typeIdentifier)) {
    return `"${value.id}"`
  }

  if (field.typeIdentifier === 'Enum') {
    return value
  }

  return JSON.stringify(value)
}

export function toGQL (value: any, field: Field): string {
  const key = isScalar(field.typeIdentifier) ? field.fieldName : `${field.fieldName}Id`
  return value !== null ? `${key}: ${valueToGQL(value, field)}` : ''
}

export function stringToValue (rawValue: string, field: Field): any {
  const { isList, isRequired, typeIdentifier } = field
  if (rawValue === '') {
    // todo: this should set to null but currently null is not supported by our api
    return isRequired && typeIdentifier === 'String' ? '' : null
  }

  if (!isList && !isScalar(typeIdentifier)) {
    return { id: rawValue }
  }

  if (isList) {
    return JSON.parse(rawValue)
  } else {
    return parseValue(rawValue, typeIdentifier)
  }
}

export function isValidValue (value: string, field: Field): boolean {
  if (value === '' && !field.isRequired) {
    return true
  }
  if (field.isList) {
    if (value === '[]') {
      return true
    }
    if (value[0] !== '[' || value[value.length - 1] !== ']') {
      return false
    } else {
      value = value.substring(1, value.length - 1)
    }
  }

  let invalidValue = false
  let values = field.isList ? value.split(',').map((x) => x.trim()) : [value]

  values.forEach((value) => {
    if (!isValidValueForType(value, isScalar(field.typeIdentifier) ? field.typeIdentifier : 'GraphQLID')) {
      invalidValue = true
      return
    }
  })

  return !invalidValue
}
