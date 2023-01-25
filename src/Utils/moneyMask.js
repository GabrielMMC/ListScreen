export const moneyMask = (value) => {
  try {
    value = value.replace('.', '').replace(',', '').replace(/\D/g, '')
  } catch (e) {
    value = value.toString().replace('.', '').replace(',', '').replace(/\D/g, '')
  }

  const options = { minimumFractionDigits: 2 }
  const result = new Intl.NumberFormat('pt-BR', options).format(
    parseFloat(value)
  )

  return '$ ' + result
}