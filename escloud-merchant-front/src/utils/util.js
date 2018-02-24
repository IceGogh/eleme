export default {
  parentNode: null,
  node: null,
  generateUUID: function() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
  },
  getNode: function(tree, nodeId) {
    this.parentNode = null
    this.node = null
    var searchNode = this.searchNode(tree, nodeId, null)
    if (!searchNode.parentNode) {
      searchNode.parentNode = {
        value: null,
        label: null,
        children: tree
      }
    }
    return searchNode
  },
  // 递归寻找父节点
  searchNode: function(tree, nodeId, parentNode) {
    for (var i = 0; i < tree.length; i++) {
      if (this.node) {
        break
      }
      var obj = tree[i]
      if (!obj || !obj.id) {
        continue
      }
      if (obj.id === nodeId) {
        this.node = obj
        this.parentNode = parentNode
        break
      } else {
        if (obj.children && obj.children.length > 0) {
          this.searchNode(obj.children, nodeId, obj)
        } else {
          continue
        }
      }
    }
    return {
      parentNode: this.parentNode,
      node: this.node
    }
  },
  clearTable: function(tree) {
    for (var i = 0; i < tree.length; i++) {
      var obj = tree[i]
      if (!obj || !obj.id) {
        continue
      }
      if (obj.status === -1) {
        tree.splice(i, 1)
        i--
        continue
      } else {
        if (obj.children && obj.children.length > 0) {
          this.clearTable(obj.children)
        } else {
          continue
        }
      }
    }
  },
  formatNum: function(str) {
    var newStr = ''
    var count = 0
    if (!isNaN(str)) {
      str = str.toString()
    }
    if (str.indexOf('.') === -1) {
      for (var i = str.length - 1; i >= 0; i--) {
        if (count % 3 === 0 && count !== 0) {
          newStr = str.charAt(i) + ',' + newStr
        } else {
          newStr = str.charAt(i) + newStr
        }
        count++
      }
      return newStr
    } else {
      for (var y = str.indexOf('.') - 1; y >= 0; y--) {
        if (count % 3 === 0 && count !== 0) {
          newStr = str.charAt(y) + ',' + newStr
        } else {
          newStr = str.charAt(y) + newStr // 逐个字符相接起来
        }
        count++
      }
      str = newStr + (str + '00').substr((str + '00').indexOf('.'), 3)
      return str
    }
  },
  formatDate: function(date, format) {
    var v = ''
    if (typeof date === 'string' || typeof date !== 'object') {
      return
    }
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    var weekDay = date.getDay()
    var ms = date.getMilliseconds()
    var weekDayString = ''

    if (weekDay === 1) {
      weekDayString = '星期一'
    } else if (weekDay === 2) {
      weekDayString = '星期二'
    } else if (weekDay === 3) {
      weekDayString = '星期三'
    } else if (weekDay === 4) {
      weekDayString = '星期四'
    } else if (weekDay === 5) {
      weekDayString = '星期五'
    } else if (weekDay === 6) {
      weekDayString = '星期六'
    } else if (weekDay === 7) {
      weekDayString = '星期日'
    }

    v = format
    // Year
    v = v.replace(/yyyy/g, year)
    v = v.replace(/YYYY/g, year)
    v = v.replace(/yy/g, (year + '').substring(2, 4))
    v = v.replace(/YY/g, (year + '').substring(2, 4))

    // Month
    var monthStr = ('0' + month)
    v = v.replace(/MM/g, monthStr.substring(monthStr.length - 2))

    // Day
    var dayStr = ('0' + day)
    v = v.replace(/dd/g, dayStr.substring(dayStr.length - 2))

    // hour
    var hourStr = ('0' + hour)
    v = v.replace(/HH/g, hourStr.substring(hourStr.length - 2))
    v = v.replace(/hh/g, hourStr.substring(hourStr.length - 2))

    // minute
    var minuteStr = ('0' + minute)
    v = v.replace(/mm/g, minuteStr.substring(minuteStr.length - 2))

    // Millisecond
    v = v.replace(/sss/g, ms)
    v = v.replace(/SSS/g, ms)

    // second
    var secondStr = ('0' + second)
    v = v.replace(/ss/g, secondStr.substring(secondStr.length - 2))
    v = v.replace(/SS/g, secondStr.substring(secondStr.length - 2))

    // weekDay
    v = v.replace(/E/g, weekDayString)
    return v
  }
}
