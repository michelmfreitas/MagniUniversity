export const ArrayOfObjects = (data: Object) => {
  return Object.entries(data).map((e) => ({ [e[0]]: e[1] }))
}
