export const dynamicSort = (prop) => {
  return (a, b) => {
    if (a && b && a[prop] && b[prop]) return a[prop].toString().localeCompare(b[prop].toString(), 'en', { numeric: true })
  }
}