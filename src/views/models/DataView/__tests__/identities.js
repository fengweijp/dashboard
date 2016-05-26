jest.unmock('../utils')
jest.unmock('../../../../utils/graphql')

import { stringToValue, valueToString } from '../utils'

describe('identities', () => {
  it('is an identity to convert an int value to a string and back to int', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Int',
    }
    expect(stringToValue(valueToString(12, field, true), field)).toBe(12)
  })

  it('is an identity to convert a Float value to a string and back to Float', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Float',
    }
    expect(stringToValue(valueToString(23.23, field, true), field)).toBe(23.23)
  })

  it('is an identity to convert a string value to a string back to string', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'String',
    }
    expect(stringToValue(valueToString('12', field, true), field)).toBe('12')
  })

  it('is an identity to convert a Boolean value to a string and back to Boolean', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Boolean',
    }
    expect(stringToValue(valueToString(true, field, true), field)).toBe(true)
  })

  it('is an identity to convert a string to an Int value and back to string', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Int',
    }
    expect(valueToString(stringToValue('12', field), field, true)).toBe('12')
  })

  it('is an identity to convert a string to a Float value and back to string', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Float',
    }
    expect(valueToString(stringToValue('23.23', field), field, true)).toBe('23.23')
  })

  it('is an identity to convert a string value to a string back to string', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'String',
    }
    expect(valueToString(stringToValue('12', field), field, true)).toBe('12')
  })

  it('is an identity to convert a string to a Boolean value and back to string', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Boolean',
    }
    expect(valueToString(stringToValue('true', field), field, true)).toBe('true')
  })
})
