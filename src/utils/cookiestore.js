import cookies from 'js-cookie'

const domain = location.hostname.split('.').slice(-2).join('.')

export function set (key, value) {
  cookies.set(key, value, {
    domain,
    expires: 90,
  })
}

export function get (key) {
  return cookies.get(key)
}

export function remove (key) {
  cookies.remove(key, { domain })
}
