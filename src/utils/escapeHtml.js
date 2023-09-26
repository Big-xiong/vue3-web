/**
 * 转义HTML标签的方法
 * @param  {String} str 需要转义的HTML字符串
 * @return {String}     转义后的字符串
 */
export function encodeHTML(str) {
  if (typeof str === 'string') {
    return str.replace(/<|&|>/g, (matches) => ({
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
    })[matches]);
  }

  return '';
}

/**
 * 反转义HTML标签的方法
 * @param  {String} str 需要反转义的字符串
 * @return {String}     反转义后的字符串
 */
export function decodeHTML(str) {
  if (typeof str === 'string') {
    return str.replace(/&lt;|&gt;|&amp;/g, (matches) => ({
      '&lt;': '<',
      '&gt;': '>',
      '&amp;': '&',
    })[matches]);
  }

  return '';
}
