export function isValidPhone(rule,value,callback) {
  const phoneReg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
  // const telReg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
  const telReg = /1[0-9]{10}|\(?\d{0,4}\)?-?\s?\d{8}/
  if (!value || phoneReg.test(value) || telReg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的电话号'))
  }
}

export function checkNumber(rule, value, callback) {
  if(isNaN(value)) {
    callback(new Error('请输入数字'))
  } else {
    callback()
  }
}
