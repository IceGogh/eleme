export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 正负整数 */
export function validatInteger(value) {
  const reg = /^-?\d+$/
  return reg.test(value)
}

/* 正整数 */
export function validatSignlessInteger(value) {
  const reg = /^[1-9]\d*$/
  return reg.test(value)
}

/* 金额 */
export function validatAmount(value) {
  const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  return reg.test(value)
}

/* 英数字 */
export function validatCode(value) {
  const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  return reg.test(value)
}

/* email*/
export function validatEmail(value) {
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(value)
}

/* mobile*/
export function validatMobile(value) {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/
  return reg.test(value)
}

/* tel*/
export function validatTle(value) {
  const reg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
  return reg.test(value)
}

/* postCode*/
export function validatPostCode(value) {
  const reg = /^[1-9][0-9]{5}$/
  return reg.test(value)
}

/* idNo*/
export function validatIdNo(value) {
  const reg = /^\d{15}|\d{}18$/
  return reg.test(value)
}

/*
校验器
-- required = ture   必输
-- string            字符
-- number            正负整数
-- signlessInteger   非零正整数
-- amount            两位小数金额
-- code              英数字
-- email             邮箱
-- mobile            手机号码
-- tel               电话号码
-- postCode          邮编
-- uri               合法uri
-- idNo              15/18位身份证号码
*/
export function validator(rule, value) {
  const result = {
    pass: false,
    msg: ''
  }
  if (!rule.fieldType) {
    result.msg = '校验类型不能为空'
    return result
  }
  if (rule.required) {
    if (!value || value === '') {
      result.msg = '请输入' + rule.fieldName
      return result
    }
  }

  // string
  if (rule.fieldType === 'string') {
    if (rule.min || rule.min !== '' || typeof rule.min !== 'number') {
      if (value.length < rule.min) {
        result.msg = '至少输入' + rule.min + '个字符'
        return result
      }
    }
    if (rule.max || rule.max !== '' || typeof rule.max !== 'number') {
      if (value.length > rule.max) {
        result.msg = '至多输入' + rule.max + '个字符'
        return result
      }
    }
  }

  // number
  if (rule.fieldType === 'number') {
    if (!validatInteger(value)) {
      result.msg = '请输入正确的数字'
      return result
    }
    if (rule.min || rule.min !== '' || typeof rule.min !== 'number') {
      if (value.length < rule.min) {
        result.msg = '至少输入' + rule.min + '位数字'
        return result
      }
    }
    if (rule.max || rule.max !== '' || typeof rule.max !== 'number') {
      if (value.length > rule.max) {
        result.msg = '至多输入' + rule.max + '位数字'
        return result
      }
    }
  }

  // signlessInteger
  if (rule.fieldType === 'signlessInteger') {
    if (!validatSignlessInteger(value)) {
      result.msg = '请输入正确的数字'
      return result
    }
    if (rule.min || rule.min !== '' || typeof rule.min !== 'number') {
      if (value.toString().length < rule.min) {
        result.msg = '至少输入' + rule.min + '位数字'
        return result
      }
    }
    if (rule.max || rule.max !== '' || typeof rule.max !== 'number') {
      if (value.toString().length > rule.max) {
        result.msg = '至多输入' + rule.max + '位数字'
        return result
      }
    }
  }

  // amount
  if (rule.fieldType === 'amount') {
    if (!validatAmount(value)) {
      result.msg = '请输入正确的金额'
      return result
    }
    if (rule.min || rule.min !== '' || typeof rule.min !== 'number') {
      if (value.toString().length < rule.min) {
        result.msg = '至少输入' + rule.min + '位数字'
        return result
      }
    }
    if (rule.max || rule.max !== '' || typeof rule.max !== 'number') {
      if (value.toString().length > rule.max) {
        result.msg = '至多输入' + rule.max + '位数字'
        return result
      }
    }
  }

  // code
  if (rule.fieldType === 'code') {
    if (!validatCode(value)) {
      result.msg = '只能输入英数字'
      return result
    }
    if (rule.min || rule.min !== '' || typeof rule.min !== 'number') {
      if (value.length < rule.min) {
        result.msg = '至少输入' + rule.min + '个字符'
        return result
      }
    }
    if (rule.max || rule.max !== '' || typeof rule.max !== 'number') {
      if (value.length > rule.max) {
        result.msg = '至多输入' + rule.max + '个字符'
        return result
      }
    }
  }

  // email
  if (rule.fieldType === 'email') {
    if (!validatEmail(value)) {
      result.msg = '请输入正确的邮箱地址'
      return result
    }
  }

  // mobile
  if (rule.fieldType === 'mobile') {
    if (!validatMobile(value)) {
      result.msg = '请输入正确的手机号码'
      return result
    }
  }

  // tel
  if (rule.fieldType === 'tel') {
    if (!validatTle(value)) {
      result.msg = '请输入正确的电话号码'
      return result
    }
  }

  // tel
  if (rule.fieldType === 'tel||mobile') {
    if ((!validatTle(value)) && (!validatMobile(value))) {
      result.msg = '请输入正确的联系号码'
      return result
    }
  }

  // postCode
  if (rule.fieldType === 'postCode') {
    if (!validatPostCode(value)) {
      result.msg = '请输入正确的邮政编码'
      return result
    }
  }

  // uri
  if (rule.fieldType === 'uri') {
    if (!validateURL(value)) {
      result.msg = '请输入正确的URL'
      return result
    }
  }

  // idNo
  if (rule.fieldType === 'idNo') {
    if (!validatIdNo(value)) {
      result.msg = '请输入正确的身份证号码'
      return result
    }
  }

  result.pass = true
  result.msg = '校验通过'
  return result
}
