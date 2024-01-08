export function buildRoutePath(path) {
  const routeParamatersRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replaceAll(routeParamatersRegex, '(?<id>[a-z0-9\-_]+)')

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

  return pathRegex
}