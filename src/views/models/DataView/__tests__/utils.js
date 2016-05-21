jest.unmock('../utils')
jest.unmock('../../../../utils/graphql')

import { stringToValue } from '../utils'

describe('stringToValue', () => {
  it('parses empty int', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Int',
    }
    expect(stringToValue('', field)).toBe(null)
  })

  it('parses int', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Int',
    }
    expect(stringToValue('23', field)).toBe(23)
  })

  it('parses empty float', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Float',
    }
    expect(stringToValue('', field)).toBe(null)
  })

  it('parses float', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Float',
    }
    expect(stringToValue('23.32', field)).toBe(23.32)
  })

  it('parses empty string when not required', () => {
    const field = {
      isRequired: false,
      isList: false,
      typeIdentifier: 'String',
    }
    expect(stringToValue('', field)).toBe(null)
  })

  it('parses empty string when required', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'String',
    }
    expect(stringToValue('', field)).toBe('')
  })

  it('parses empty boolean', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Boolean',
    }
    expect(stringToValue('', field)).toBe(null)
  })

  it('parses boolean true', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Boolean',
    }
    expect(stringToValue('true', field)).toBe(true)
  })

  it('parses boolean false', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Boolean',
    }
    expect(stringToValue('false', field)).toBe(false)
  })

  it('parses empty int list', () => {
    const field = {
      isRequired: true,
      isList: true,
      typeIdentifier: 'Int',
    }
    expect(stringToValue('[]', field)).toEqual([])
  })

  it('parses int list', () => {
    const field = {
      isRequired: true,
      isList: true,
      typeIdentifier: 'Int',
    }
    expect(stringToValue('[1,3]', field)).toEqual([1,3])
  })

  it('parses relation id', () => {
    const field = {
      isRequired: true,
      isList: false,
      typeIdentifier: 'SomeModel',
    }
    expect(stringToValue('someId', field)).toEqual({ id: 'someId' })
  })
})
