export interface Field {
  fieldName: string
  isRequired: boolean
  isList: boolean
  typeIdentifier: string
  defaultValue?: string
  enumValues: string[]
}
