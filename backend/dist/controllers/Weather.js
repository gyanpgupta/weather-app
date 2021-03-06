"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var redis_1 = __importDefault(require("redis"));
var axios_1 = __importDefault(require("axios"));
/*
---------------------------------------------------
  Make a connection to the local instance of redis
---------------------------------------------------
*/
var client = redis_1.default.createClient(6379);
client.on('error', function (error) {
    console.error(error);
});
/*
---------------------------------
  API to fetch Weather's record
---------------------------------
*/
var list = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _a, searchValue, LOCATION_API, HOURLY_API_1, WEEKLY_API_1, value, matches, error_1;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query.searchValue, searchValue = _a === void 0 ? '' : _a;
                LOCATION_API = process.env.LOCATION_API;
                HOURLY_API_1 = process.env.HOURLY_API;
                WEEKLY_API_1 = process.env.WEEKLY_API;
                value = searchValue;
                matches = value.match(/\d+/g);
                return [4 /*yield*/, axios_1.default
                        .get(LOCATION_API.replace(':keyType', matches ? 'geoposition' : 'cities').replace(':searchValue', matches
                        ? matches[0] + "." + matches[1] + ", " + matches[2] + "." + matches[3]
                        : value))
                        .then(function (cityResult) { return __awaiter(_this, void 0, void 0, function () {
                        var key_1, localizedName_1, localizedState_1;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(cityResult && cityResult.data && cityResult.data[0])) return [3 /*break*/, 2];
                                    key_1 = cityResult.data[0].Key;
                                    localizedName_1 = cityResult.data[0].LocalizedName;
                                    localizedState_1 = cityResult.data[0].AdministrativeArea.LocalizedName;
                                    // Check the redis store for the data first
                                    return [4 /*yield*/, client.get("weather-" + key_1, function (err, result) { return __awaiter(_this, void 0, void 0, function () {
                                            var _a, hourlyData, weeklyData;
                                            var _this = this;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        if (result) {
                                                            console.log('result cache');
                                                            _a = JSON.parse(result), hourlyData = _a.hourlyData, weeklyData = _a.weeklyData;
                                                            return [2 /*return*/, res.status(200).json({
                                                                    responseCode: 200,
                                                                    success: true,
                                                                    message: 'Weather data fetched successfully',
                                                                    hourlyData: hourlyData,
                                                                    weeklyData: weeklyData,
                                                                    localizedName: localizedName_1 + ', ' + localizedState_1,
                                                                })];
                                                        }
                                                        console.log('without cache');
                                                        return [4 /*yield*/, axios_1.default
                                                                .get("" + HOURLY_API_1.replace(':key', key_1))
                                                                .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                                                                var _this = this;
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0: return [4 /*yield*/, axios_1.default
                                                                                .get("" + WEEKLY_API_1.replace(':key', key_1))
                                                                                .then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                                                                                var cacheData;
                                                                                return __generator(this, function (_a) {
                                                                                    cacheData = {
                                                                                        hourlyData: response.data,
                                                                                        weeklyData: result.data,
                                                                                    };
                                                                                    // save the record in the cache for subsequent request
                                                                                    client.setex("weather-" + key_1, 1440, JSON.stringify(cacheData));
                                                                                    return [2 /*return*/, res.status(200).json({
                                                                                            responseCode: 200,
                                                                                            success: true,
                                                                                            message: 'Weather data fetched successfully',
                                                                                            hourlyData: response.data,
                                                                                            weeklyData: result.data,
                                                                                            localizedName: localizedName_1 + ', ' + localizedState_1,
                                                                                        })];
                                                                                });
                                                                            }); })
                                                                                .catch(function (error) {
                                                                                return res.status(500).json({
                                                                                    error: error.message,
                                                                                });
                                                                            })];
                                                                        case 1:
                                                                            _a.sent();
                                                                            return [2 /*return*/];
                                                                    }
                                                                });
                                                            }); })
                                                                .catch(function (error) {
                                                                return res.status(500).json({
                                                                    error: error.message,
                                                                });
                                                            })];
                                                    case 1:
                                                        _b.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                case 1:
                                    // Check the redis store for the data first
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (error) {
                        console.log('error', error);
                        return res.status(500).json({
                            error: error.message,
                        });
                    })];
            case 1:
                _b.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                return [2 /*return*/, res.status(500).json({
                        error: error_1.message,
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.default = { list: list };
