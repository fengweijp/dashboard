export function isScalar (typeIdentifier) {
  const scalarTypes = ['String', 'Int', 'Float', 'Boolean', 'GraphQLID', 'Enum', 'Password']
  return scalarTypes.includes(typeIdentifier)
}

export function isValidName (name: string): boolean {
  return /^[_a-zA-Z][_a-zA-Z0-9]*$/.test(name)
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
  }[typeIdentifier]()
}

export function isValidValueForType (value: string, typeIdentifier: string): boolean {
  const parsedValue = parseValue(value, typeIdentifier)
  return parsedValue !== null && parsedValue !== undefined
}
