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
const chain = __importStar(require("../src/evm/contract/chain"));
const explorer = __importStar(require("../src/evm/contract/explorer"));
const txnetwork = __importStar(require("../src/txnetwork"));
const fs = __importStar(require("fs"));
const REGISTRY_PATH = "src/evm/contract/registry.ts";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let lines = new Array();
        lines.push(`import { NetworkRegistry } from "./interface"\n`);
        lines.push("export const registry: NetworkRegistry = {");
        for (let network of txnetwork.getNetworks()) {
            lines.push(`   ${network}: {`);
            let contracts = yield explorer.getContracts(network);
            let flareContracts = yield chain.getFlareNetworkContracts(network);
            for (let flareContract of flareContracts) {
                let address = flareContract.address.toLowerCase();
                let contract = contracts.filter(c => c.address === address);
                if (contract.length == 1) {
                    lines.push(`        "${address}": {`);
                    lines.push(`            address: "${address}",`);
                    lines.push(`            name: "${flareContract.name}",`);
                    lines.push(`            abi: ${contract[0].abi}`);
                    lines.push(`        },`);
                }
            }
            lines.push(`    },`);
        }
        lines.push("}");
        fs.writeFileSync(REGISTRY_PATH, lines.join("\n"));
    });
}
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVDb250cmFjdFJlZ2lzdHJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc2NyaXB0cy9nZW5lcmF0ZUNvbnRyYWN0UmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlFQUFrRDtBQUNsRCx1RUFBd0Q7QUFDeEQsNERBQTZDO0FBQzdDLHVDQUF3QjtBQUV4QixNQUFNLGFBQWEsR0FBRyw4QkFBOEIsQ0FBQTtBQUVwRCxTQUFlLElBQUk7O1FBQ2YsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQVUsQ0FBQTtRQUMvQixLQUFLLENBQUMsSUFBSSxDQUFDLGlEQUFpRCxDQUFDLENBQUE7UUFDN0QsS0FBSyxDQUFDLElBQUksQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFBO1FBQ3hELEtBQUssSUFBSSxPQUFPLElBQUksU0FBUyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7WUFDMUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLE9BQU8sS0FBSyxDQUFDLENBQUE7WUFDOUIsSUFBSSxTQUFTLEdBQUcsTUFBTSxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ3BELElBQUksY0FBYyxHQUFHLE1BQU0sS0FBSyxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ2xFLEtBQUssSUFBSSxhQUFhLElBQUksY0FBYyxFQUFFLENBQUM7Z0JBQ3ZDLElBQUksT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUE7Z0JBQ2pELElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQyxDQUFBO2dCQUMzRCxJQUFJLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQ3ZCLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxPQUFPLE1BQU0sQ0FBQyxDQUFBO29CQUNyQyxLQUFLLENBQUMsSUFBSSxDQUFDLHlCQUF5QixPQUFPLElBQUksQ0FBQyxDQUFBO29CQUNoRCxLQUFLLENBQUMsSUFBSSxDQUFDLHNCQUFzQixhQUFhLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQTtvQkFDeEQsS0FBSyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUE7b0JBQ2pELEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7Z0JBQzVCLENBQUM7WUFDTCxDQUFDO1lBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN4QixDQUFDO1FBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNmLEVBQUUsQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUNyRCxDQUFDO0NBQUE7QUFFRCxJQUFJLEVBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNoYWluIGZyb20gXCIuLi9zcmMvZXZtL2NvbnRyYWN0L2NoYWluXCJcbmltcG9ydCAqIGFzIGV4cGxvcmVyIGZyb20gXCIuLi9zcmMvZXZtL2NvbnRyYWN0L2V4cGxvcmVyXCJcbmltcG9ydCAqIGFzIHR4bmV0d29yayBmcm9tIFwiLi4vc3JjL3R4bmV0d29ya1wiXG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIlxuXG5jb25zdCBSRUdJU1RSWV9QQVRIID0gXCJzcmMvZXZtL2NvbnRyYWN0L3JlZ2lzdHJ5LnRzXCJcblxuYXN5bmMgZnVuY3Rpb24gbWFpbigpIHtcbiAgICBsZXQgbGluZXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpXG4gICAgbGluZXMucHVzaChgaW1wb3J0IHsgTmV0d29ya1JlZ2lzdHJ5IH0gZnJvbSBcIi4vaW50ZXJmYWNlXCJcXG5gKVxuICAgIGxpbmVzLnB1c2goXCJleHBvcnQgY29uc3QgcmVnaXN0cnk6IE5ldHdvcmtSZWdpc3RyeSA9IHtcIilcbiAgICBmb3IgKGxldCBuZXR3b3JrIG9mIHR4bmV0d29yay5nZXROZXR3b3JrcygpKSB7XG4gICAgICAgIGxpbmVzLnB1c2goYCAgICR7bmV0d29ya306IHtgKVxuICAgICAgICBsZXQgY29udHJhY3RzID0gYXdhaXQgZXhwbG9yZXIuZ2V0Q29udHJhY3RzKG5ldHdvcmspXG4gICAgICAgIGxldCBmbGFyZUNvbnRyYWN0cyA9IGF3YWl0IGNoYWluLmdldEZsYXJlTmV0d29ya0NvbnRyYWN0cyhuZXR3b3JrKVxuICAgICAgICBmb3IgKGxldCBmbGFyZUNvbnRyYWN0IG9mIGZsYXJlQ29udHJhY3RzKSB7XG4gICAgICAgICAgICBsZXQgYWRkcmVzcyA9IGZsYXJlQ29udHJhY3QuYWRkcmVzcy50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICBsZXQgY29udHJhY3QgPSBjb250cmFjdHMuZmlsdGVyKGMgPT4gYy5hZGRyZXNzID09PSBhZGRyZXNzKVxuICAgICAgICAgICAgaWYgKGNvbnRyYWN0Lmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgbGluZXMucHVzaChgICAgICAgICBcIiR7YWRkcmVzc31cIjoge2ApXG4gICAgICAgICAgICAgICAgbGluZXMucHVzaChgICAgICAgICAgICAgYWRkcmVzczogXCIke2FkZHJlc3N9XCIsYClcbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKGAgICAgICAgICAgICBuYW1lOiBcIiR7ZmxhcmVDb250cmFjdC5uYW1lfVwiLGApXG4gICAgICAgICAgICAgICAgbGluZXMucHVzaChgICAgICAgICAgICAgYWJpOiAke2NvbnRyYWN0WzBdLmFiaX1gKVxuICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goYCAgICAgICAgfSxgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxpbmVzLnB1c2goYCAgICB9LGApXG4gICAgfVxuICAgIGxpbmVzLnB1c2goXCJ9XCIpXG4gICAgZnMud3JpdGVGaWxlU3luYyhSRUdJU1RSWV9QQVRILCBsaW5lcy5qb2luKFwiXFxuXCIpKVxufVxuXG5tYWluKCkiXX0=