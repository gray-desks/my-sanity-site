"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHreflangCode = exports.getSupportedLanguages = exports.getLangIds = void 0;
var supportedLanguages_js_1 = require("../../../supportedLanguages.js");
/**
 * Get all supported language IDs from the central supportedLanguages configuration
 * @returns Array of language codes (e.g. ['ja', 'en', 'zh-cn', ...])
 */
var getLangIds = function () {
    return supportedLanguages_js_1.supportedLanguages.map(function (lang) { return lang.id; });
};
exports.getLangIds = getLangIds;
/**
 * Get the full supported languages array
 * @returns Array of language objects with id and title
 */
var getSupportedLanguages = function () {
    return supportedLanguages_js_1.supportedLanguages;
};
exports.getSupportedLanguages = getSupportedLanguages;
/**
 * Get hreflang code for a given language ID
 * Maps language codes to proper hreflang format
 */
var getHreflangCode = function (langId) {
    var hreflangMap = {
        'ja': 'ja',
        'en': 'en',
        'zh-cn': 'zh-Hans',
        'zh-tw': 'zh-Hant',
        'ko': 'ko',
        'th': 'th',
        'vi': 'vi',
        'id': 'id',
        'ms': 'ms',
        'tl': 'tl',
        'fr': 'fr',
        'de': 'de',
        'es': 'es',
        'it': 'it',
        'pt': 'pt',
        'ru': 'ru',
        'ar': 'ar',
        'hi': 'hi',
        'tr': 'tr',
        'pt-br': 'pt-BR'
    };
    return hreflangMap[langId] || langId;
};
exports.getHreflangCode = getHreflangCode;
