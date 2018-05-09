import { pickBy, either, mapObjIndexed, compose, head, tail, join, converge, map, keys, values, zipObj } from 'ramda'

type Modifier = (key: string) => string

const hasPrefix = (prefix: string) => (val: any, key: string) => key.indexOf(prefix) === 0
const isPureName = (val: any, key: string) => key.split('/').length === 1

const dropPrefix = (prefix: string) => (str: string, separator: string = '/') => {
  const arr = str.split(separator)
  if (head(arr) === prefix) {
    return join('/', tail(arr))
  }
  return str
}

const modifyObjKeys = (modifier: Modifier) => converge(zipObj, [compose(map(modifier), keys), values])

export const createAction = (name: string) => (val: any, key: string) => (payload?: any) => ({ type: `${name}/${key}`, payload })

export const createActions =
  (name: string) => compose(
    mapObjIndexed(createAction(name)),
    modifyObjKeys(dropPrefix(name)),
    pickBy(either(isPureName, hasPrefix(name)))
  )
