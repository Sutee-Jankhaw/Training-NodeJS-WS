function dateFormat(date) {
  return new Date(date).toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok'
  })
}

module.exports = dateFormat