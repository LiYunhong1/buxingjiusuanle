export const formatTime = time => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export const formatCol = v => {
  let res = ''
  switch (v) {
    case 'string':
      res = '文本（字符）'
      break;
    case 'number':
      res = '数值'
      break;
    case 'datetime':
      res = '日期'
      break;
    default:
      break;
  }
  return res
}

export const formatCountType = v => {
  let res = ''
  switch (v) {
    case 'sum':
      res = '总数'
      break;
    case 'mean':
      res = '平均值'
      break;
    case 'count':
      res = '计数'
      break;
    case 'max':
      res = '最大值'
      break;
    case 'min':
      res = '最小值'
      break;
    case 'var':
      res = '方差'
      break;
    case 'std':
      res = '标准差'
      break;
    default:
      break;
  }
  return res
}

export const formatOrder = v => {
  let res = ''
  if(v==null||v==undefined){
    return ''
  }
  v=v.toString()
  switch (v) {
    case 'true':
      res = '正序'
      break;
    case 'false':
      res = '反序'
      break;
    default:
      break;
  }
  return res
}