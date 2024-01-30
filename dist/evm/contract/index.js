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
exports.isFlareContract = exports.getContractData = void 0;
const chain = __importStar(require("./chain"));
const explorer = __importStar(require("./explorer"));
const registry_1 = require("./registry");
const ethers_1 = require("ethers");
function getContractData(network, address) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = _getDataFromRegistry(network, address);
        if (data == null) {
            data = yield _getDataFromExplorer(network, address);
        }
        return _toContractData(network, data);
    });
}
exports.getContractData = getContractData;
function isFlareContract(network, address) {
    return __awaiter(this, void 0, void 0, function* () {
        return chain.isFlareNetworkContract(network, address);
    });
}
exports.isFlareContract = isFlareContract;
function _getDataFromRegistry(network, address) {
    return address in registry_1.registry[network] ? registry_1.registry[network][address] : null;
}
function _getDataFromExplorer(network, address) {
    return __awaiter(this, void 0, void 0, function* () {
        return explorer.getContract(network, address);
    });
}
function _toContractData(network, data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (data == null) {
            return null;
        }
        else {
            let isFlareNetworkContract = yield isFlareContract(network, data.address);
            return Object.assign(Object.assign({}, data), { isFlareNetworkContract, interface: ethers_1.Interface.from(data.abi) });
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZXZtL2NvbnRyYWN0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0NBQWdDO0FBQ2hDLHFEQUFzQztBQUV0Qyx5Q0FBcUM7QUFDckMsbUNBQW1DO0FBRW5DLFNBQXNCLGVBQWUsQ0FDakMsT0FBZSxFQUNmLE9BQWU7O1FBRWYsSUFBSSxJQUFJLEdBQUcsb0JBQW9CLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ2pELElBQUksSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ2YsSUFBSSxHQUFHLE1BQU0sb0JBQW9CLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ3ZELENBQUM7UUFDRCxPQUFPLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDekMsQ0FBQztDQUFBO0FBVEQsMENBU0M7QUFFRCxTQUFzQixlQUFlLENBQ2pDLE9BQWUsRUFDZixPQUFlOztRQUVmLE9BQU8sS0FBSyxDQUFDLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUN6RCxDQUFDO0NBQUE7QUFMRCwwQ0FLQztBQUVELFNBQVMsb0JBQW9CLENBQ3pCLE9BQWUsRUFDZixPQUFlO0lBRWYsT0FBTyxPQUFPLElBQUksbUJBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsbUJBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO0FBQzNFLENBQUM7QUFFRCxTQUFlLG9CQUFvQixDQUMvQixPQUFlLEVBQ2YsT0FBZTs7UUFFZixPQUFPLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ2pELENBQUM7Q0FBQTtBQUVELFNBQWUsZUFBZSxDQUMxQixPQUFlLEVBQ2YsSUFBNEI7O1FBRTVCLElBQUksSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ2YsT0FBTyxJQUFJLENBQUE7UUFDZixDQUFDO2FBQU0sQ0FBQztZQUNKLElBQUksc0JBQXNCLEdBQUcsTUFBTSxlQUFlLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUN6RSx1Q0FDTyxJQUFJLEtBQ1Asc0JBQXNCLEVBQ3RCLFNBQVMsRUFBRSxrQkFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQ3RDO1FBQ0wsQ0FBQztJQUNMLENBQUM7Q0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNoYWluIGZyb20gXCIuL2NoYWluXCJcbmltcG9ydCAqIGFzIGV4cGxvcmVyIGZyb20gXCIuL2V4cGxvcmVyXCJcbmltcG9ydCB7IENvbnRyYWN0RGF0YSwgQWJpQ29udHJhY3REYXRhIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XG5pbXBvcnQgeyByZWdpc3RyeSB9IGZyb20gXCIuL3JlZ2lzdHJ5XCJcbmltcG9ydCB7IEludGVyZmFjZSB9IGZyb20gXCJldGhlcnNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvbnRyYWN0RGF0YShcbiAgICBuZXR3b3JrOiBudW1iZXIsXG4gICAgYWRkcmVzczogc3RyaW5nXG4pOiBQcm9taXNlPENvbnRyYWN0RGF0YSB8IG51bGw+IHsgICAgXG4gICAgbGV0IGRhdGEgPSBfZ2V0RGF0YUZyb21SZWdpc3RyeShuZXR3b3JrLCBhZGRyZXNzKVxuICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgICAgZGF0YSA9IGF3YWl0IF9nZXREYXRhRnJvbUV4cGxvcmVyKG5ldHdvcmssIGFkZHJlc3MpXG4gICAgfVxuICAgIHJldHVybiBfdG9Db250cmFjdERhdGEobmV0d29yaywgZGF0YSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlzRmxhcmVDb250cmFjdChcbiAgICBuZXR3b3JrOiBudW1iZXIsXG4gICAgYWRkcmVzczogc3RyaW5nXG4pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gY2hhaW4uaXNGbGFyZU5ldHdvcmtDb250cmFjdChuZXR3b3JrLCBhZGRyZXNzKVxufVxuXG5mdW5jdGlvbiBfZ2V0RGF0YUZyb21SZWdpc3RyeShcbiAgICBuZXR3b3JrOiBudW1iZXIsXG4gICAgYWRkcmVzczogc3RyaW5nXG4pOiBBYmlDb250cmFjdERhdGEgfCBudWxsIHtcbiAgICByZXR1cm4gYWRkcmVzcyBpbiByZWdpc3RyeVtuZXR3b3JrXSA/IHJlZ2lzdHJ5W25ldHdvcmtdW2FkZHJlc3NdIDogbnVsbFxufVxuXG5hc3luYyBmdW5jdGlvbiBfZ2V0RGF0YUZyb21FeHBsb3JlcihcbiAgICBuZXR3b3JrOiBudW1iZXIsXG4gICAgYWRkcmVzczogc3RyaW5nXG4pOiBQcm9taXNlPEFiaUNvbnRyYWN0RGF0YSB8IG51bGw+IHtcbiAgICByZXR1cm4gZXhwbG9yZXIuZ2V0Q29udHJhY3QobmV0d29yaywgYWRkcmVzcylcbn1cblxuYXN5bmMgZnVuY3Rpb24gX3RvQ29udHJhY3REYXRhKFxuICAgIG5ldHdvcms6IG51bWJlcixcbiAgICBkYXRhOiBBYmlDb250cmFjdERhdGEgfCBudWxsXG4pOiBQcm9taXNlPENvbnRyYWN0RGF0YSB8IG51bGw+IHtcbiAgICBpZiAoZGF0YSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGlzRmxhcmVOZXR3b3JrQ29udHJhY3QgPSBhd2FpdCBpc0ZsYXJlQ29udHJhY3QobmV0d29yaywgZGF0YS5hZGRyZXNzKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICAgIGlzRmxhcmVOZXR3b3JrQ29udHJhY3QsXG4gICAgICAgICAgICBpbnRlcmZhY2U6IEludGVyZmFjZS5mcm9tKGRhdGEuYWJpKVxuICAgICAgICB9XG4gICAgfVxufSJdfQ==