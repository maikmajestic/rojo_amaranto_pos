import moment from 'moment'

export function formatDate(date){
  const newDate = moment(date).format('L - hh:mm a');
  return newDate;
}
export function formatDateLocal(date){
  const newDate = moment(date).format('YYYY-MM-DD HH:MM:SS');
  return newDate;
}

export function formatDateLocalSimple(date){
  const newDate = moment(date).format('YYYY-MM-DD');
  return newDate;
}