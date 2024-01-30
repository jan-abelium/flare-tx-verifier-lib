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
exports.verify = void 0;
const txnetwork = __importStar(require("../txnetwork"));
const txtype = __importStar(require("../txtype"));
const utils = __importStar(require("../utils"));
const warning = __importStar(require("../warning"));
const ethers_1 = require("ethers");
const contract_1 = require("./contract");
function verify(txHex) {
    return __awaiter(this, void 0, void 0, function* () {
        let tx;
        try {
            tx = ethers_1.Transaction.from(utils.toHex(txHex, true));
            let warnings = new Set();
            let network = _getNetwork(tx, warnings);
            let type = _getType(tx);
            let description = txtype.getDescription(type);
            let recipient = _getRecipient(tx);
            let value = _getValue(tx);
            let fee = _getMaxFee(tx, warnings);
            let contract = yield _getContract(tx);
            let messageToSign = tx.unsignedHash;
            return Object.assign(Object.assign({ network,
                type,
                description, recipients: [recipient], values: [value], fee }, contract), { warnings: Array.from(warnings.values()), messageToSign });
        }
        catch (_a) {
            return null;
        }
    });
}
exports.verify = verify;
function _getNetwork(tx, warnings) {
    let chainId = Number(tx.chainId);
    if (!txnetwork.isKnownNetwork(chainId)) {
        warnings.add(warning.UNKOWN_NETWORK);
    }
    return txnetwork.getDescription(chainId);
}
function _getType(tx) {
    if (utils.isZeroHex(tx.data)) {
        return txtype.TRANSFER_C;
    }
    else {
        return txtype.CONTRACT_CALL_C;
    }
}
function _getRecipient(tx) {
    return tx.to ? tx.to.toLowerCase() : "";
}
function _getValue(tx) {
    return tx.value.toString();
}
function _getMaxFee(tx, warnings) {
    let maxFee = BigInt(0);
    if (tx.gasPrice) {
        maxFee = tx.gasLimit * tx.gasPrice;
    }
    else if (tx.maxFeePerGas) {
        maxFee = tx.gasLimit * tx.maxFeePerGas;
    }
    if (maxFee === BigInt(0)) {
        warnings.add(warning.FEE_NOT_SET);
        return undefined;
    }
    else {
        return maxFee.toString();
    }
}
function _getContract(tx) {
    return __awaiter(this, void 0, void 0, function* () {
        if (_getType(tx) !== txtype.CONTRACT_CALL_C) {
            return {};
        }
        let contractName = undefined;
        let contractMethod = undefined;
        let contractData = undefined;
        let isFlareNetworkContract = undefined;
        let parameters = undefined;
        let chainId = Number(tx.chainId);
        contractData = tx.data;
        if (tx.to != null) {
            let contract = yield (0, contract_1.getContractData)(chainId, tx.to);
            if (contract) {
                contractName = contract.name;
                isFlareNetworkContract = contract.isFlareNetworkContract;
                let txData = { data: tx.data, value: tx.value };
                let description = contract.interface.parseTransaction(txData);
                if (description) {
                    contractMethod = description.name;
                    let inputs = description.fragment.inputs;
                    parameters = Array();
                    for (let i = 0; i < inputs.length; i++) {
                        parameters.push({
                            name: inputs[i].name,
                            value: description.args[i].toString()
                        });
                    }
                }
            }
            else {
                isFlareNetworkContract = yield (0, contract_1.isFlareContract)(chainId, tx.to);
            }
        }
        return {
            contractName,
            contractMethod,
            contractData,
            isFlareNetworkContract,
            parameters
        };
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXZtL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsd0RBQXlDO0FBQ3pDLGtEQUFtQztBQUNuQyxnREFBaUM7QUFDakMsb0RBQXFDO0FBQ3JDLG1DQUFxQztBQUNyQyx5Q0FBOEQ7QUFHOUQsU0FBc0IsTUFBTSxDQUFDLEtBQWE7O1FBQ3RDLElBQUksRUFBZSxDQUFBO1FBQ25CLElBQUksQ0FBQztZQUNELEVBQUUsR0FBRyxvQkFBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFBO1lBRS9DLElBQUksUUFBUSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUE7WUFFaEMsSUFBSSxPQUFPLEdBQUcsV0FBVyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQTtZQUN2QyxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDdkIsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUM3QyxJQUFJLFNBQVMsR0FBRyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDakMsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3pCLElBQUksR0FBRyxHQUFHLFVBQVUsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUE7WUFDbEMsSUFBSSxRQUFRLEdBQUcsTUFBTSxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDckMsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQTtZQUVuQyxxQ0FDSSxPQUFPO2dCQUNQLElBQUk7Z0JBQ0osV0FBVyxFQUNYLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUN2QixNQUFNLEVBQUUsQ0FB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QTtJQUNMLENBQUM7Q0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHR4bmV0d29yayBmcm9tIFwiLi4vdHhuZXR3b3JrXCJcbmltcG9ydCAqIGFzIHR4dHlwZSBmcm9tIFwiLi4vdHh0eXBlXCJcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gXCIuLi91dGlsc1wiXG5pbXBvcnQgKiBhcyB3YXJuaW5nIGZyb20gXCIuLi93YXJuaW5nXCJcbmltcG9ydCB7IFRyYW5zYWN0aW9uIH0gZnJvbSBcImV0aGVyc1wiO1xuaW1wb3J0IHsgZ2V0Q29udHJhY3REYXRhLCBpc0ZsYXJlQ29udHJhY3QgfSBmcm9tIFwiLi9jb250cmFjdFwiO1xuaW1wb3J0IHsgVHhWZXJpZmljYXRpb24sIFR4VmVyaWZpY2F0aW9uUGFyYW1ldGVyIH0gZnJvbSBcIi4uL2ludGVyZmFjZVwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdmVyaWZ5KHR4SGV4OiBzdHJpbmcpOiBQcm9taXNlPFR4VmVyaWZpY2F0aW9uIHwgbnVsbD4ge1xuICAgIGxldCB0eDogVHJhbnNhY3Rpb25cbiAgICB0cnkge1xuICAgICAgICB0eCA9IFRyYW5zYWN0aW9uLmZyb20odXRpbHMudG9IZXgodHhIZXgsIHRydWUpKVxuXG4gICAgICAgIGxldCB3YXJuaW5ncyA9IG5ldyBTZXQ8c3RyaW5nPigpXG5cbiAgICAgICAgbGV0IG5ldHdvcmsgPSBfZ2V0TmV0d29yayh0eCwgd2FybmluZ3MpXG4gICAgICAgIGxldCB0eXBlID0gX2dldFR5cGUodHgpXG4gICAgICAgIGxldCBkZXNjcmlwdGlvbiA9IHR4dHlwZS5nZXREZXNjcmlwdGlvbih0eXBlKVxuICAgICAgICBsZXQgcmVjaXBpZW50ID0gX2dldFJlY2lwaWVudCh0eClcbiAgICAgICAgbGV0IHZhbHVlID0gX2dldFZhbHVlKHR4KVxuICAgICAgICBsZXQgZmVlID0gX2dldE1heEZlZSh0eCwgd2FybmluZ3MpXG4gICAgICAgIGxldCBjb250cmFjdCA9IGF3YWl0IF9nZXRDb250cmFjdCh0eClcbiAgICAgICAgbGV0IG1lc3NhZ2VUb1NpZ24gPSB0eC51bnNpZ25lZEhhc2hcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmV0d29yayxcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHJlY2lwaWVudHM6IFtyZWNpcGllbnRdLFxuICAgICAgICAgICAgdmFsdWVzOiBbdmFsdWVdLFxuICAgICAgICAgICAgZmVlLFxuICAgICAgICAgICAgLi4uY29udHJhY3QsXG4gICAgICAgICAgICB3YXJuaW5nczogQXJyYXkuZnJvbSh3YXJuaW5ncy52YWx1ZXMoKSksXG4gICAgICAgICAgICBtZXNzYWdlVG9TaWduXG4gICAgICAgIH1cbiAgICB9IGNhdGNoIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG59XG5cbmZ1bmN0aW9uIF9nZXROZXR3b3JrKHR4OiBUcmFuc2FjdGlvbiwgd2FybmluZ3M6IFNldDxzdHJpbmc+KTogc3RyaW5nIHtcbiAgICBsZXQgY2hhaW5JZCA9IE51bWJlcih0eC5jaGFpbklkKVxuICAgIGlmICghdHhuZXR3b3JrLmlzS25vd25OZXR3b3JrKGNoYWluSWQpKSB7XG4gICAgICAgIHdhcm5pbmdzLmFkZCh3YXJuaW5nLlVOS09XTl9ORVRXT1JLKVxuICAgIH1cbiAgICByZXR1cm4gdHhuZXR3b3JrLmdldERlc2NyaXB0aW9uKGNoYWluSWQpXG59XG5cbmZ1bmN0aW9uIF9nZXRUeXBlKHR4OiBUcmFuc2FjdGlvbik6IHN0cmluZyB7XG4gICAgaWYgKHV0aWxzLmlzWmVyb0hleCh0eC5kYXRhKSkge1xuICAgICAgICByZXR1cm4gdHh0eXBlLlRSQU5TRkVSX0NcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHh0eXBlLkNPTlRSQUNUX0NBTExfQ1xuICAgIH1cbn1cblxuZnVuY3Rpb24gX2dldFJlY2lwaWVudCh0eDogVHJhbnNhY3Rpb24pOiBzdHJpbmcge1xuICAgIHJldHVybiB0eC50byA/IHR4LnRvLnRvTG93ZXJDYXNlKCkgOiBcIlwiXG59XG5cbmZ1bmN0aW9uIF9nZXRWYWx1ZSh0eDogVHJhbnNhY3Rpb24pOiBzdHJpbmcge1xuICAgIHJldHVybiB0eC52YWx1ZS50b1N0cmluZygpXG59XG5cbmZ1bmN0aW9uIF9nZXRNYXhGZWUodHg6IFRyYW5zYWN0aW9uLCB3YXJuaW5nczogU2V0PHN0cmluZz4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGxldCBtYXhGZWUgPSBCaWdJbnQoMClcbiAgICBpZiAodHguZ2FzUHJpY2UpIHtcbiAgICAgICAgbWF4RmVlID0gdHguZ2FzTGltaXQgKiB0eC5nYXNQcmljZVxuICAgIH0gZWxzZSBpZiAodHgubWF4RmVlUGVyR2FzKSB7XG4gICAgICAgIG1heEZlZSA9IHR4Lmdhc0xpbWl0ICogdHgubWF4RmVlUGVyR2FzXG4gICAgfVxuICAgIGlmIChtYXhGZWUgPT09IEJpZ0ludCgwKSkge1xuICAgICAgICB3YXJuaW5ncy5hZGQod2FybmluZy5GRUVfTk9UX1NFVClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBtYXhGZWUudG9TdHJpbmcoKVxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gX2dldENvbnRyYWN0KHR4OiBUcmFuc2FjdGlvbik6IFByb21pc2U8YW55PiB7XG4gICAgaWYgKF9nZXRUeXBlKHR4KSAhPT0gdHh0eXBlLkNPTlRSQUNUX0NBTExfQykge1xuICAgICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICBsZXQgY29udHJhY3ROYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcbiAgICBsZXQgY29udHJhY3RNZXRob2Q6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuICAgIGxldCBjb250cmFjdERhdGE6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuICAgIGxldCBpc0ZsYXJlTmV0d29ya0NvbnRyYWN0OiBib29sZWFuIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG4gICAgbGV0IHBhcmFtZXRlcnM6IEFycmF5PFR4VmVyaWZpY2F0aW9uUGFyYW1ldGVyPiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuXG4gICAgbGV0IGNoYWluSWQgPSBOdW1iZXIodHguY2hhaW5JZClcblxuICAgIGNvbnRyYWN0RGF0YSA9IHR4LmRhdGFcbiAgICBpZiAodHgudG8gIT0gbnVsbCkgeyAgICAgICAgXG4gICAgICAgIGxldCBjb250cmFjdCA9IGF3YWl0IGdldENvbnRyYWN0RGF0YShjaGFpbklkLCB0eC50byEpXG4gICAgICAgIGlmIChjb250cmFjdCkge1xuICAgICAgICAgICAgY29udHJhY3ROYW1lID0gY29udHJhY3QubmFtZVxuICAgICAgICAgICAgaXNGbGFyZU5ldHdvcmtDb250cmFjdCA9IGNvbnRyYWN0LmlzRmxhcmVOZXR3b3JrQ29udHJhY3RcbiAgICAgICAgICAgIGxldCB0eERhdGEgPSB7IGRhdGE6IHR4LmRhdGEsIHZhbHVlOiB0eC52YWx1ZSB9XG4gICAgICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSBjb250cmFjdC5pbnRlcmZhY2UucGFyc2VUcmFuc2FjdGlvbih0eERhdGEpXG4gICAgICAgICAgICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgICAgICBjb250cmFjdE1ldGhvZCA9IGRlc2NyaXB0aW9uLm5hbWVcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRzID0gZGVzY3JpcHRpb24uZnJhZ21lbnQuaW5wdXRzXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVycyA9IEFycmF5PFR4VmVyaWZpY2F0aW9uUGFyYW1ldGVyPigpXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGlucHV0c1tpXS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGRlc2NyaXB0aW9uLmFyZ3NbaV0udG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlzRmxhcmVOZXR3b3JrQ29udHJhY3QgPSBhd2FpdCBpc0ZsYXJlQ29udHJhY3QoY2hhaW5JZCwgdHgudG8hKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29udHJhY3ROYW1lLFxuICAgICAgICBjb250cmFjdE1ldGhvZCxcbiAgICAgICAgY29udHJhY3REYXRhLFxuICAgICAgICBpc0ZsYXJlTmV0d29ya0NvbnRyYWN0LFxuICAgICAgICBwYXJhbWV0ZXJzXG4gICAgfVxufSJdfQ==