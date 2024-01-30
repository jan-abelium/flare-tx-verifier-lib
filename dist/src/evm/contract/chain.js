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
exports.getRawTransaction = exports.isFlareNetworkContract = exports.getFlareNetworkContracts = void 0;
const registry_1 = require("./registry");
const settings = __importStar(require("../../settings"));
const ethers_1 = require("ethers");
function getFlareNetworkContracts(network) {
    return __awaiter(this, void 0, void 0, function* () {
        let provider = _getProvider(network);
        let address = settings.FLARE_CONTRACT_REGISTRY[network];
        let contractData = registry_1.registry[network][address];
        let contractRegistry = new ethers_1.Contract(address, contractData.abi, provider);
        let contracts = yield contractRegistry.getAllContracts();
        let result = Array();
        for (let i = 0; i < contracts[0].length; i++) {
            result.push({
                address: contracts[1][i].toLowerCase(),
                name: contracts[0][i]
            });
        }
        return result;
    });
}
exports.getFlareNetworkContracts = getFlareNetworkContracts;
function isFlareNetworkContract(network, address) {
    return __awaiter(this, void 0, void 0, function* () {
        let contracts = yield getFlareNetworkContracts(network);
        return contracts.filter(c => c.address === address).length > 0;
    });
}
exports.isFlareNetworkContract = isFlareNetworkContract;
function getRawTransaction(network, txId) {
    return __awaiter(this, void 0, void 0, function* () {
        let provider = _getProvider(network);
        let txResponse = yield provider.getTransaction(txId);
        if (txResponse) {
            let tx = ethers_1.Transaction.from(txResponse.toJSON());
            return tx.unsignedSerialized;
        }
        else {
            return null;
        }
    });
}
exports.getRawTransaction = getRawTransaction;
function _getProvider(network) {
    return new ethers_1.JsonRpcProvider(settings.RPC[network]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZXZtL2NvbnRyYWN0L2NoYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQXFDO0FBQ3JDLHlEQUEwQztBQUMxQyxtQ0FBZ0U7QUFHaEUsU0FBc0Isd0JBQXdCLENBQzFDLE9BQWU7O1FBRWYsSUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3BDLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN2RCxJQUFJLFlBQVksR0FBRyxtQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzdDLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxpQkFBUSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQ3hFLElBQUksU0FBUyxHQUFHLE1BQU0sZ0JBQWdCLENBQUMsZUFBZSxFQUFFLENBQUE7UUFDeEQsSUFBSSxNQUFNLEdBQUcsS0FBSyxFQUFvQixDQUFBO1FBQ3RDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDUixPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRTtnQkFDdEMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDeEIsQ0FBQyxDQUFBO1FBQ04sQ0FBQztRQUNELE9BQU8sTUFBTSxDQUFBO0lBQ2pCLENBQUM7Q0FBQTtBQWhCRCw0REFnQkM7QUFFRCxTQUFzQixzQkFBc0IsQ0FDeEMsT0FBZSxFQUNmLE9BQWU7O1FBRWYsSUFBSSxTQUFTLEdBQUcsTUFBTSx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN2RCxPQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7SUFDbEUsQ0FBQztDQUFBO0FBTkQsd0RBTUM7QUFFRCxTQUFzQixpQkFBaUIsQ0FDbkMsT0FBZSxFQUNmLElBQVk7O1FBRVosSUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3BDLElBQUksVUFBVSxHQUFHLE1BQU0sUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNwRCxJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQ2IsSUFBSSxFQUFFLEdBQUcsb0JBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7WUFDL0MsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQUE7UUFDaEMsQ0FBQzthQUFNLENBQUM7WUFDSixPQUFPLElBQUksQ0FBQTtRQUNmLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFaRCw4Q0FZQztBQUVELFNBQVMsWUFBWSxDQUFDLE9BQWU7SUFDakMsT0FBTyxJQUFJLHdCQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0FBQ3JELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZWdpc3RyeSB9IGZyb20gXCIuL3JlZ2lzdHJ5XCJcbmltcG9ydCAqIGFzIHNldHRpbmdzIGZyb20gXCIuLi8uLi9zZXR0aW5nc1wiXG5pbXBvcnQgeyBDb250cmFjdCwgSnNvblJwY1Byb3ZpZGVyLCBUcmFuc2FjdGlvbiB9IGZyb20gXCJldGhlcnNcIjtcbmltcG9ydCB7IEJhc2VDb250cmFjdERhdGEgfSBmcm9tIFwiLi9pbnRlcmZhY2VcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEZsYXJlTmV0d29ya0NvbnRyYWN0cyhcbiAgICBuZXR3b3JrOiBudW1iZXJcbik6IFByb21pc2U8QXJyYXk8QmFzZUNvbnRyYWN0RGF0YT4+IHtcbiAgICBsZXQgcHJvdmlkZXIgPSBfZ2V0UHJvdmlkZXIobmV0d29yaylcbiAgICBsZXQgYWRkcmVzcyA9IHNldHRpbmdzLkZMQVJFX0NPTlRSQUNUX1JFR0lTVFJZW25ldHdvcmtdXG4gICAgbGV0IGNvbnRyYWN0RGF0YSA9IHJlZ2lzdHJ5W25ldHdvcmtdW2FkZHJlc3NdXG4gICAgbGV0IGNvbnRyYWN0UmVnaXN0cnkgPSBuZXcgQ29udHJhY3QoYWRkcmVzcywgY29udHJhY3REYXRhLmFiaSwgcHJvdmlkZXIpXG4gICAgbGV0IGNvbnRyYWN0cyA9IGF3YWl0IGNvbnRyYWN0UmVnaXN0cnkuZ2V0QWxsQ29udHJhY3RzKClcbiAgICBsZXQgcmVzdWx0ID0gQXJyYXk8QmFzZUNvbnRyYWN0RGF0YT4oKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29udHJhY3RzWzBdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgIGFkZHJlc3M6IGNvbnRyYWN0c1sxXVtpXS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgbmFtZTogY29udHJhY3RzWzBdW2ldXG4gICAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlzRmxhcmVOZXR3b3JrQ29udHJhY3QoXG4gICAgbmV0d29yazogbnVtYmVyLFxuICAgIGFkZHJlc3M6IHN0cmluZ1xuKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgbGV0IGNvbnRyYWN0cyA9IGF3YWl0IGdldEZsYXJlTmV0d29ya0NvbnRyYWN0cyhuZXR3b3JrKVxuICAgIHJldHVybiBjb250cmFjdHMuZmlsdGVyKGMgPT4gYy5hZGRyZXNzID09PSBhZGRyZXNzKS5sZW5ndGggPiAwXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRSYXdUcmFuc2FjdGlvbihcbiAgICBuZXR3b3JrOiBudW1iZXIsXG4gICAgdHhJZDogc3RyaW5nXG4pOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICBsZXQgcHJvdmlkZXIgPSBfZ2V0UHJvdmlkZXIobmV0d29yaylcbiAgICBsZXQgdHhSZXNwb25zZSA9IGF3YWl0IHByb3ZpZGVyLmdldFRyYW5zYWN0aW9uKHR4SWQpXG4gICAgaWYgKHR4UmVzcG9uc2UpIHtcbiAgICAgICAgbGV0IHR4ID0gVHJhbnNhY3Rpb24uZnJvbSh0eFJlc3BvbnNlIS50b0pTT04oKSlcbiAgICAgICAgcmV0dXJuIHR4LnVuc2lnbmVkU2VyaWFsaXplZFxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxufVxuXG5mdW5jdGlvbiBfZ2V0UHJvdmlkZXIobmV0d29yazogbnVtYmVyKTogSnNvblJwY1Byb3ZpZGVyIHtcbiAgICByZXR1cm4gbmV3IEpzb25ScGNQcm92aWRlcihzZXR0aW5ncy5SUENbbmV0d29ya10pXG59Il19