import * as moment from 'moment'

export function isScalar (typeIdentifier: string): boolean {
  const scalarTypes = [
    'String',
    'Int',
    'Float',
    'Boolean',
    'GraphQLID',
    'Enum',
    'Password',
    'DateTime',
  ]
  return scalarTypes.indexOf(typeIdentifier) !== -1
}

export function isValidName (name: string): boolean {
  return /^[_a-zA-Z][_a-zA-Z0-9]*$/.test(name)
}

export function isValidDateTime (dateTime: string): boolean {
  const ISO8601 = 'YYYY-MM-DDTHH:mm:ss.SSSZ'

  return (
    // returns whether the string conforms to ISO8601
    // the strict format is '2016-05-19T17:09:24.123Z' but we also accept simpler versions like '2016'
    moment.utc(dateTime, ISO8601).isValid()
  )
}

export function parseValue (value: string, typeIdentifier: string): any {
  return {
    String: () => value,
    Boolean: () =>
    (value === 'true' || value === 'True') ? true : (value === 'false' || value === 'False') ? false : null,
    Int: () => isNaN(parseInt(value, 10)) ? null : parseInt(value, 10),
    Float: () => isNaN(parseFloat(value)) ? null : parseFloat(value),
    GraphQLID: () => value,
    Password: () => value,
    Enum: () => isValidName(value) ? value : null,
    DateTime: () => isValidDateTime(value) ? value : null,
  }[typeIdentifier]()
}

export function isValidValueForType (value: string, typeIdentifier: string): boolean {
  const parsedValue = parseValue(value, typeIdentifier)
  return parsedValue !== null && parsedValue !== undefined
}
