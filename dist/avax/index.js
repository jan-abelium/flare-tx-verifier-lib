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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = void 0;
const txnetwork = __importStar(require("../txnetwork"));
const txtype = __importStar(require("../txtype"));
const settings = __importStar(require("../settings"));
const utils = __importStar(require("../utils"));
const warning = __importStar(require("../warning"));
const flarejs_1 = __importStar(require("@flarenetwork/flarejs"));
const evm_1 = require("@flarenetwork/flarejs/dist/apis/evm");
const platformvm_1 = require("@flarenetwork/flarejs/dist/apis/platformvm");
const bintools_1 = __importDefault(require("@flarenetwork/flarejs/dist/utils/bintools"));
const bech32_1 = require("bech32");
const ethers_1 = require("ethers");
const utils_1 = require("@flarenetwork/flarejs/dist/utils");
const bintools = bintools_1.default.getInstance();
function verify(txHex) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!utils.isHex(txHex)) {
            return null;
        }
        txHex = utils.toHex(txHex, false);
        let ctx = _tryRecoverCTx(txHex);
        if (ctx != null) {
            return yield _tryGetCTxParams(ctx);
        }
        let ptx = _tryRecoverPTx(txHex);
        if (ptx != null) {
            return yield _tryGetPTxParams(ptx);
        }
        return null;
    });
}
exports.verify = verify;
function _tryRecoverCTx(txHex) {
    try {
        let tx = new evm_1.UnsignedTx();
        tx.fromBuffer(Buffer.from(txHex, "hex"));
        return tx;
    }
    catch (_a) {
        return null;
    }
}
function _tryRecoverPTx(txHex) {
    try {
        let tx = new platformvm_1.UnsignedTx();
        tx.fromBuffer(Buffer.from(txHex, "hex"));
        return tx;
    }
    catch (_a) {
        return null;
    }
}
function _getMessageToSign(tx) {
    try {
        let signatureRequests = tx.prepareUnsignedHashes(undefined);
        if (signatureRequests.length > 0) {
            return utils.toHex(signatureRequests[0].message, true);
        }
        else {
            let txBuffer = Buffer.from(tx.toBuffer().toString("hex"), "hex");
            return utils.toHex((0, ethers_1.sha256)(txBuffer), true);
        }
    }
    catch (_a) {
        throw new Error("Failed to recover message to sign");
    }
}
function _getNetwork(networkId, warnings) {
    if (!txnetwork.isKnownNetwork(networkId)) {
        warnings.add(warning.UNKOWN_NETWORK);
    }
    return txnetwork.getDescription(networkId);
}
function _tryGetCTxParams(tx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let btx = tx.getTransaction();
            let warnings = new Set();
            _checkCBlockchainId(btx.getNetworkID(), btx.getBlockchainID().toString("hex"), warnings);
            let network = _getNetwork(btx.getNetworkID(), warnings);
            let txType = btx.getTypeName();
            let type;
            let params;
            if (txType === "ExportTx") {
                type = txtype.EXPORT_C;
                params = _getExportCTxParams(btx, warnings);
            }
            else if (txType === "ImportTx") {
                type = txtype.IMPORT_C;
                params = _getImportCTxParams(btx, warnings);
            }
            else {
                throw new Error("Unkown C-chain transaction type");
            }
            let description = txtype.getDescription(type);
            let messageToSign = _getMessageToSign(tx);
            return Object.assign(Object.assign({ network,
                type,
                description }, params), { warnings: Array.from(warnings.values()), messageToSign });
        }
        catch (_a) {
            return null;
        }
    });
}
function _getExportCTxParams(tx, warnings) {
    let networkId = tx.getNetworkID();
    _checkPBlockchainId(networkId, tx.getDestinationChain().toString("hex"), warnings);
    let inputs = tx.getInputs();
    let inputAmount = new flarejs_1.BN(0);
    for (let i = 0; i < inputs.length; i++) {
        inputAmount = inputAmount.add(_getAmountFromEVMOutput(inputs[i]));
        _checkPAssetId(networkId, inputs[i].getAssetID().toString("hex"), warnings);
    }
    let outputs = tx.getExportedOutputs();
    let exportAmounts = new Array();
    let exportRecipients = new Array();
    for (let i = 0; i < outputs.length; i++) {
        let output = outputs[i].getOutput();
        let addresses = output.getAddresses();
        if (addresses.length > 1) {
            warnings.add(warning.MULTIPLE_SIGNERS);
        }
        let address = _addressesToString(addresses, true, networkId);
        let index = exportRecipients.indexOf(address);
        if (index < 0) {
            exportRecipients.push(address);
            exportAmounts.push(output.getAmount());
        }
        else {
            exportAmounts[index] = exportAmounts[index].add(output.getAmount());
        }
        _checkOutputLockTime(output.getLocktime(), warnings);
        _checkPAssetId(networkId, outputs[i].getAssetID().toString("hex"), warnings);
    }
    if (exportRecipients.length > 1) {
        warnings.add(warning.MULTIPLE_RECIPIENTS);
    }
    let fee = inputAmount.sub(_sumValues(exportAmounts));
    return {
        recipients: exportRecipients,
        values: exportAmounts.map(a => _gweiToWei(a).toString()),
        fee: _gweiToWei(fee).toString()
    };
}
function _getImportCTxParams(tx, warnings) {
    let networkId = tx.getNetworkID();
    _checkPBlockchainId(networkId, tx.getSourceChain().toString("hex"), warnings);
    let inputs = tx.getImportInputs();
    let inputAmount = new flarejs_1.BN(0);
    for (let i = 0; i < inputs.length; i++) {
        inputAmount = inputAmount.add(inputs[i].getInput().getAmount());
        _checkPAssetId(networkId, inputs[i].getAssetID().toString("hex"), warnings);
    }
    let outputs = tx.getOuts();
    let importAmounts = new Array();
    let importRecipients = new Array();
    for (let i = 0; i < outputs.length; i++) {
        let output = outputs[i];
        let amount = _getAmountFromEVMOutput(output);
        let address = utils.toHex(output.getAddressString().toLowerCase(), true);
        let index = importRecipients.indexOf(address);
        if (index < 0) {
            importRecipients.push(address);
            importAmounts.push(amount);
        }
        else {
            importAmounts[index] = importAmounts[index].add(amount);
        }
        _checkPAssetId(networkId, output.getAssetID().toString("hex"), warnings);
    }
    let fee = inputAmount.sub(_sumValues(importAmounts));
    return {
        recipients: importRecipients,
        values: importAmounts.map(a => _gweiToWei(a).toString()),
        fee: _gweiToWei(fee).toString()
    };
}
function _getAmountFromEVMOutput(output) {
    let outputBuffer = output.toBuffer();
    return new flarejs_1.BN(bintools.copyFrom(outputBuffer, 20, 28));
}
function _tryGetPTxParams(tx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let btx = tx.getTransaction();
            let warnings = new Set();
            _checkPBlockchainId(btx.getNetworkID(), btx.getBlockchainID().toString("hex"), warnings);
            let network = _getNetwork(btx.getNetworkID(), warnings);
            let txType = btx.getTypeName();
            let type;
            let params;
            if (txType === "AddDelegatorTx") {
                type = txtype.ADD_DELEGATOR_P;
                params = yield _getAddDelegatorParams(btx, warnings);
            }
            else if (txType === "AddValidatorTx") {
                type = txtype.ADD_VALIDATOR_P;
                params = yield _getAddValidatorParams(btx, warnings);
            }
            else if (txType === "ExportTx") {
                type = txtype.EXPORT_P;
                params = yield _getExportPTx(btx, warnings);
            }
            else if (txType === "ImportTx") {
                type = txtype.IMPORT_P;
                params = yield _getImportPTx(btx, warnings);
            }
            else {
                throw new Error("Unkown P-chain transaction type");
            }
            let description = txtype.getDescription(type);
            let messageToSign = _getMessageToSign(tx);
            return Object.assign(Object.assign({ network,
                type,
                description }, params), { warnings: Array.from(warnings.values()), messageToSign });
        }
        catch (_a) {
            return null;
        }
    });
}
function _getAddDelegatorParams(tx, warnings) {
    return __awaiter(this, void 0, void 0, function* () {
        return _getStakeTxData(tx, warnings);
    });
}
function _getAddValidatorParams(tx, warnings) {
    return __awaiter(this, void 0, void 0, function* () {
        return _getStakeTxData(tx, warnings);
    });
}
function _getStakeTxData(tx, warnings) {
    return __awaiter(this, void 0, void 0, function* () {
        let [recipients, receivedAmounts] = _getPOutputsData(tx.getNetworkID(), tx.getOuts(), warnings);
        let sentAmount = yield _getPInputsData(tx.getNetworkID(), tx.getIns(), recipients.length == 1 && !recipients[0].includes(",") ? recipients[0] : undefined, undefined, warnings);
        let stakeAmount = tx.getStakeAmount();
        let fee = sentAmount.sub(_sumValues(receivedAmounts)).sub(stakeAmount);
        let [stakeoutRecipients, stakeoutAmounts] = _getPOutputsData(tx.getNetworkID(), tx.getStakeOuts(), warnings);
        _compareRecipients(stakeoutRecipients, recipients, warnings);
        if (tx instanceof platformvm_1.AddDelegatorTx) {
            yield _checkNodeId(tx, warnings);
        }
        let parameters = new Array();
        parameters.push({
            name: "nodeId",
            value: tx.getNodeIDString()
        });
        parameters.push({
            name: "startTime",
            value: tx.getStartTime().toString()
        });
        parameters.push({
            name: "endTime",
            value: tx.getEndTime().toString()
        });
        if (tx instanceof platformvm_1.AddValidatorTx) {
            parameters.push({
                name: "delegationFee",
                value: tx.getDelegationFee().toString()
            });
        }
        return {
            recipients: stakeoutRecipients,
            values: stakeoutAmounts.map(a => _gweiToWei(a).toString()),
            fee: _gweiToWei(fee).toString(),
            parameters
        };
    });
}
function _getExportPTx(tx, warnings) {
    return __awaiter(this, void 0, void 0, function* () {
        let networkId = tx.getNetworkID();
        _checkCBlockchainId(networkId, tx.getDestinationChain().toString("hex"), warnings);
        let [utxoRecipients, utxoReceivedAmounts] = _getPOutputsData(networkId, tx.getOuts(), warnings);
        let [exportRecipients, exportAmounts] = _getPOutputsData(networkId, tx.getExportOutputs(), warnings);
        _compareRecipients(exportRecipients, utxoRecipients, warnings);
        let utxoSentAmount = yield _getPInputsData(networkId, tx.getIns(), exportRecipients.length == 1 && !exportRecipients.includes(",") ? exportRecipients[0] : undefined, undefined, warnings);
        let fee = utxoSentAmount.sub(_sumValues(utxoReceivedAmounts)).sub(_sumValues(exportAmounts));
        return {
            recipients: exportRecipients,
            values: exportAmounts.map(a => _gweiToWei(a).toString()),
            fee: _gweiToWei(fee).toString()
        };
    });
}
function _getImportPTx(tx, warnings) {
    return __awaiter(this, void 0, void 0, function* () {
        let networkId = tx.getNetworkID();
        _checkCBlockchainId(networkId, tx.getSourceChain().toString("hex"), warnings);
        let [recipients, receivedAmounts] = _getPOutputsData(tx.getNetworkID(), tx.getOuts(), warnings);
        let sentAmount = yield _getPInputsData(networkId, tx.getIns(), recipients.length == 1 && !recipients[0].includes(",") ? recipients[0] : undefined, _getCBlockchainId(networkId), warnings);
        let importAmount = yield _getPInputsData(networkId, tx.getImportInputs(), recipients.length == 1 && !recipients[0].includes(",") ? recipients[0] : undefined, _getCBlockchainId(networkId), warnings);
        let fee = importAmount.add(sentAmount).sub(_sumValues(receivedAmounts));
        return {
            recipients,
            values: receivedAmounts.map(a => _gweiToWei(a).toString()),
            fee: _gweiToWei(fee).toString()
        };
    });
}
function _getPInputsData(networkId, inputs, address, blockchainId, warnings) {
    return __awaiter(this, void 0, void 0, function* () {
        let utxos = address ? (yield _getPUTXOs(networkId, address, blockchainId)) : new Array();
        let sentAmount = new flarejs_1.BN(0);
        for (let input of inputs) {
            let ai = input.getInput();
            sentAmount = sentAmount.add(ai.getAmount());
            _checkPAssetId(networkId, input.getAssetID().toString("hex"), warnings);
            if (address) {
                let txId = input.getTxID().toString("hex");
                let outputIdx = parseInt(input.getOutputIdx().toString("hex"), 16);
                if (!utxos.find(u => u.txId === txId && u.outputIdx === outputIdx)) {
                    warnings.add(warning.FUNDS_NOT_RETURNED);
                }
            }
        }
        return sentAmount;
    });
}
function _getPOutputsData(networkId, outputs, warnings) {
    let recipients = new Array();
    let receivedAmounts = new Array();
    for (let output of outputs) {
        let ao = output.getOutput();
        let addresses = ao.getAddresses();
        if (addresses.length != 1) {
            warnings.add(warning.MULTIPLE_SIGNERS);
        }
        let address = _addressesToString(addresses, true, networkId);
        let index = recipients.indexOf(address);
        if (index < 0) {
            recipients.push(address);
            receivedAmounts.push(ao.getAmount());
        }
        else {
            receivedAmounts[index] = receivedAmounts[index].add(ao.getAmount());
        }
        _checkOutputLockTime(ao.getLocktime(), warnings);
        _checkPAssetId(networkId, output.getAssetID().toString("hex"), warnings);
    }
    if (recipients.length > 1) {
        warnings.add(warning.MULTIPLE_RECIPIENTS);
    }
    return [recipients, receivedAmounts];
}
function _getPUTXOs(networkId, address, blockchainId) {
    return __awaiter(this, void 0, void 0, function* () {
        let avalanche = _getAvalanche(networkId);
        let utxos = (yield avalanche.PChain().getUTXOs(`P-${address}`, blockchainId)).utxos;
        return utxos.getAllUTXOs().map(u => {
            return {
                txId: u.getTxID().toString("hex"),
                outputIdx: parseInt(u.getOutputIdx().toString("hex"), 16)
            };
        });
    });
}
function _checkNodeId(tx, warnings) {
    return __awaiter(this, void 0, void 0, function* () {
        let avalanche = _getAvalanche(tx.getNetworkID());
        let stakes = new Array;
        let cvalidators = yield avalanche.PChain().getCurrentValidators();
        if (cvalidators && cvalidators.validators) {
            let cstakes = cvalidators.validators;
            if (cstakes) {
                stakes = stakes.concat(cstakes);
            }
        }
        let pvalidators = yield avalanche.PChain().getPendingValidators();
        if (pvalidators && pvalidators.validators) {
            let pstakes = pvalidators.validators;
            if (pstakes) {
                stakes = stakes.concat(pstakes);
            }
        }
        let nodeIds = new Set();
        for (let stake of stakes) {
            if (stake.nodeID) {
                nodeIds.add(stake.nodeID);
            }
        }
        if (!nodeIds.has(tx.getNodeIDString())) {
            warnings.add(warning.UNKNOWN_NODEID);
        }
    });
}
function _getAvalanche(networkId) {
    let url = new URL(settings.RPC[networkId]);
    let avalanche = new flarejs_1.default(url.hostname, url.port ? parseInt(url.port) : undefined, url.protocol, networkId);
    return avalanche;
}
function _addressesToString(addresses, toBech, networkId) {
    let items = new Array(addresses.length);
    for (let i = 0; i < addresses.length; i++) {
        let address = addresses[i].toString("hex");
        if (toBech) {
            items[i] = _addressToBech(networkId, address);
        }
        else {
            items[i] = utils.toHex(address, true);
        }
    }
    return items.sort().join(", ");
}
function _checkOutputLockTime(outputLockTime, warnings) {
    if (!outputLockTime.isZero()) {
        warnings.add(warning.FUNDS_LOCKED);
    }
}
function _checkCBlockchainId(networkId, blockchainId, warnings) {
    if (utils.isZeroHex(blockchainId)) {
        return;
    }
    let cBlockchainId = bintools.cb58Decode(_getCBlockchainId(networkId)).toString("hex");
    if (blockchainId !== cBlockchainId) {
        warnings.add(warning.INVALID_BLOCKCHAIN);
    }
}
function _getCBlockchainId(networkId) {
    return utils_1.Defaults.network[networkId].C.blockchainID;
}
function _checkPBlockchainId(networkId, blockchainId, warnings) {
    if (utils.isZeroHex(blockchainId)) {
        return;
    }
    let pBlockchainId = bintools.cb58Decode(_getPBlockchainId(networkId)).toString("hex");
    if (blockchainId !== pBlockchainId) {
        warnings.add(warning.INVALID_BLOCKCHAIN);
    }
}
function _getPBlockchainId(networkId) {
    return utils_1.Defaults.network[networkId].P.blockchainID;
}
function _checkPAssetId(networkId, assetId, warnings) {
    let pAssetId = bintools.cb58Decode(utils_1.Defaults.network[networkId].P.avaxAssetID).toString("hex");
    if (assetId !== pAssetId) {
        warnings.add(warning.INVALID_ASSET);
    }
}
function _compareRecipients(recipients, utxoRecipients, warnings) {
    if (recipients.length != 1) {
        return;
    }
    if (utxoRecipients.length == 0) {
        return;
    }
    if (utxoRecipients.length > 1 || utxoRecipients[0] !== recipients[0]) {
        warnings.add(warning.UNSPENT_AMOUNT_NOT_TO_RECIPIENT);
    }
}
function _sumValues(values) {
    return values.reduce((p, c) => p.add(c), new flarejs_1.BN(0));
}
function _addressToBech(networkId, addressHex) {
    return bech32_1.bech32.encode(txnetwork.getHRP(networkId), bech32_1.bech32.toWords(Buffer.from(addressHex, "hex")));
}
function _gweiToWei(gweiValue) {
    return gweiValue.mul(new flarejs_1.BN(1e9));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXZheC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdEQUF5QztBQUN6QyxrREFBbUM7QUFDbkMsc0RBQXVDO0FBQ3ZDLGdEQUFpQztBQUNqQyxvREFBcUM7QUFDckMsaUVBQXFEO0FBQ3JELDZEQU80QztBQUM1QywyRUFVbUQ7QUFDbkQseUZBQWdFO0FBQ2hFLG1DQUErQjtBQUMvQixtQ0FBK0I7QUFFL0IsNERBQTJEO0FBRTNELE1BQU0sUUFBUSxHQUFHLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFFdkMsU0FBc0IsTUFBTSxDQUFDLEtBQWE7O1FBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdEIsT0FBTyxJQUFJLENBQUE7UUFDZixDQUFDO1FBRUQsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBRWpDLElBQUksR0FBRyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQWdCLENBQUE7UUFDOUMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDZCxPQUFPLE1BQU0sZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDdEMsQ0FBQztRQUVELElBQUksR0FBRyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQWdCLENBQUE7UUFDOUMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDZCxPQUFPLE1BQU0sZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDdEMsQ0FBQztRQUVELE9BQU8sSUFBSSxDQUFBO0lBQ2YsQ0FBQztDQUFBO0FBbEJELHdCQWtCQztBQUVELFNBQVMsY0FBYyxDQUFDLEtBQWE7SUFDakMsSUFBSSxDQUFDO1FBQ0QsSUFBSSxFQUFF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UUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQTtJQUN6RCxDQUFDO0FBQ0wsQ0FBQztBQUVELFNBQVMsVUFBVSxDQUFDLE1BQWlCO0lBQ2pDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxZQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN2RCxDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsU0FBaUIsRUFBRSxVQUFrQjtJQUN6RCxPQUFPLGVBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxlQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNyRyxDQUFDO0FBRUQsU0FBUyxVQUFVLENBQUMsU0FBYTtJQUM3QixPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxZQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUNyQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdHhuZXR3b3JrIGZyb20gXCIuLi90eG5ldHdvcmtcIlxyXG5pbXBvcnQgKiBhcyB0eHR5cGUgZnJvbSBcIi4uL3R4dHlwZVwiXHJcbmltcG9ydCAqIGFzIHNldHRpbmdzIGZyb20gXCIuLi9zZXR0aW5nc1wiXHJcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gXCIuLi91dGlsc1wiXHJcbmltcG9ydCAqIGFzIHdhcm5pbmcgZnJvbSBcIi4uL3dhcm5pbmdcIlxyXG5pbXBvcnQgQXZhbGFuY2hlLCB7IEJOIH0gZnJvbSBcIkBmbGFyZW5ldHdvcmsvZmxhcmVqc1wiXHJcbmltcG9ydCB7XHJcbiAgICBBbW91bnRJbnB1dCBhcyBDQW1vdW50SW5wdXQsXHJcbiAgICBBbW91bnRPdXRwdXQgYXMgQ0Ftb3VudE91dHB1dCxcclxuICAgIEVWTU91dHB1dCxcclxuICAgIEV4cG9ydFR4IGFzIEV4cG9ydENUeCxcclxuICAgIEltcG9ydFR4IGFzIEltcG9ydENUeCxcclxuICAgIFVuc2lnbmVkVHggYXMgVW5zaWduZWRDVHhcclxufSBmcm9tIFwiQGZsYXJlbmV0d29yay9mbGFyZWpzL2Rpc3QvYXBpcy9ldm1cIlxyXG5pbXBvcnQge1xyXG4gICAgQWRkRGVsZWdhdG9yVHgsXHJcbiAgICBBZGRWYWxpZGF0b3JUeCxcclxuICAgIEFtb3VudElucHV0IGFzIFBBbW91bnRJbnB1dCxcclxuICAgIEFtb3VudE91dHB1dCBhcyBQQW1vdW50T3V0cHV0LFxyXG4gICAgRXhwb3J0VHggYXMgRXhwb3J0UFR4LFxyXG4gICAgSW1wb3J0VHggYXMgSW1wb3J0UFR4LFxyXG4gICAgVHJhbnNmZXJhYmxlSW5wdXQgYXMgUFRyYW5zZmVyYWJsZUlucHV0LFxyXG4gICAgVHJhbnNmZXJhYmxlT3V0cHV0IGFzIFBUcmFuc2ZlcmFibGVPdXRwdXQsXHJcbiAgICBVbnNpZ25lZFR4IGFzIFVuc2lnbmVkUFR4XHJcbn0gZnJvbSBcIkBmbGFyZW5ldHdvcmsvZmxhcmVqcy9kaXN0L2FwaXMvcGxhdGZvcm12bVwiXHJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiQGZsYXJlbmV0d29yay9mbGFyZWpzL2Rpc3QvdXRpbHMvYmludG9vbHNcIlxyXG5pbXBvcnQgeyBiZWNoMzIgfSBmcm9tIFwiYmVjaDMyXCJcclxuaW1wb3J0IHsgc2hhMjU2IH0gZnJvbSBcImV0aGVyc1wiXHJcbmltcG9ydCB7IFR4VmVyaWZpY2F0aW9uLCBUeFZlcmlmaWNhdGlvblBhcmFtZXRlciB9IGZyb20gXCIuLi9pbnRlcmZhY2VcIlxyXG5pbXBvcnQgeyBEZWZhdWx0cyB9IGZyb20gXCJAZmxhcmVuZXR3b3JrL2ZsYXJlanMvZGlzdC91dGlsc1wiXHJcblxyXG5jb25zdCBiaW50b29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB2ZXJpZnkodHhIZXg6IHN0cmluZyk6IFByb21pc2U8VHhWZXJpZmljYXRpb24gfCBudWxsPiB7XHJcbiAgICBpZiAoIXV0aWxzLmlzSGV4KHR4SGV4KSkge1xyXG4gICAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgdHhIZXggPSB1dGlscy50b0hleCh0eEhleCwgZmFsc2UpXHJcblxyXG4gICAgbGV0IGN0eCA9IF90cnlSZWNvdmVyQ1R4KHR4SGV4KSBhcyBVbnNpZ25lZENUeFxyXG4gICAgaWYgKGN0eCAhPSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IF90cnlHZXRDVHhQYXJhbXMoY3R4KVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBwdHggPSBfdHJ5UmVjb3ZlclBUeCh0eEhleCkgYXMgVW5zaWduZWRQVHhcclxuICAgIGlmIChwdHggIT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBhd2FpdCBfdHJ5R2V0UFR4UGFyYW1zKHB0eClcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbFxyXG59XHJcblxyXG5mdW5jdGlvbiBfdHJ5UmVjb3ZlckNUeCh0eEhleDogc3RyaW5nKTogVW5zaWduZWRDVHggfCBudWxsIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHR4ID0gbmV3IFVuc2lnbmVkQ1R4KClcclxuICAgICAgICB0eC5mcm9tQnVmZmVyKEJ1ZmZlci5mcm9tKHR4SGV4LCBcImhleFwiKSBhcyBhbnkpXHJcbiAgICAgICAgcmV0dXJuIHR4XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBfdHJ5UmVjb3ZlclBUeCh0eEhleDogc3RyaW5nKTogVW5zaWduZWRQVHggfCBudWxsIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHR4ID0gbmV3IFVuc2lnbmVkUFR4KClcclxuICAgICAgICB0eC5mcm9tQnVmZmVyKEJ1ZmZlci5mcm9tKHR4SGV4LCBcImhleFwiKSBhcyBhbnkpXHJcbiAgICAgICAgcmV0dXJuIHR4XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBfZ2V0TWVzc2FnZVRvU2lnbih0eDogVW5zaWduZWRDVHggfCBVbnNpZ25lZFBUeCk6IHN0cmluZyB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBzaWduYXR1cmVSZXF1ZXN0cyA9IHR4LnByZXBhcmVVbnNpZ25lZEhhc2hlcyh1bmRlZmluZWQgYXMgYW55KVxyXG4gICAgICAgIGlmIChzaWduYXR1cmVSZXF1ZXN0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1dGlscy50b0hleChzaWduYXR1cmVSZXF1ZXN0c1swXS5tZXNzYWdlLCB0cnVlKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB0eEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKHR4LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIiksIFwiaGV4XCIpXHJcbiAgICAgICAgICAgIHJldHVybiB1dGlscy50b0hleChzaGEyNTYodHhCdWZmZXIpLCB0cnVlKVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byByZWNvdmVyIG1lc3NhZ2UgdG8gc2lnblwiKVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBfZ2V0TmV0d29yayhuZXR3b3JrSWQ6IG51bWJlciwgd2FybmluZ3M6IFNldDxzdHJpbmc+KTogc3RyaW5nIHtcclxuICAgIGlmICghdHhuZXR3b3JrLmlzS25vd25OZXR3b3JrKG5ldHdvcmtJZCkpIHtcclxuICAgICAgICB3YXJuaW5ncy5hZGQod2FybmluZy5VTktPV05fTkVUV09SSylcclxuICAgIH1cclxuICAgIHJldHVybiB0eG5ldHdvcmsuZ2V0RGVzY3JpcHRpb24obmV0d29ya0lkKVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBfdHJ5R2V0Q1R4UGFyYW1zKHR4OiBVbnNpZ25lZENUeCk6IFByb21pc2U8VHhWZXJpZmljYXRpb24gfCBudWxsPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBidHggPSB0eC5nZXRUcmFuc2FjdGlvbigpXHJcblxyXG4gICAgICAgIGxldCB3YXJuaW5ncyA9IG5ldyBTZXQ8c3RyaW5nPigpXHJcblxyXG4gICAgICAgIF9jaGVja0NCbG9ja2NoYWluSWQoYnR4LmdldE5ldHdvcmtJRCgpLCBidHguZ2V0QmxvY2tjaGFpbklEKCkudG9TdHJpbmcoXCJoZXhcIiksIHdhcm5pbmdzKVxyXG5cclxuICAgICAgICBsZXQgbmV0d29yayA9IF9nZXROZXR3b3JrKGJ0eC5nZXROZXR3b3JrSUQoKSwgd2FybmluZ3MpXHJcbiAgICAgICAgbGV0IHR4VHlwZSA9IGJ0eC5nZXRUeXBlTmFtZSgpXHJcbiAgICAgICAgbGV0IHR5cGU6IHN0cmluZ1xyXG4gICAgICAgIGxldCBwYXJhbXM6IGFueVxyXG4gICAgICAgIGlmICh0eFR5cGUgPT09IFwiRXhwb3J0VHhcIikge1xyXG4gICAgICAgICAgICB0eXBlID0gdHh0eXBlLkVYUE9SVF9DXHJcbiAgICAgICAgICAgIHBhcmFtcyA9IF9nZXRFeHBvcnRDVHhQYXJhbXMoYnR4IGFzIEV4cG9ydENUeCwgd2FybmluZ3MpXHJcbiAgICAgICAgfSBlbHNlIGlmICh0eFR5cGUgPT09IFwiSW1wb3J0VHhcIikge1xyXG4gICAgICAgICAgICB0eXBlID0gdHh0eXBlLklNUE9SVF9DXHJcbiAgICAgICAgICAgIHBhcmFtcyA9IF9nZXRJbXBvcnRDVHhQYXJhbXMoYnR4IGFzIEltcG9ydENUeCwgd2FybmluZ3MpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rb3duIEMtY2hhaW4gdHJhbnNhY3Rpb24gdHlwZVwiKVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSB0eHR5cGUuZ2V0RGVzY3JpcHRpb24odHlwZSlcclxuICAgICAgICBsZXQgbWVzc2FnZVRvU2lnbiA9IF9nZXRNZXNzYWdlVG9TaWduKHR4KVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBuZXR3b3JrLFxyXG4gICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgLi4ucGFyYW1zLFxyXG4gICAgICAgICAgICB3YXJuaW5nczogQXJyYXkuZnJvbSh3YXJuaW5ncy52YWx1ZXMoKSksXHJcbiAgICAgICAgICAgIG1lc3NhZ2VUb1NpZ25cclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBfZ2V0RXhwb3J0Q1R4UGFyYW1zKHR4OiBFeHBvcnRDVHgsIHdhcm5pbmdzOiBTZXQ8c3RyaW5nPik6IGFueSB7XHJcbiAgICBsZXQgbmV0d29ya0lkID0gdHguZ2V0TmV0d29ya0lEKClcclxuXHJcbiAgICBfY2hlY2tQQmxvY2tjaGFpbklkKG5ldHdvcmtJZCwgdHguZ2V0RGVzdGluYXRpb25DaGFpbigpLnRvU3RyaW5nKFwiaGV4XCIpLCB3YXJuaW5ncylcclxuXHJcbiAgICBsZXQgaW5wdXRzID0gdHguZ2V0SW5wdXRzKClcclxuICAgIGxldCBpbnB1dEFtb3VudCA9IG5ldyBCTigwKVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpbnB1dEFtb3VudCA9IGlucHV0QW1vdW50LmFkZChfZ2V0QW1vdW50RnJvbUVWTU91dHB1dChpbnB1dHNbaV0pKVxyXG4gICAgICAgIF9jaGVja1BBc3NldElkKG5ldHdvcmtJZCwgaW5wdXRzW2ldLmdldEFzc2V0SUQoKS50b1N0cmluZyhcImhleFwiKSwgd2FybmluZ3MpXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG91dHB1dHMgPSB0eC5nZXRFeHBvcnRlZE91dHB1dHMoKVxyXG4gICAgbGV0IGV4cG9ydEFtb3VudHMgPSBuZXcgQXJyYXk8Qk4+KClcclxuICAgIGxldCBleHBvcnRSZWNpcGllbnRzID0gbmV3IEFycmF5PHN0cmluZz4oKVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRwdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG91dHB1dCA9IG91dHB1dHNbaV0uZ2V0T3V0cHV0KCkgYXMgQ0Ftb3VudE91dHB1dFxyXG4gICAgICAgIGxldCBhZGRyZXNzZXMgPSBvdXRwdXQuZ2V0QWRkcmVzc2VzKClcclxuICAgICAgICBpZiAoYWRkcmVzc2VzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgd2FybmluZ3MuYWRkKHdhcm5pbmcuTVVMVElQTEVfU0lHTkVSUylcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGFkZHJlc3MgPSBfYWRkcmVzc2VzVG9TdHJpbmcoYWRkcmVzc2VzIGFzIGFueSwgdHJ1ZSwgbmV0d29ya0lkKVxyXG4gICAgICAgIGxldCBpbmRleCA9IGV4cG9ydFJlY2lwaWVudHMuaW5kZXhPZihhZGRyZXNzKVxyXG4gICAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICAgICAgZXhwb3J0UmVjaXBpZW50cy5wdXNoKGFkZHJlc3MpXHJcbiAgICAgICAgICAgIGV4cG9ydEFtb3VudHMucHVzaChvdXRwdXQuZ2V0QW1vdW50KCkpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXhwb3J0QW1vdW50c1tpbmRleF0gPSBleHBvcnRBbW91bnRzW2luZGV4XS5hZGQob3V0cHV0LmdldEFtb3VudCgpKVxyXG4gICAgICAgIH1cclxuICAgICAgICBfY2hlY2tPdXRwdXRMb2NrVGltZShvdXRwdXQuZ2V0TG9ja3RpbWUoKSwgd2FybmluZ3MpXHJcbiAgICAgICAgX2NoZWNrUEFzc2V0SWQobmV0d29ya0lkLCBvdXRwdXRzW2ldLmdldEFzc2V0SUQoKS50b1N0cmluZyhcImhleFwiKSwgd2FybmluZ3MpXHJcbiAgICB9XHJcbiAgICBpZiAoZXhwb3J0UmVjaXBpZW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgd2FybmluZ3MuYWRkKHdhcm5pbmcuTVVMVElQTEVfUkVDSVBJRU5UUylcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZmVlID0gaW5wdXRBbW91bnQuc3ViKF9zdW1WYWx1ZXMoZXhwb3J0QW1vdW50cykpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZWNpcGllbnRzOiBleHBvcnRSZWNpcGllbnRzLFxyXG4gICAgICAgIHZhbHVlczogZXhwb3J0QW1vdW50cy5tYXAoYSA9PiBfZ3dlaVRvV2VpKGEpLnRvU3RyaW5nKCkpLFxyXG4gICAgICAgIGZlZTogX2d3ZWlUb1dlaShmZWUpLnRvU3RyaW5nKClcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gX2dldEltcG9ydENUeFBhcmFtcyh0eDogSW1wb3J0Q1R4LCB3YXJuaW5nczogU2V0PHN0cmluZz4pOiBhbnkge1xyXG4gICAgbGV0IG5ldHdvcmtJZCA9IHR4LmdldE5ldHdvcmtJRCgpXHJcblxyXG4gICAgX2NoZWNrUEJsb2NrY2hhaW5JZChuZXR3b3JrSWQsIHR4LmdldFNvdXJjZUNoYWluKCkudG9TdHJpbmcoXCJoZXhcIiksIHdhcm5pbmdzKVxyXG5cclxuICAgIGxldCBpbnB1dHMgPSB0eC5nZXRJbXBvcnRJbnB1dHMoKVxyXG4gICAgbGV0IGlucHV0QW1vdW50ID0gbmV3IEJOKDApXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlucHV0QW1vdW50ID0gaW5wdXRBbW91bnQuYWRkKChpbnB1dHNbaV0uZ2V0SW5wdXQoKSBhcyBDQW1vdW50SW5wdXQpLmdldEFtb3VudCgpKVxyXG4gICAgICAgIF9jaGVja1BBc3NldElkKG5ldHdvcmtJZCwgaW5wdXRzW2ldLmdldEFzc2V0SUQoKS50b1N0cmluZyhcImhleFwiKSwgd2FybmluZ3MpXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG91dHB1dHMgPSB0eC5nZXRPdXRzKClcclxuICAgIGxldCBpbXBvcnRBbW91bnRzID0gbmV3IEFycmF5PEJOPigpXHJcbiAgICBsZXQgaW1wb3J0UmVjaXBpZW50cyA9IG5ldyBBcnJheTxzdHJpbmc+KClcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3V0cHV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBvdXRwdXQgPSBvdXRwdXRzW2ldXHJcbiAgICAgICAgbGV0IGFtb3VudCA9IF9nZXRBbW91bnRGcm9tRVZNT3V0cHV0KG91dHB1dClcclxuICAgICAgICBsZXQgYWRkcmVzcyA9IHV0aWxzLnRvSGV4KG91dHB1dC5nZXRBZGRyZXNzU3RyaW5nKCkudG9Mb3dlckNhc2UoKSwgdHJ1ZSlcclxuICAgICAgICBsZXQgaW5kZXggPSBpbXBvcnRSZWNpcGllbnRzLmluZGV4T2YoYWRkcmVzcylcclxuICAgICAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgIGltcG9ydFJlY2lwaWVudHMucHVzaChhZGRyZXNzKVxyXG4gICAgICAgICAgICBpbXBvcnRBbW91bnRzLnB1c2goYW1vdW50KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGltcG9ydEFtb3VudHNbaW5kZXhdID0gaW1wb3J0QW1vdW50c1tpbmRleF0uYWRkKGFtb3VudClcclxuICAgICAgICB9XHJcbiAgICAgICAgX2NoZWNrUEFzc2V0SWQobmV0d29ya0lkLCBvdXRwdXQuZ2V0QXNzZXRJRCgpLnRvU3RyaW5nKFwiaGV4XCIpLCB3YXJuaW5ncylcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZmVlID0gaW5wdXRBbW91bnQuc3ViKF9zdW1WYWx1ZXMoaW1wb3J0QW1vdW50cykpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZWNpcGllbnRzOiBpbXBvcnRSZWNpcGllbnRzLFxyXG4gICAgICAgIHZhbHVlczogaW1wb3J0QW1vdW50cy5tYXAoYSA9PiBfZ3dlaVRvV2VpKGEpLnRvU3RyaW5nKCkpLFxyXG4gICAgICAgIGZlZTogX2d3ZWlUb1dlaShmZWUpLnRvU3RyaW5nKClcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gX2dldEFtb3VudEZyb21FVk1PdXRwdXQob3V0cHV0OiBFVk1PdXRwdXQpOiBCTiB7XHJcbiAgICBsZXQgb3V0cHV0QnVmZmVyID0gb3V0cHV0LnRvQnVmZmVyKClcclxuICAgIHJldHVybiBuZXcgQk4oYmludG9vbHMuY29weUZyb20ob3V0cHV0QnVmZmVyLCAyMCwgMjgpKVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBfdHJ5R2V0UFR4UGFyYW1zKHR4OiBVbnNpZ25lZFBUeCk6IFByb21pc2U8VHhWZXJpZmljYXRpb24gfCBudWxsPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBidHggPSB0eC5nZXRUcmFuc2FjdGlvbigpXHJcblxyXG4gICAgICAgIGxldCB3YXJuaW5ncyA9IG5ldyBTZXQ8c3RyaW5nPigpXHJcblxyXG4gICAgICAgIF9jaGVja1BCbG9ja2NoYWluSWQoYnR4LmdldE5ldHdvcmtJRCgpLCBidHguZ2V0QmxvY2tjaGFpbklEKCkudG9TdHJpbmcoXCJoZXhcIiksIHdhcm5pbmdzKVxyXG5cclxuICAgICAgICBsZXQgbmV0d29yayA9IF9nZXROZXR3b3JrKGJ0eC5nZXROZXR3b3JrSUQoKSwgd2FybmluZ3MpXHJcbiAgICAgICAgbGV0IHR4VHlwZSA9IGJ0eC5nZXRUeXBlTmFtZSgpXHJcbiAgICAgICAgbGV0IHR5cGU6IHN0cmluZ1xyXG4gICAgICAgIGxldCBwYXJhbXM6IGFueVxyXG4gICAgICAgIGlmICh0eFR5cGUgPT09IFwiQWRkRGVsZWdhdG9yVHhcIikge1xyXG4gICAgICAgICAgICB0eXBlID0gdHh0eXBlLkFERF9ERUxFR0FUT1JfUFxyXG4gICAgICAgICAgICBwYXJhbXMgPSBhd2FpdCBfZ2V0QWRkRGVsZWdhdG9yUGFyYW1zKGJ0eCBhcyBBZGREZWxlZ2F0b3JUeCwgd2FybmluZ3MpXHJcbiAgICAgICAgfSBlbHNlIGlmICh0eFR5cGUgPT09IFwiQWRkVmFsaWRhdG9yVHhcIikge1xyXG4gICAgICAgICAgICB0eXBlID0gdHh0eXBlLkFERF9WQUxJREFUT1JfUFxyXG4gICAgICAgICAgICBwYXJhbXMgPSBhd2FpdCBfZ2V0QWRkVmFsaWRhdG9yUGFyYW1zKGJ0eCBhcyBBZGRWYWxpZGF0b3JUeCwgd2FybmluZ3MpXHJcbiAgICAgICAgfSBlbHNlIGlmICh0eFR5cGUgPT09IFwiRXhwb3J0VHhcIikge1xyXG4gICAgICAgICAgICB0eXBlID0gdHh0eXBlLkVYUE9SVF9QXHJcbiAgICAgICAgICAgIHBhcmFtcyA9IGF3YWl0IF9nZXRFeHBvcnRQVHgoYnR4IGFzIEV4cG9ydFBUeCwgd2FybmluZ3MpXHJcbiAgICAgICAgfSBlbHNlIGlmICh0eFR5cGUgPT09IFwiSW1wb3J0VHhcIikge1xyXG4gICAgICAgICAgICB0eXBlID0gdHh0eXBlLklNUE9SVF9QXHJcbiAgICAgICAgICAgIHBhcmFtcyA9IGF3YWl0IF9nZXRJbXBvcnRQVHgoYnR4IGFzIEltcG9ydFBUeCwgd2FybmluZ3MpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rb3duIFAtY2hhaW4gdHJhbnNhY3Rpb24gdHlwZVwiKVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSB0eHR5cGUuZ2V0RGVzY3JpcHRpb24odHlwZSlcclxuICAgICAgICBsZXQgbWVzc2FnZVRvU2lnbiA9IF9nZXRNZXNzYWdlVG9TaWduKHR4KVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5ldHdvcmssXHJcbiAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAuLi5wYXJhbXMsXHJcbiAgICAgICAgICAgIHdhcm5pbmdzOiBBcnJheS5mcm9tKHdhcm5pbmdzLnZhbHVlcygpKSxcclxuICAgICAgICAgICAgbWVzc2FnZVRvU2lnblxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIF9nZXRBZGREZWxlZ2F0b3JQYXJhbXModHg6IEFkZERlbGVnYXRvclR4LCB3YXJuaW5nczogU2V0PHN0cmluZz4pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgcmV0dXJuIF9nZXRTdGFrZVR4RGF0YSh0eCwgd2FybmluZ3MpXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIF9nZXRBZGRWYWxpZGF0b3JQYXJhbXModHg6IEFkZFZhbGlkYXRvclR4LCB3YXJuaW5nczogU2V0PHN0cmluZz4pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgcmV0dXJuIF9nZXRTdGFrZVR4RGF0YSh0eCwgd2FybmluZ3MpXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIF9nZXRTdGFrZVR4RGF0YSh0eDogQWRkRGVsZWdhdG9yVHggfCBBZGRWYWxpZGF0b3JUeCwgd2FybmluZ3M6IFNldDxzdHJpbmc+KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGxldCBbcmVjaXBpZW50cywgcmVjZWl2ZWRBbW91bnRzXSA9IF9nZXRQT3V0cHV0c0RhdGEoXHJcbiAgICAgICAgdHguZ2V0TmV0d29ya0lEKCksXHJcbiAgICAgICAgdHguZ2V0T3V0cygpLFxyXG4gICAgICAgIHdhcm5pbmdzXHJcbiAgICApXHJcblxyXG4gICAgbGV0IHNlbnRBbW91bnQgPSBhd2FpdCBfZ2V0UElucHV0c0RhdGEoXHJcbiAgICAgICAgdHguZ2V0TmV0d29ya0lEKCksXHJcbiAgICAgICAgdHguZ2V0SW5zKCksXHJcbiAgICAgICAgcmVjaXBpZW50cy5sZW5ndGggPT0gMSAmJiAhcmVjaXBpZW50c1swXS5pbmNsdWRlcyhcIixcIikgPyByZWNpcGllbnRzWzBdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgIHVuZGVmaW5lZCxcclxuICAgICAgICB3YXJuaW5nc1xyXG4gICAgKVxyXG5cclxuICAgIGxldCBzdGFrZUFtb3VudCA9IHR4LmdldFN0YWtlQW1vdW50KClcclxuICAgIGxldCBmZWUgPSBzZW50QW1vdW50LnN1Yihfc3VtVmFsdWVzKHJlY2VpdmVkQW1vdW50cykpLnN1YihzdGFrZUFtb3VudClcclxuXHJcbiAgICBsZXQgW3N0YWtlb3V0UmVjaXBpZW50cywgc3Rha2VvdXRBbW91bnRzXSA9IF9nZXRQT3V0cHV0c0RhdGEoXHJcbiAgICAgICAgdHguZ2V0TmV0d29ya0lEKCksXHJcbiAgICAgICAgdHguZ2V0U3Rha2VPdXRzKCksXHJcbiAgICAgICAgd2FybmluZ3NcclxuICAgIClcclxuICAgIF9jb21wYXJlUmVjaXBpZW50cyhzdGFrZW91dFJlY2lwaWVudHMsIHJlY2lwaWVudHMsIHdhcm5pbmdzKVxyXG5cclxuICAgIGlmICh0eCBpbnN0YW5jZW9mIEFkZERlbGVnYXRvclR4KSB7XHJcbiAgICAgICAgYXdhaXQgX2NoZWNrTm9kZUlkKHR4LCB3YXJuaW5ncylcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcGFyYW1ldGVycyA9IG5ldyBBcnJheTxUeFZlcmlmaWNhdGlvblBhcmFtZXRlcj4oKVxyXG4gICAgcGFyYW1ldGVycy5wdXNoKHtcclxuICAgICAgICBuYW1lOiBcIm5vZGVJZFwiLFxyXG4gICAgICAgIHZhbHVlOiB0eC5nZXROb2RlSURTdHJpbmcoKVxyXG4gICAgfSlcclxuICAgIHBhcmFtZXRlcnMucHVzaCh7XHJcbiAgICAgICAgbmFtZTogXCJzdGFydFRpbWVcIixcclxuICAgICAgICB2YWx1ZTogdHguZ2V0U3RhcnRUaW1lKCkudG9TdHJpbmcoKSFcclxuICAgIH0pXHJcbiAgICBwYXJhbWV0ZXJzLnB1c2goe1xyXG4gICAgICAgIG5hbWU6IFwiZW5kVGltZVwiLFxyXG4gICAgICAgIHZhbHVlOiB0eC5nZXRFbmRUaW1lKCkudG9TdHJpbmcoKSFcclxuICAgIH0pXHJcbiAgICBpZiAodHggaW5zdGFuY2VvZiBBZGRWYWxpZGF0b3JUeCkge1xyXG4gICAgICAgIHBhcmFtZXRlcnMucHVzaCh7XHJcbiAgICAgICAgICAgIG5hbWU6IFwiZGVsZWdhdGlvbkZlZVwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHguZ2V0RGVsZWdhdGlvbkZlZSgpLnRvU3RyaW5nKClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVjaXBpZW50czogc3Rha2VvdXRSZWNpcGllbnRzLFxyXG4gICAgICAgIHZhbHVlczogc3Rha2VvdXRBbW91bnRzLm1hcChhID0+IF9nd2VpVG9XZWkoYSkudG9TdHJpbmcoKSksXHJcbiAgICAgICAgZmVlOiBfZ3dlaVRvV2VpKGZlZSkudG9TdHJpbmcoKSxcclxuICAgICAgICBwYXJhbWV0ZXJzXHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIF9nZXRFeHBvcnRQVHgodHg6IEV4cG9ydFBUeCwgd2FybmluZ3M6IFNldDxzdHJpbmc+KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGxldCBuZXR3b3JrSWQgPSB0eC5nZXROZXR3b3JrSUQoKVxyXG4gICAgX2NoZWNrQ0Jsb2NrY2hhaW5JZChuZXR3b3JrSWQsIHR4LmdldERlc3RpbmF0aW9uQ2hhaW4oKS50b1N0cmluZyhcImhleFwiKSwgd2FybmluZ3MpXHJcbiAgICBsZXQgW3V0eG9SZWNpcGllbnRzLCB1dHhvUmVjZWl2ZWRBbW91bnRzXSA9IF9nZXRQT3V0cHV0c0RhdGEoXHJcbiAgICAgICAgbmV0d29ya0lkLFxyXG4gICAgICAgIHR4LmdldE91dHMoKSxcclxuICAgICAgICB3YXJuaW5nc1xyXG4gICAgKVxyXG4gICAgbGV0IFtleHBvcnRSZWNpcGllbnRzLCBleHBvcnRBbW91bnRzXSA9IF9nZXRQT3V0cHV0c0RhdGEoXHJcbiAgICAgICAgbmV0d29ya0lkLFxyXG4gICAgICAgIHR4LmdldEV4cG9ydE91dHB1dHMoKSxcclxuICAgICAgICB3YXJuaW5nc1xyXG4gICAgKVxyXG4gICAgX2NvbXBhcmVSZWNpcGllbnRzKGV4cG9ydFJlY2lwaWVudHMsIHV0eG9SZWNpcGllbnRzLCB3YXJuaW5ncylcclxuXHJcbiAgICBsZXQgdXR4b1NlbnRBbW91bnQgPSBhd2FpdCBfZ2V0UElucHV0c0RhdGEoXHJcbiAgICAgICAgbmV0d29ya0lkLFxyXG4gICAgICAgIHR4LmdldElucygpLFxyXG4gICAgICAgIGV4cG9ydFJlY2lwaWVudHMubGVuZ3RoID09IDEgJiYgIWV4cG9ydFJlY2lwaWVudHMuaW5jbHVkZXMoXCIsXCIpID8gZXhwb3J0UmVjaXBpZW50c1swXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICB1bmRlZmluZWQsXHJcbiAgICAgICAgd2FybmluZ3NcclxuICAgIClcclxuXHJcbiAgICBsZXQgZmVlID0gdXR4b1NlbnRBbW91bnQuc3ViKF9zdW1WYWx1ZXModXR4b1JlY2VpdmVkQW1vdW50cykpLnN1Yihfc3VtVmFsdWVzKGV4cG9ydEFtb3VudHMpKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVjaXBpZW50czogZXhwb3J0UmVjaXBpZW50cyxcclxuICAgICAgICB2YWx1ZXM6IGV4cG9ydEFtb3VudHMubWFwKGEgPT4gX2d3ZWlUb1dlaShhKS50b1N0cmluZygpKSxcclxuICAgICAgICBmZWU6IF9nd2VpVG9XZWkoZmVlKS50b1N0cmluZygpXHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIF9nZXRJbXBvcnRQVHgodHg6IEltcG9ydFBUeCwgd2FybmluZ3M6IFNldDxzdHJpbmc+KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGxldCBuZXR3b3JrSWQgPSB0eC5nZXROZXR3b3JrSUQoKVxyXG5cclxuICAgIF9jaGVja0NCbG9ja2NoYWluSWQobmV0d29ya0lkLCB0eC5nZXRTb3VyY2VDaGFpbigpLnRvU3RyaW5nKFwiaGV4XCIpLCB3YXJuaW5ncylcclxuXHJcbiAgICBsZXQgW3JlY2lwaWVudHMsIHJlY2VpdmVkQW1vdW50c10gPSBfZ2V0UE91dHB1dHNEYXRhKFxyXG4gICAgICAgIHR4LmdldE5ldHdvcmtJRCgpLFxyXG4gICAgICAgIHR4LmdldE91dHMoKSxcclxuICAgICAgICB3YXJuaW5nc1xyXG4gICAgKVxyXG5cclxuICAgIGxldCBzZW50QW1vdW50ID0gYXdhaXQgX2dldFBJbnB1dHNEYXRhKFxyXG4gICAgICAgIG5ldHdvcmtJZCxcclxuICAgICAgICB0eC5nZXRJbnMoKSxcclxuICAgICAgICByZWNpcGllbnRzLmxlbmd0aCA9PSAxICYmICFyZWNpcGllbnRzWzBdLmluY2x1ZGVzKFwiLFwiKSA/IHJlY2lwaWVudHNbMF0gOiB1bmRlZmluZWQsXHJcbiAgICAgICAgX2dldENCbG9ja2NoYWluSWQobmV0d29ya0lkKSxcclxuICAgICAgICB3YXJuaW5nc1xyXG4gICAgKVxyXG5cclxuICAgIGxldCBpbXBvcnRBbW91bnQgPSBhd2FpdCBfZ2V0UElucHV0c0RhdGEoXHJcbiAgICAgICAgbmV0d29ya0lkLFxyXG4gICAgICAgIHR4LmdldEltcG9ydElucHV0cygpLFxyXG4gICAgICAgIHJlY2lwaWVudHMubGVuZ3RoID09IDEgJiYgIXJlY2lwaWVudHNbMF0uaW5jbHVkZXMoXCIsXCIpID8gcmVjaXBpZW50c1swXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICBfZ2V0Q0Jsb2NrY2hhaW5JZChuZXR3b3JrSWQpLFxyXG4gICAgICAgIHdhcm5pbmdzXHJcbiAgICApXHJcblxyXG4gICAgbGV0IGZlZSA9IGltcG9ydEFtb3VudC5hZGQoc2VudEFtb3VudCkuc3ViKF9zdW1WYWx1ZXMocmVjZWl2ZWRBbW91bnRzKSlcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlY2lwaWVudHMsXHJcbiAgICAgICAgdmFsdWVzOiByZWNlaXZlZEFtb3VudHMubWFwKGEgPT4gX2d3ZWlUb1dlaShhKS50b1N0cmluZygpKSxcclxuICAgICAgICBmZWU6IF9nd2VpVG9XZWkoZmVlKS50b1N0cmluZygpXHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIF9nZXRQSW5wdXRzRGF0YShcclxuICAgIG5ldHdvcmtJZDogbnVtYmVyLFxyXG4gICAgaW5wdXRzOiBBcnJheTxQVHJhbnNmZXJhYmxlSW5wdXQ+LFxyXG4gICAgYWRkcmVzczogc3RyaW5nIHwgdW5kZWZpbmVkLFxyXG4gICAgYmxvY2tjaGFpbklkOiBzdHJpbmcgfCB1bmRlZmluZWQsXHJcbiAgICB3YXJuaW5nczogU2V0PHN0cmluZz5cclxuKTogUHJvbWlzZTxCTj4ge1xyXG4gICAgbGV0IHV0eG9zID0gYWRkcmVzcyA/IChhd2FpdCBfZ2V0UFVUWE9zKG5ldHdvcmtJZCwgYWRkcmVzcywgYmxvY2tjaGFpbklkKSkgOiBuZXcgQXJyYXk8YW55PigpXHJcbiAgICBsZXQgc2VudEFtb3VudCA9IG5ldyBCTigwKVxyXG4gICAgZm9yIChsZXQgaW5wdXQgb2YgaW5wdXRzKSB7XHJcbiAgICAgICAgbGV0IGFpID0gaW5wdXQuZ2V0SW5wdXQoKSBhcyBQQW1vdW50SW5wdXRcclxuICAgICAgICBzZW50QW1vdW50ID0gc2VudEFtb3VudC5hZGQoYWkuZ2V0QW1vdW50KCkpXHJcbiAgICAgICAgX2NoZWNrUEFzc2V0SWQobmV0d29ya0lkLCBpbnB1dC5nZXRBc3NldElEKCkudG9TdHJpbmcoXCJoZXhcIiksIHdhcm5pbmdzKVxyXG4gICAgICAgIGlmIChhZGRyZXNzKSB7XHJcbiAgICAgICAgICAgIGxldCB0eElkID0gaW5wdXQuZ2V0VHhJRCgpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICAgICAgICAgIGxldCBvdXRwdXRJZHggPSBwYXJzZUludChpbnB1dC5nZXRPdXRwdXRJZHgoKS50b1N0cmluZyhcImhleFwiKSwgMTYpXHJcbiAgICAgICAgICAgIGlmICghdXR4b3MuZmluZCh1ID0+IHUudHhJZCA9PT0gdHhJZCAmJiB1Lm91dHB1dElkeCA9PT0gb3V0cHV0SWR4KSkge1xyXG4gICAgICAgICAgICAgICAgd2FybmluZ3MuYWRkKHdhcm5pbmcuRlVORFNfTk9UX1JFVFVSTkVEKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNlbnRBbW91bnRcclxufVxyXG5cclxuZnVuY3Rpb24gX2dldFBPdXRwdXRzRGF0YShcclxuICAgIG5ldHdvcmtJZDogbnVtYmVyLFxyXG4gICAgb3V0cHV0czogQXJyYXk8UFRyYW5zZmVyYWJsZU91dHB1dD4sXHJcbiAgICB3YXJuaW5nczogU2V0PHN0cmluZz5cclxuKTogW0FycmF5PHN0cmluZz4sIEFycmF5PEJOPl0ge1xyXG4gICAgbGV0IHJlY2lwaWVudHMgPSBuZXcgQXJyYXk8c3RyaW5nPigpXHJcbiAgICBsZXQgcmVjZWl2ZWRBbW91bnRzID0gbmV3IEFycmF5PEJOPigpXHJcbiAgICBmb3IgKGxldCBvdXRwdXQgb2Ygb3V0cHV0cykge1xyXG4gICAgICAgIGxldCBhbyA9IG91dHB1dC5nZXRPdXRwdXQoKSBhcyBQQW1vdW50T3V0cHV0XHJcbiAgICAgICAgbGV0IGFkZHJlc3NlcyA9IGFvLmdldEFkZHJlc3NlcygpXHJcbiAgICAgICAgaWYgKGFkZHJlc3Nlcy5sZW5ndGggIT0gMSkge1xyXG4gICAgICAgICAgICB3YXJuaW5ncy5hZGQod2FybmluZy5NVUxUSVBMRV9TSUdORVJTKVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgYWRkcmVzcyA9IF9hZGRyZXNzZXNUb1N0cmluZyhhZGRyZXNzZXMgYXMgYW55LCB0cnVlLCBuZXR3b3JrSWQpXHJcbiAgICAgICAgbGV0IGluZGV4ID0gcmVjaXBpZW50cy5pbmRleE9mKGFkZHJlc3MpXHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICByZWNpcGllbnRzLnB1c2goYWRkcmVzcylcclxuICAgICAgICAgICAgcmVjZWl2ZWRBbW91bnRzLnB1c2goYW8uZ2V0QW1vdW50KCkpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVjZWl2ZWRBbW91bnRzW2luZGV4XSA9IHJlY2VpdmVkQW1vdW50c1tpbmRleF0uYWRkKGFvLmdldEFtb3VudCgpKVxyXG4gICAgICAgIH1cclxuICAgICAgICBfY2hlY2tPdXRwdXRMb2NrVGltZShhby5nZXRMb2NrdGltZSgpLCB3YXJuaW5ncylcclxuICAgICAgICBfY2hlY2tQQXNzZXRJZChuZXR3b3JrSWQsIG91dHB1dC5nZXRBc3NldElEKCkudG9TdHJpbmcoXCJoZXhcIiksIHdhcm5pbmdzKVxyXG4gICAgfVxyXG4gICAgaWYgKHJlY2lwaWVudHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIHdhcm5pbmdzLmFkZCh3YXJuaW5nLk1VTFRJUExFX1JFQ0lQSUVOVFMpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gW3JlY2lwaWVudHMsIHJlY2VpdmVkQW1vdW50c11cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gX2dldFBVVFhPcyhcclxuICAgIG5ldHdvcmtJZDogbnVtYmVyLFxyXG4gICAgYWRkcmVzczogc3RyaW5nLFxyXG4gICAgYmxvY2tjaGFpbklkPzogc3RyaW5nXHJcbik6IFByb21pc2U8QXJyYXk8YW55Pj4ge1xyXG4gICAgbGV0IGF2YWxhbmNoZSA9IF9nZXRBdmFsYW5jaGUobmV0d29ya0lkKVxyXG4gICAgbGV0IHV0eG9zID0gKGF3YWl0IGF2YWxhbmNoZS5QQ2hhaW4oKS5nZXRVVFhPcyhgUC0ke2FkZHJlc3N9YCwgYmxvY2tjaGFpbklkKSkudXR4b3NcclxuICAgIHJldHVybiB1dHhvcy5nZXRBbGxVVFhPcygpLm1hcCh1ID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0eElkOiB1LmdldFR4SUQoKS50b1N0cmluZyhcImhleFwiKSxcclxuICAgICAgICAgICAgb3V0cHV0SWR4OiBwYXJzZUludCh1LmdldE91dHB1dElkeCgpLnRvU3RyaW5nKFwiaGV4XCIpLCAxNilcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBfY2hlY2tOb2RlSWQodHg6IEFkZERlbGVnYXRvclR4LCB3YXJuaW5nczogU2V0PHN0cmluZz4pIHtcclxuICAgIGxldCBhdmFsYW5jaGUgPSBfZ2V0QXZhbGFuY2hlKHR4LmdldE5ldHdvcmtJRCgpKVxyXG5cclxuICAgIGxldCBzdGFrZXMgPSBuZXcgQXJyYXk8YW55PlxyXG4gICAgbGV0IGN2YWxpZGF0b3JzID0gYXdhaXQgYXZhbGFuY2hlLlBDaGFpbigpLmdldEN1cnJlbnRWYWxpZGF0b3JzKCkgYXMgYW55XHJcbiAgICBpZiAoY3ZhbGlkYXRvcnMgJiYgY3ZhbGlkYXRvcnMudmFsaWRhdG9ycykge1xyXG4gICAgICAgIGxldCBjc3Rha2VzID0gY3ZhbGlkYXRvcnMudmFsaWRhdG9ycyBhcyBBcnJheTxhbnk+XHJcbiAgICAgICAgaWYgKGNzdGFrZXMpIHtcclxuICAgICAgICAgICAgc3Rha2VzID0gc3Rha2VzLmNvbmNhdChjc3Rha2VzKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCBwdmFsaWRhdG9ycyA9IGF3YWl0IGF2YWxhbmNoZS5QQ2hhaW4oKS5nZXRQZW5kaW5nVmFsaWRhdG9ycygpIGFzIGFueVxyXG4gICAgaWYgKHB2YWxpZGF0b3JzICYmIHB2YWxpZGF0b3JzLnZhbGlkYXRvcnMpIHtcclxuICAgICAgICBsZXQgcHN0YWtlcyA9IHB2YWxpZGF0b3JzLnZhbGlkYXRvcnMgYXMgQXJyYXk8YW55PlxyXG4gICAgICAgIGlmIChwc3Rha2VzKSB7XHJcbiAgICAgICAgICAgIHN0YWtlcyA9IHN0YWtlcy5jb25jYXQocHN0YWtlcylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG5vZGVJZHMgPSBuZXcgU2V0PHN0cmluZz4oKVxyXG4gICAgZm9yIChsZXQgc3Rha2Ugb2Ygc3Rha2VzKSB7XHJcbiAgICAgICAgaWYgKHN0YWtlLm5vZGVJRCkge1xyXG4gICAgICAgICAgICBub2RlSWRzLmFkZChzdGFrZS5ub2RlSUQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCFub2RlSWRzLmhhcyh0eC5nZXROb2RlSURTdHJpbmcoKSkpIHtcclxuICAgICAgICB3YXJuaW5ncy5hZGQod2FybmluZy5VTktOT1dOX05PREVJRClcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9nZXRBdmFsYW5jaGUobmV0d29ya0lkOiBudW1iZXIpOiBBdmFsYW5jaGUge1xyXG4gICAgbGV0IHVybCA9IG5ldyBVUkwoc2V0dGluZ3MuUlBDW25ldHdvcmtJZF0pXHJcbiAgICBsZXQgYXZhbGFuY2hlID0gbmV3IEF2YWxhbmNoZShcclxuICAgICAgICB1cmwuaG9zdG5hbWUsXHJcbiAgICAgICAgdXJsLnBvcnQgPyBwYXJzZUludCh1cmwucG9ydCkgOiB1bmRlZmluZWQsXHJcbiAgICAgICAgdXJsLnByb3RvY29sLFxyXG4gICAgICAgIG5ldHdvcmtJZFxyXG4gICAgKVxyXG4gICAgcmV0dXJuIGF2YWxhbmNoZVxyXG59XHJcblxyXG5mdW5jdGlvbiBfYWRkcmVzc2VzVG9TdHJpbmcoXHJcbiAgICBhZGRyZXNzZXM6IEFycmF5PEJ1ZmZlcj4sXHJcbiAgICB0b0JlY2g6IGJvb2xlYW4sXHJcbiAgICBuZXR3b3JrSWQ/OiBudW1iZXJcclxuKTogc3RyaW5nIHtcclxuICAgIGxldCBpdGVtcyA9IG5ldyBBcnJheShhZGRyZXNzZXMubGVuZ3RoKVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZGRyZXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgYWRkcmVzcyA9IGFkZHJlc3Nlc1tpXS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICAgIGlmICh0b0JlY2gpIHtcclxuICAgICAgICAgICAgaXRlbXNbaV0gPSBfYWRkcmVzc1RvQmVjaChuZXR3b3JrSWQhLCBhZGRyZXNzKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGl0ZW1zW2ldID0gdXRpbHMudG9IZXgoYWRkcmVzcywgdHJ1ZSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaXRlbXMuc29ydCgpLmpvaW4oXCIsIFwiKVxyXG59XHJcblxyXG5mdW5jdGlvbiBfY2hlY2tPdXRwdXRMb2NrVGltZShvdXRwdXRMb2NrVGltZTogQk4sIHdhcm5pbmdzOiBTZXQ8c3RyaW5nPikge1xyXG4gICAgaWYgKCFvdXRwdXRMb2NrVGltZS5pc1plcm8oKSkge1xyXG4gICAgICAgIHdhcm5pbmdzLmFkZCh3YXJuaW5nLkZVTkRTX0xPQ0tFRClcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gX2NoZWNrQ0Jsb2NrY2hhaW5JZChuZXR3b3JrSWQ6IG51bWJlciwgYmxvY2tjaGFpbklkOiBzdHJpbmcsIHdhcm5pbmdzOiBTZXQ8c3RyaW5nPikge1xyXG4gICAgaWYgKHV0aWxzLmlzWmVyb0hleChibG9ja2NoYWluSWQpKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBsZXQgY0Jsb2NrY2hhaW5JZCA9IGJpbnRvb2xzLmNiNThEZWNvZGUoX2dldENCbG9ja2NoYWluSWQobmV0d29ya0lkKSkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgIGlmIChibG9ja2NoYWluSWQgIT09IGNCbG9ja2NoYWluSWQpIHtcclxuICAgICAgICB3YXJuaW5ncy5hZGQod2FybmluZy5JTlZBTElEX0JMT0NLQ0hBSU4pXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9nZXRDQmxvY2tjaGFpbklkKG5ldHdvcmtJZDogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBEZWZhdWx0cy5uZXR3b3JrW25ldHdvcmtJZF0uQy5ibG9ja2NoYWluSURcclxufVxyXG5cclxuZnVuY3Rpb24gX2NoZWNrUEJsb2NrY2hhaW5JZChuZXR3b3JrSWQ6IG51bWJlciwgYmxvY2tjaGFpbklkOiBzdHJpbmcsIHdhcm5pbmdzOiBTZXQ8c3RyaW5nPikge1xyXG4gICAgaWYgKHV0aWxzLmlzWmVyb0hleChibG9ja2NoYWluSWQpKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBsZXQgcEJsb2NrY2hhaW5JZCA9IGJpbnRvb2xzLmNiNThEZWNvZGUoX2dldFBCbG9ja2NoYWluSWQobmV0d29ya0lkKSkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgIGlmIChibG9ja2NoYWluSWQgIT09IHBCbG9ja2NoYWluSWQpIHtcclxuICAgICAgICB3YXJuaW5ncy5hZGQod2FybmluZy5JTlZBTElEX0JMT0NLQ0hBSU4pXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9nZXRQQmxvY2tjaGFpbklkKG5ldHdvcmtJZDogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBEZWZhdWx0cy5uZXR3b3JrW25ldHdvcmtJZF0uUC5ibG9ja2NoYWluSURcclxufVxyXG5cclxuZnVuY3Rpb24gX2NoZWNrUEFzc2V0SWQobmV0d29ya0lkOiBudW1iZXIsIGFzc2V0SWQ6IHN0cmluZywgd2FybmluZ3M6IFNldDxzdHJpbmc+KSB7XHJcbiAgICBsZXQgcEFzc2V0SWQgPSBiaW50b29scy5jYjU4RGVjb2RlKERlZmF1bHRzLm5ldHdvcmtbbmV0d29ya0lkXS5QLmF2YXhBc3NldElEISkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgIGlmIChhc3NldElkICE9PSBwQXNzZXRJZCkge1xyXG4gICAgICAgIHdhcm5pbmdzLmFkZCh3YXJuaW5nLklOVkFMSURfQVNTRVQpXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9jb21wYXJlUmVjaXBpZW50cyhcclxuICAgIHJlY2lwaWVudHM6IEFycmF5PHN0cmluZz4sXHJcbiAgICB1dHhvUmVjaXBpZW50czogQXJyYXk8c3RyaW5nPixcclxuICAgIHdhcm5pbmdzOiBTZXQ8c3RyaW5nPlxyXG4pIHtcclxuICAgIGlmIChyZWNpcGllbnRzLmxlbmd0aCAhPSAxKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBpZiAodXR4b1JlY2lwaWVudHMubGVuZ3RoID09IDApIHtcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGlmICh1dHhvUmVjaXBpZW50cy5sZW5ndGggPiAxIHx8IHV0eG9SZWNpcGllbnRzWzBdICE9PSByZWNpcGllbnRzWzBdKSB7XHJcbiAgICAgICAgd2FybmluZ3MuYWRkKHdhcm5pbmcuVU5TUEVOVF9BTU9VTlRfTk9UX1RPX1JFQ0lQSUVOVClcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gX3N1bVZhbHVlcyh2YWx1ZXM6IEFycmF5PEJOPik6IEJOIHtcclxuICAgIHJldHVybiB2YWx1ZXMucmVkdWNlKChwLCBjKSA9PiBwLmFkZChjKSwgbmV3IEJOKDApKVxyXG59XHJcblxyXG5mdW5jdGlvbiBfYWRkcmVzc1RvQmVjaChuZXR3b3JrSWQ6IG51bWJlciwgYWRkcmVzc0hleDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBiZWNoMzIuZW5jb2RlKHR4bmV0d29yay5nZXRIUlAobmV0d29ya0lkKSwgYmVjaDMyLnRvV29yZHMoQnVmZmVyLmZyb20oYWRkcmVzc0hleCwgXCJoZXhcIikpKVxyXG59XHJcblxyXG5mdW5jdGlvbiBfZ3dlaVRvV2VpKGd3ZWlWYWx1ZTogQk4pOiBCTiB7XHJcbiAgICByZXR1cm4gZ3dlaVZhbHVlLm11bChuZXcgQk4oMWU5KSlcclxufSJdfQ==