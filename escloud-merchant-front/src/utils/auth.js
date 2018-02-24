const UserTokenKey = 'EDENEP_SYSTEM_USER_TOKEN'
const UserIdKey = 'EDENEP_SYSTEM_USER_ID'
const MerchantIdKey = 'EDENEP_SYSTEM_MERCHANT_ID'

export function getToken() {
  return sessionStorage.getItem(UserTokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem(UserTokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(UserTokenKey)
}

export function getUserId() {
  return sessionStorage.getItem(UserIdKey)
}

export function setUserId(userId) {
  return sessionStorage.setItem(UserIdKey, userId)
}

export function removeUserId() {
  return sessionStorage.removeItem(UserIdKey)
}

export function getMerchantId() {
  return sessionStorage.getItem(MerchantIdKey)
}

export function setMerchantId(merchantId) {
  return sessionStorage.setItem(MerchantIdKey, merchantId)
}

export function removeMerchantId() {
  return sessionStorage.removeItem(MerchantIdKey)
}

export function hasLogined() {
  const userId = sessionStorage.getItem(UserIdKey)
  if (getToken() && userId) {
    return true
  } else {
    return false
  }
}

export function hasPermission(data) {
  if (typeof data.requirToken !== 'undefined') {
    if (data.requirToken === true) {
      if (typeof data.token !== 'undefined' && data.token) {
        const token = getToken()
        if (data.token === token) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    } else {
      return true
    }
  } else {
    return false
  }
}
