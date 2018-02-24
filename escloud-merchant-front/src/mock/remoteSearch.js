import Mock from 'mockjs'
import { mockParam2Obj } from '@/utils'

const NameList = []
const count = 100

for (let i = 0; i < count; i++) {
  NameList.push(Mock.mock({
    name: '@first'
  }))
}
NameList.push({ name: 'mockPan' })

export default {
  searchUser: config => {
    const { name } = mockParam2Obj(config.url)
    const mockNameList = NameList.filter(item => {
      const lowerCaseName = item.name.toLowerCase()
      if (name && lowerCaseName.indexOf(name.toLowerCase()) < 0) return false
      return true
    })
    return { items: mockNameList }
  }
}
