import * as moment from 'moment'

export function isScalar (typeIdentifier: string): boolean {
  const scalarTypes = ['String', 'Int', 'Float', 'Boolean', 'GraphQLID', 'Enum', 'Password', 'DateTime']
  return scalarTypes.indexOf(typeIdentifier) > -1
}

export function isValidName (name: string): boolean {
  return /^[_a-zA-Z][_a-zA-Z0-9]*$/.test(name)
}

// returns whether the string conforms to ISO8601
// 2015 is a valid ISO 8601, so is 2015-12-31T23:00:00Z
export function isValidDateTime (dateTime: string): boolean {
  return moment(dateTime).isValid()
}

export function parseValue (value: string, typeIdentifier: string): any {
  return {
    String: () => value,
    Boolean: () =>
    (value === 'true' || value === 'True') ? true : (value === 'false' || value === 'False') ? false : null,
    Int: () => isNaN(parseInt(value)) ? null : parseInt(value),
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
