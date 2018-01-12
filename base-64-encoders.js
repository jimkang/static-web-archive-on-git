/* global Buffer */

function encodeInBase64(buffer) {
  return buffer.toString('base64');
}

function decodeFromBase64(s) {
  return Buffer.from(s, 'base64');
}

function encodeTextInBase64(s) {
  return Buffer.from(s, 'utf8').toString('base64');
}

function decodeFromBase64ToText(s) {
  return Buffer.from(s, 'base64').toString('utf8');
}

module.exports = {
  encodeInBase64: encodeInBase64,
  decodeFromBase64: decodeFromBase64,
  encodeTextInBase64: encodeTextInBase64,
  decodeFromBase64ToText: decodeFromBase64ToText
};
