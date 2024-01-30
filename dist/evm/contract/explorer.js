"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContracts = exports.getContract = void 0;
const settings = __importStar(require("../../settings"));
function getContract(network, address) {
    return __awaiter(this, void 0, void 0, function* () {
        let contracts = yield _get(network, `?module=contract&action=getsourcecode&address=${address}`);
        if (contracts.length > 1) {
            throw new Error("Unexpected number of contracts");
        }
        else if (contracts.length == 1) {
            return _parseContract(contracts[0]);
        }
        else {
            return null;
        }
    });
}
exports.getContract = getContract;
function getContracts(network) {
    return __awaiter(this, void 0, void 0, function* () {
        let contracts = new Array();
        let data = yield _get(network, "?module=contract&action=listcontracts&page=0&offset=1000&filter=1");
        for (let item of data) {
            let contract = _parseContract(item);
            if (contract != null) {
                contracts.push(contract);
            }
        }
        return contracts;
    });
}
exports.getContracts = getContracts;
function _parseContract(contract) {
    if (contract && contract.Address && contract.ABI) {
        return {
            address: contract.Address.toLowerCase(),
            name: contract.ContractName,
            abi: contract.ABI
        };
    }
    else {
        return null;
    }
}
function _get(network, path) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = `${settings.EXPLORER[network]}${path}`;
        let data = yield fetch(url);
        let response = yield data.json();
        if (response.status !== "1") {
            throw new Error(response.message);
        }
        return response.result;
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwbG9yZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZXZtL2NvbnRyYWN0L2V4cGxvcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseURBQTBDO0FBUzFDLFNBQXNCLFdBQVcsQ0FDN0IsT0FBZSxFQUNmLE9BQWU7O1FBRWYsSUFBSSxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLGlEQUFpRCxPQUFPLEVBQUUsQ0FBZSxDQUFBO1FBQzdHLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7UUFDckQsQ0FBQzthQUFNLElBQUksU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUMvQixPQUFPLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN2QyxDQUFDO2FBQU0sQ0FBQztZQUNKLE9BQU8sSUFBSSxDQUFBO1FBQ2YsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQVpELGtDQVlDO0FBRUQsU0FBc0IsWUFBWSxDQUM5QixPQUFlOztRQUVmLElBQUksU0FBUyxHQUFHLElBQUksS0FBSyxFQUFtQixDQUFBO1FBQzVDLElBQUksSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxtRUFBbUUsQ0FBZSxDQUFBO1FBQ2pILEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUM7WUFDcEIsSUFBSSxRQUFRLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ25DLElBQUksUUFBUSxJQUFJLElBQUksRUFBRSxDQUFDO2dCQUNuQixTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQzVCLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxTQUFTLENBQUE7SUFDcEIsQ0FBQztDQUFBO0FBWkQsb0NBWUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxRQUFhO0lBQ2pDLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxPQUFPLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQy9DLE9BQU87WUFDSCxPQUFPLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDdkMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxZQUFZO1lBQzNCLEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRztTQUNwQixDQUFBO0lBQ0wsQ0FBQztTQUFNLENBQUM7UUFDSixPQUFPLElBQUksQ0FBQTtJQUNmLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBZSxJQUFJLENBQUMsT0FBZSxFQUFFLElBQVk7O1FBQzdDLElBQUksR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQTtRQUNoRCxJQUFJLElBQUksR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUMzQixJQUFJLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQWMsQ0FBQTtRQUM1QyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDckMsQ0FBQztRQUNELE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQTtJQUMxQixDQUFDO0NBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzZXR0aW5ncyBmcm9tIFwiLi4vLi4vc2V0dGluZ3NcIlxuaW1wb3J0IHsgQWJpQ29udHJhY3REYXRhIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCJcblxuaW50ZXJmYWNlIFJlc3BvbnNlIHtcbiAgICByZXN1bHQ6IGFueSxcbiAgICBtZXNzYWdlOiBzdHJpbmcsXG4gICAgc3RhdHVzOiBzdHJpbmdcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvbnRyYWN0KFxuICAgIG5ldHdvcms6IG51bWJlcixcbiAgICBhZGRyZXNzOiBzdHJpbmdcbik6IFByb21pc2U8QWJpQ29udHJhY3REYXRhIHwgbnVsbD4ge1xuICAgIGxldCBjb250cmFjdHMgPSBhd2FpdCBfZ2V0KG5ldHdvcmssIGA/bW9kdWxlPWNvbnRyYWN0JmFjdGlvbj1nZXRzb3VyY2Vjb2RlJmFkZHJlc3M9JHthZGRyZXNzfWApIGFzIEFycmF5PGFueT5cbiAgICBpZiAoY29udHJhY3RzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCBudW1iZXIgb2YgY29udHJhY3RzXCIpXG4gICAgfSBlbHNlIGlmIChjb250cmFjdHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgcmV0dXJuIF9wYXJzZUNvbnRyYWN0KGNvbnRyYWN0c1swXSlcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvbnRyYWN0cyhcbiAgICBuZXR3b3JrOiBudW1iZXJcbik6IFByb21pc2U8QXJyYXk8QWJpQ29udHJhY3REYXRhPj4ge1xuICAgIGxldCBjb250cmFjdHMgPSBuZXcgQXJyYXk8QWJpQ29udHJhY3REYXRhPigpXG4gICAgbGV0IGRhdGEgPSBhd2FpdCBfZ2V0KG5ldHdvcmssIFwiP21vZHVsZT1jb250cmFjdCZhY3Rpb249bGlzdGNvbnRyYWN0cyZwYWdlPTAmb2Zmc2V0PTEwMDAmZmlsdGVyPTFcIikgYXMgQXJyYXk8YW55PlxuICAgIGZvciAobGV0IGl0ZW0gb2YgZGF0YSkge1xuICAgICAgICBsZXQgY29udHJhY3QgPSBfcGFyc2VDb250cmFjdChpdGVtKVxuICAgICAgICBpZiAoY29udHJhY3QgIT0gbnVsbCkge1xuICAgICAgICAgICAgY29udHJhY3RzLnB1c2goY29udHJhY3QpXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbnRyYWN0c1xufVxuXG5mdW5jdGlvbiBfcGFyc2VDb250cmFjdChjb250cmFjdDogYW55KTogQWJpQ29udHJhY3REYXRhIHwgbnVsbCB7XG4gICAgaWYgKGNvbnRyYWN0ICYmIGNvbnRyYWN0LkFkZHJlc3MgJiYgY29udHJhY3QuQUJJKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhZGRyZXNzOiBjb250cmFjdC5BZGRyZXNzLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICBuYW1lOiBjb250cmFjdC5Db250cmFjdE5hbWUsXG4gICAgICAgICAgICBhYmk6IGNvbnRyYWN0LkFCSVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9nZXQobmV0d29yazogbnVtYmVyLCBwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGxldCB1cmwgPSBgJHtzZXR0aW5ncy5FWFBMT1JFUltuZXR3b3JrXX0ke3BhdGh9YFxuICAgIGxldCBkYXRhID0gYXdhaXQgZmV0Y2godXJsKVxuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGRhdGEuanNvbigpIGFzIFJlc3BvbnNlXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPT0gXCIxXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3BvbnNlLm1lc3NhZ2UpXG4gICAgfVxuICAgIHJldHVybiByZXNwb25zZS5yZXN1bHRcbn0iXX0=