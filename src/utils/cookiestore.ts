import * as cookies from 'js-cookie'

const domain = location.hostname.split('.').slice(-2).join('.')

export function set (key: string, value: string): void {
  cookies.set(key, value, {
    domain,
    expires: 90,
  })
}

export function get (key: string): string {
  return cookies.get(key)
}

export function remove (key: string): void {
  cookies.remove(key, { domain })
}
