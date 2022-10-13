export const getRegisterNumber = (alunos: any) => {
  const maxValue = alunos.reduce(function (
    prev: { register_number: number },
    current: { register_number: number },
  ) {
    return prev.register_number > current.register_number
      ? prev.register_number
      : current.register_number
  })
  return maxValue + 1
}
