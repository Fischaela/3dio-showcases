module.exports = prettifyHtml
/* eslint-disable no-cond-assign */
// format html string with proper indentation
function prettifyHtml (str, initialIndentation) {
  var indents = initialIndentation || 0
  var previousClose = false
  // break points to check for
  var reg = /><./gm
  var match, isClosing, start, end, lineBreak, skipBreak
  while (match = reg.exec(str)) {
    start = match.index
    end = reg.lastIndex - 1
    // check if we're looking at a closing tag
    isClosing = str.slice(start + 2, end + 1) === '/'
    skipBreak = false
    if (isClosing) {
      // if the previous tag was also closing we jump out by two
      if (previousClose) indents -= 2
      // no line break if we're closing the same element
      else skipBreak = true
      previousClose = true
    } else {
      // if the previous tag was also opening we jump in by two
      if (!previousClose) indents += 2
      previousClose = false
    }
    lineBreak = '>\n' + ' '.repeat(indents) + '<'
    if (!skipBreak) str = replaceAt(str, start, end, lineBreak)
  }
  return str
}

function replaceAt (str, start, end, replacement) {
  return str.substr(0, start) + replacement + str.substr(end)
}
