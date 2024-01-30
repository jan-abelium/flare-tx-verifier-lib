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
const src_1 = require("../src");
const txnetwork = __importStar(require("../src/txnetwork"));
const utils = __importStar(require("../src/utils"));
const chain = __importStar(require("../src/evm/contract/chain"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let input = process.argv[2].trim();
        if (!utils.isHex(input)) {
            console.log("Not a valid input");
            return;
        }
        let txId = utils.toHex(input, true);
        let txHex = null;
        for (let networkId of txnetwork.getNetworks()) {
            try {
                txHex = yield chain.getRawTransaction(networkId, txId);
            }
            catch (_a) { }
            if (txHex) {
                break;
            }
        }
        if (txHex) {
            console.log(`\x1b[34mTransaction hash:\x1b[0m ${txHex}`);
            let verification = yield (0, src_1.verify)(txHex);
            if (verification == null) {
                console.log("Transaction verification did not succeed");
            }
            else {
                console.log(`\x1b[34mTransaction verification:\x1b[0m ${JSON.stringify(verification, undefined, "  ")}`);
            }
        }
        else {
            console.log("Failed to obtain transaction hash");
        }
    });
}
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyaWZ5RXZtVHhJZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NjcmlwdHMvdmVyaWZ5RXZtVHhJZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0NBQStCO0FBQy9CLDREQUE2QztBQUM3QyxvREFBcUM7QUFDckMsaUVBQWtEO0FBRWxELFNBQWUsSUFBSTs7UUFDbEIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtZQUNoQyxPQUFNO1FBQ1AsQ0FBQztRQUNELElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ25DLElBQUksS0FBSyxHQUFrQixJQUFJLENBQUE7UUFDL0IsS0FBSyxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztZQUMvQyxJQUFJLENBQUM7Z0JBQUMsS0FBSyxHQUFHLE1BQU0sS0FBSyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUFDLENBQUM7WUFBQyxXQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ1gsTUFBSztZQUNOLENBQUM7UUFDRixDQUFDO1FBQ0QsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLEtBQUssRUFBRSxDQUFDLENBQUE7WUFDeEQsSUFBSSxZQUFZLEdBQUcsTUFBTSxJQUFBLFlBQU0sRUFBQyxLQUFLLENBQUMsQ0FBQTtZQUN0QyxJQUFJLFlBQVksSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFBO1lBQzNELENBQUM7aUJBQU0sQ0FBQztnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLDRDQUE0QyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQzVHLENBQUM7UUFDUixDQUFDO2FBQU0sQ0FBQztZQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtRQUNqRCxDQUFDO0lBQ0YsQ0FBQztDQUFBO0FBRUQsSUFBSSxFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB2ZXJpZnkgfSBmcm9tIFwiLi4vc3JjXCJcclxuaW1wb3J0ICogYXMgdHhuZXR3b3JrIGZyb20gXCIuLi9zcmMvdHhuZXR3b3JrXCJcclxuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSBcIi4uL3NyYy91dGlsc1wiXHJcbmltcG9ydCAqIGFzIGNoYWluIGZyb20gXCIuLi9zcmMvZXZtL2NvbnRyYWN0L2NoYWluXCJcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XHJcblx0bGV0IGlucHV0ID0gcHJvY2Vzcy5hcmd2WzJdLnRyaW0oKVxyXG5cdGlmICghdXRpbHMuaXNIZXgoaW5wdXQpKSB7XHJcblx0XHRjb25zb2xlLmxvZyhcIk5vdCBhIHZhbGlkIGlucHV0XCIpXHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblx0bGV0IHR4SWQgPSB1dGlscy50b0hleChpbnB1dCwgdHJ1ZSlcclxuXHRsZXQgdHhIZXg6IHN0cmluZyB8IG51bGwgPSBudWxsXHJcblx0Zm9yIChsZXQgbmV0d29ya0lkIG9mIHR4bmV0d29yay5nZXROZXR3b3JrcygpKSB7XHJcblx0XHR0cnkgeyB0eEhleCA9IGF3YWl0IGNoYWluLmdldFJhd1RyYW5zYWN0aW9uKG5ldHdvcmtJZCwgdHhJZCkgfSBjYXRjaCB7IH1cclxuXHRcdGlmICh0eEhleCkge1xyXG5cdFx0XHRicmVha1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZiAodHhIZXgpIHtcclxuXHRcdGNvbnNvbGUubG9nKGBcXHgxYlszNG1UcmFuc2FjdGlvbiBoYXNoOlxceDFiWzBtICR7dHhIZXh9YClcclxuXHRcdGxldCB2ZXJpZmljYXRpb24gPSBhd2FpdCB2ZXJpZnkodHhIZXgpXHJcblx0XHRpZiAodmVyaWZpY2F0aW9uID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUcmFuc2FjdGlvbiB2ZXJpZmljYXRpb24gZGlkIG5vdCBzdWNjZWVkXCIpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYFxceDFiWzM0bVRyYW5zYWN0aW9uIHZlcmlmaWNhdGlvbjpcXHgxYlswbSAke0pTT04uc3RyaW5naWZ5KHZlcmlmaWNhdGlvbiwgdW5kZWZpbmVkLCBcIiAgXCIpfWApXHJcbiAgICAgICAgfVxyXG5cdH0gZWxzZSB7XHJcblx0XHRjb25zb2xlLmxvZyhcIkZhaWxlZCB0byBvYnRhaW4gdHJhbnNhY3Rpb24gaGFzaFwiKVxyXG5cdH1cclxufVxyXG5cclxubWFpbigpIl19