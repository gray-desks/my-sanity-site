"use strict";
/**
 * OG Image Generation Script
 * Generates default OG images for each language using Sharp
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOgImages = generateOgImages;
var sharp_1 = require("sharp");
var fs_1 = require("fs");
var path_1 = require("path");
var url_1 = require("url");
var path_2 = require("path");
var getSupportedLangs_js_1 = require("../lib/getSupportedLangs.js");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = (0, path_2.dirname)(__filename);
// OG Image dimensions (1200x630 for optimal social media display)
var OG_WIDTH = 1200;
var OG_HEIGHT = 630;
// Language-specific titles
var langTitles = {
    'ja': '旅ログ - 日本全国の旅記録',
    'en': 'Travel Log - Japan Travel Journal',
    'zh-cn': '旅行日志 - 日本全国旅行记录',
    'zh-tw': '旅行日誌 - 日本全國旅行記錄',
    'ko': '여행 로그 - 일본 전국 여행 기록',
    'th': 'บันทึกการเดินทาง - บันทึกการเดินทางทั่วญี่ปุ่น',
    'vi': 'Nhật ký du lịch - Ghi chép du lịch toàn Nhật Bản',
    'id': 'Log Perjalanan - Catatan Perjalanan Seluruh Jepang',
    'ms': 'Log Perjalanan - Catatan Perjalanan Seluruh Jepang',
    'tl': 'Travel Log - Tala ng Paglalakbay sa Buong Japan',
    'fr': 'Journal de Voyage - Carnets de voyage du Japon',
    'de': 'Reisetagebuch - Japan Reiseaufzeichnungen',
    'es': 'Diario de Viaje - Registro de viajes por todo Japón',
    'it': 'Diario di Viaggio - Registri di viaggio in tutto il Giappone',
    'pt': 'Diário de Viagem - Registros de viagem por todo o Japão',
    'ru': 'Дневник путешествий - Записи путешествий по всей Японии',
    'ar': 'مذكرات السفر - سجلات السفر في جميع أنحاء اليابان',
    'hi': 'यात्रा डायरी - पूरे जापान की यात्रा रिकॉर्ड',
    'tr': 'Seyahat Günlüğü - Tüm Japonya Seyahat Kayıtları',
    'pt-br': 'Diário de Viagem - Registros de viagem por todo o Japão'
};
function generateOgImages() {
    return __awaiter(this, void 0, void 0, function () {
        var publicDir, ogDir, langIds, _i, langIds_1, langId, title, outputPath, background, hinomaru, textSvg, finalImage, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🖼️  Generating OG images...');
                    publicDir = (0, path_1.join)(__dirname, '../../public');
                    ogDir = (0, path_1.join)(publicDir, 'og');
                    // Create og directory if it doesn't exist
                    if (!(0, fs_1.existsSync)(ogDir)) {
                        (0, fs_1.mkdirSync)(ogDir, { recursive: true });
                    }
                    langIds = (0, getSupportedLangs_js_1.getLangIds)();
                    _i = 0, langIds_1 = langIds;
                    _a.label = 1;
                case 1:
                    if (!(_i < langIds_1.length)) return [3 /*break*/, 7];
                    langId = langIds_1[_i];
                    title = langTitles[langId] || langTitles['en'];
                    outputPath = (0, path_1.join)(ogDir, "default-".concat(langId, ".webp"));
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, (0, sharp_1.default)({
                            create: {
                                width: OG_WIDTH,
                                height: OG_HEIGHT,
                                channels: 3,
                                background: { r: 253, g: 252, b: 251 } // base: '#FDFCFB'
                            }
                        })
                            .png()
                            .toBuffer()];
                case 3:
                    background = _a.sent();
                    hinomaru = Buffer.from("\n        <svg width=\"".concat(OG_WIDTH, "\" height=\"").concat(OG_HEIGHT, "\">\n          <circle cx=\"").concat(OG_WIDTH / 2, "\" cy=\"").concat(OG_HEIGHT / 2, "\" r=\"").concat(OG_HEIGHT * 0.6, "\" fill=\"#A61E22\" opacity=\"0.05\" />\n        </svg>\n      "));
                    textSvg = "\n        <svg width=\"".concat(OG_WIDTH, "\" height=\"").concat(OG_HEIGHT, "\">\n          <style>\n            .title {\n              font-family: 'Noto Serif JP', serif;\n              font-size: 72px;\n              font-weight: bold;\n              fill: #2C2C2C; /* ink */\n              text-anchor: middle;\n              dominant-baseline: middle;\n            }\n            .logo-text {\n              font-family: 'Noto Sans JP', sans-serif;\n              font-size: 36px;\n              font-weight: bold;\n              fill: #2C2C2C; /* ink */\n              text-anchor: middle;\n              dominant-baseline: middle;\n            }\n            .logo-box {\n              fill: #A61E22; /* primary */\n            }\n            .logo-char {\n              font-family: 'Noto Sans JP', sans-serif;\n              font-size: 48px;\n              font-weight: bold;\n              fill: #FDFCFB; /* base */\n              text-anchor: middle;\n              dominant-baseline: middle;\n            }\n            .domain {\n                font-family: 'Noto Sans JP', sans-serif;\n                font-size: 24px;\n                fill: #5A5A5A; /* secondary */\n                text-anchor: middle;\n                dominant-baseline: middle;\n            }\n          </style>\n          \n          <!-- Logo -->\n          <g transform=\"translate(").concat(OG_WIDTH / 2 - 100, ", 150)\">\n            <rect x=\"-40\" y=\"-40\" width=\"80\" height=\"80\" rx=\"12\" class=\"logo-box\" />\n            <text x=\"0\" y=\"5\" class=\"logo-char\">\u65C5</text>\n          </g>\n          <text x=\"").concat(OG_WIDTH / 2 + 40, "\" y=\"150\" class=\"logo-text\">\u65C5\u30ED\u30B0</text>\n\n          <!-- Main Title -->\n          <text x=\"").concat(OG_WIDTH / 2, "\" y=\"340\" class=\"title\">").concat(title, "</text>\n\n          <!-- Domain -->\n          <text x=\"").concat(OG_WIDTH / 2, "\" y=\"550\" class=\"domain\">your-domain.com</text>\n        </svg>\n      ");
                    return [4 /*yield*/, (0, sharp_1.default)(background)
                            .composite([
                            { input: hinomaru, top: 0, left: 0 },
                            { input: Buffer.from(textSvg), top: 0, left: 0 }
                        ])
                            .webp({ quality: 85 })
                            .toBuffer()];
                case 4:
                    finalImage = _a.sent();
                    // Write to file
                    (0, fs_1.writeFileSync)(outputPath, finalImage);
                    console.log("\u2705 Generated: ".concat(outputPath));
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("\u274C Failed to generate OG image for ".concat(langId, ":"), error_1);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    console.log('🎉 OG image generation completed!');
                    return [2 /*return*/];
            }
        });
    });
}
// Run if called directly
if (import.meta.url === "file://".concat(process.argv[1])) {
    generateOgImages().catch(console.error);
}
