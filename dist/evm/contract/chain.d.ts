import { BaseContractData } from "./interface";
export declare function getFlareNetworkContracts(network: number): Promise<Array<BaseContractData>>;
export declare function isFlareNetworkContract(network: number, address: string): Promise<boolean>;
export declare function getRawTransaction(network: number, txId: string): Promise<string | null>;
//# sourceMappingURL=chain.d.ts.map