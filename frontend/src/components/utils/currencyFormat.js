export function currencyFormat(num) {
  const number = parseInt(num);
  return '$' + number.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}