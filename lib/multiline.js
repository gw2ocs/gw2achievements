// from https://github.com/petervdn/multiline-canvas-text

const { createCanvas } = require('canvas');

/**
 * For a given string, returns a new string in which all the separate words (characters divided by a space) fit in the given width. Can add spaces into original words if they are too long.
 * @param {string} text
 * @param {number} availableWidth
 * @param {IFont} font
 * @returns {string}
 */
 function splitIntoFittingWords(text, availableWidth, font) {
	const splitResults = [];
  
	text.split(' ').forEach(word => {
	  if (getTextWidth(word, font).width < availableWidth) {
		// word fits
		splitResults.push(word);
	  } else {
		// word does not fit, split into characters
		groupText(word, '', availableWidth, font).forEach(entry => {
		  splitResults.push(entry);
		});
	  }
	});
  
	return splitResults.join(' ');
  }
  
  /**
   * Measures the width of a string for a given font.
   * @param {string} text
   * @param {IFont} font
   * @returns {number}
   */
  function getTextWidth(text, font) {
	const testContext = createCanvas().getContext('2d');
	testContext.font = getCanvasFontProperty(font);
  
	return testContext.measureText(text);
  }
  
  /**
   * Groups a given string into fitting parts. What a part is is defined by the character to split the original string on.
   * @param {string} text
   * @param {string} splitOn
   * @param {number} availableWidth
   * @param {IFont} font
   * @returns {string[]}
   */
  function groupText(text, splitOn, availableWidth, font) {
	return text.split(splitOn).reduce((resultingLines, currentItem) => {
	  if (resultingLines.length === 0) {
		resultingLines.push('');
	  }
	  const lastLine = resultingLines[resultingLines.length - 1];
  
	  // test if the last line with the current word would fit
	  const testLine = (lastLine.length > 0 ? lastLine + splitOn : lastLine) + currentItem;
	  const testLineWidth = getTextWidth(testLine, font).width;
	  if (
		testLineWidth > availableWidth &&
		!(resultingLines.length === 1 && resultingLines[0].length === 0)
	  ) {
		// does not fit, create new line
		resultingLines.push(currentItem);
	  } else {
		// add to current line
		resultingLines[resultingLines.length - 1] = testLine;
	  }
  
	  return resultingLines;
	}, []);
  }
  
  /**
   * Breaks up a string into lines that fit within the supplied width.
   * @param {string} text
   * @param {number} width
   * @param {string} fontName
   * @param {number} fontSize
   * @returns {string[]}
   */
  function fitText(text, width, fontName, fontSize) {
	const font = createFont(fontName, fontSize);
	const fittingWords = splitIntoFittingWords(text, width, font);
  
	return groupText(fittingWords, ' ', width, font);
  }
  
  /**
   * Formats fontName and fontSize into a css string for canvas.
   * @param {IFont} font
   * @returns {string}
   */
  function getCanvasFontProperty(font) {
	return `${font.size}px ${font.name}`;
  }
  
  /**
   * Create IFont object
   * @param {string} name
   * @param {number} size
   * @returns {IFont}
   */
  const createFont = (name, size) => ({ size, name });

  module.exports = { fitText };