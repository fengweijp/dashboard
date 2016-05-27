export interface Field {
  id: string
  fieldName: string
  isRequired: boolean
  isList: boolean
  typeIdentifier: string
  defaultValue?: string
  enumValues: string[]
}

export type UserType = 'GUEST' | 'AUTHENTICATED' | 'RELATED'

export interface Permission {
  id: string
  userType: UserType
  userPath: string
  allowRead: boolean
  allowCreate: boolean
  allowUpdate: boolean
  allowDelete: boolean
  comment: string
}
