import { isScalar, isValidValueForType } from '../../../utils/graphql'

function valueOrDefault (value, field) {
  if (value !== null && value !== undefined) {
    return value
  }
  if (field.defaultValue !== undefined) {
    return field.defaultValue
  }
  return null
}

export function valueToString (value: any, field: any): string {
  const fieldValue = isScalar(field.typeIdentifier)
    ? valueOrDefault(value, field)
    : (value !== null ? value.id : null)

  if (fieldValue === null) {
    return 'null'
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

export function valueToGQL (value, field) {
  if (field.typeIdentifier === 'Enum') {
    return value
  } else {
    return JSON.stringify(value)
  }
}

export function stringToValue (rawValue: string, field: any) {
  if (rawValue === '') {
    // todo: this should set to null but currently null is not supported by our api
    return field.isRequired ? '' : null
  }

  if (field.isList) {
    return JSON.parse(rawValue)
  } else {
    switch (field.typeIdentifier) {
      case 'Int': return parseInt(rawValue, 10)
      case 'Float': return parseFloat(rawValue)
      case 'Boolean': return rawValue.toLowerCase() === 'true'
      default: return rawValue
    }
  }
}

