export function isScalar (typeIdentifier) {
  const scalarTypes = ['String', 'Int', 'Float', 'Boolean', 'GraphQLID']
  return scalarTypes.includes(typeIdentifier)
}
