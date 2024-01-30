"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDescription = exports.isKnownType = exports.ADD_VALIDATOR_P = exports.ADD_DELEGATOR_P = exports.IMPORT_P = exports.EXPORT_P = exports.IMPORT_C = exports.EXPORT_C = exports.CONTRACT_CALL_C = exports.TRANSFER_C = void 0;
exports.TRANSFER_C = "transferC";
exports.CONTRACT_CALL_C = "contractCallC";
exports.EXPORT_C = "exportC";
exports.IMPORT_C = "importC";
exports.EXPORT_P = "exportP";
exports.IMPORT_P = "importP";
exports.ADD_DELEGATOR_P = "addDelegatorP";
exports.ADD_VALIDATOR_P = "addValidatorP";
function isKnownType(type) {
    return [
        exports.TRANSFER_C,
        exports.CONTRACT_CALL_C,
        exports.EXPORT_C,
        exports.IMPORT_C,
        exports.EXPORT_P,
        exports.IMPORT_P,
        exports.ADD_DELEGATOR_P,
        exports.ADD_VALIDATOR_P
    ].includes(type);
}
exports.isKnownType = isKnownType;
function getDescription(type) {
    switch (type) {
        case exports.TRANSFER_C: {
            return "Funds transfer on C-chain";
        }
        case exports.CONTRACT_CALL_C: {
            return "Contract call on C-chain";
        }
        case exports.EXPORT_C: {
            return "Export from C-chain";
        }
        case exports.IMPORT_C: {
            return "Import to C-chain";
        }
        case exports.EXPORT_P: {
            return "Export from P-chain";
        }
        case exports.IMPORT_P: {
            return "Import to P-chain";
        }
        case exports.ADD_DELEGATOR_P: {
            return "Stake on P-chain";
        }
        case exports.ADD_VALIDATOR_P: {
            return "Add validator on P-chain";
        }
        default: {
            return "Unkown transaction type";
        }
    }
}
exports.getDescription = getDescription;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHh0eXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3R4dHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBYSxRQUFBLFVBQVUsR0FBRyxXQUFXLENBQUE7QUFDeEIsUUFBQSxlQUFlLEdBQUcsZUFBZSxDQUFBO0FBQ2pDLFFBQUEsUUFBUSxHQUFHLFNBQVMsQ0FBQTtBQUNwQixRQUFBLFFBQVEsR0FBRyxTQUFTLENBQUE7QUFDcEIsUUFBQSxRQUFRLEdBQUcsU0FBUyxDQUFBO0FBQ3BCLFFBQUEsUUFBUSxHQUFHLFNBQVMsQ0FBQTtBQUNwQixRQUFBLGVBQWUsR0FBRyxlQUFlLENBQUE7QUFDakMsUUFBQSxlQUFlLEdBQUcsZUFBZSxDQUFBO0FBRTlDLFNBQWdCLFdBQVcsQ0FBQyxJQUFZO0lBQ3BDLE9BQU87UUFDSCxrQkFBVTtRQUNWLHVCQUFlO1FBQ2YsZ0JBQVE7UUFDUixnQkFBUTtRQUNSLGdCQUFRO1FBQ1IsZ0JBQVE7UUFDUix1QkFBZTtRQUNmLHVCQUFlO0tBQ2xCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3BCLENBQUM7QUFYRCxrQ0FXQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxJQUFZO0lBQ3ZDLFFBQVEsSUFBSSxFQUFFLENBQUM7UUFDWCxLQUFLLGtCQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2QsT0FBTywyQkFBMkIsQ0FBQTtRQUN0QyxDQUFDO1FBQ0QsS0FBSyx1QkFBZSxDQUFDLENBQUMsQ0FBQztZQUNuQixPQUFPLDBCQUEwQixDQUFBO1FBQ3JDLENBQUM7UUFDRCxLQUFLLGdCQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ1osT0FBTyxxQkFBcUIsQ0FBQTtRQUNoQyxDQUFDO1FBQ0QsS0FBSyxnQkFBUSxDQUFDLENBQUMsQ0FBQztZQUNaLE9BQU8sbUJBQW1CLENBQUE7UUFDOUIsQ0FBQztRQUNELEtBQUssZ0JBQVEsQ0FBQyxDQUFDLENBQUM7WUFDWixPQUFPLHFCQUFxQixDQUFBO1FBQ2hDLENBQUM7UUFDRCxLQUFLLGdCQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ1osT0FBTyxtQkFBbUIsQ0FBQTtRQUM5QixDQUFDO1FBQ0QsS0FBSyx1QkFBZSxDQUFDLENBQUMsQ0FBQztZQUNuQixPQUFPLGtCQUFrQixDQUFBO1FBQzdCLENBQUM7UUFDRCxLQUFLLHVCQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE9BQU8sMEJBQTBCLENBQUE7UUFDckMsQ0FBQztRQUNELE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDTixPQUFPLHlCQUF5QixDQUFBO1FBQ3BDLENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQztBQTlCRCx3Q0E4QkMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgVFJBTlNGRVJfQyA9IFwidHJhbnNmZXJDXCJcbmV4cG9ydCBjb25zdCBDT05UUkFDVF9DQUxMX0MgPSBcImNvbnRyYWN0Q2FsbENcIlxuZXhwb3J0IGNvbnN0IEVYUE9SVF9DID0gXCJleHBvcnRDXCJcbmV4cG9ydCBjb25zdCBJTVBPUlRfQyA9IFwiaW1wb3J0Q1wiXG5leHBvcnQgY29uc3QgRVhQT1JUX1AgPSBcImV4cG9ydFBcIlxuZXhwb3J0IGNvbnN0IElNUE9SVF9QID0gXCJpbXBvcnRQXCJcbmV4cG9ydCBjb25zdCBBRERfREVMRUdBVE9SX1AgPSBcImFkZERlbGVnYXRvclBcIlxuZXhwb3J0IGNvbnN0IEFERF9WQUxJREFUT1JfUCA9IFwiYWRkVmFsaWRhdG9yUFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0tub3duVHlwZSh0eXBlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gW1xuICAgICAgICBUUkFOU0ZFUl9DLFxuICAgICAgICBDT05UUkFDVF9DQUxMX0MsXG4gICAgICAgIEVYUE9SVF9DLFxuICAgICAgICBJTVBPUlRfQyxcbiAgICAgICAgRVhQT1JUX1AsXG4gICAgICAgIElNUE9SVF9QLFxuICAgICAgICBBRERfREVMRUdBVE9SX1AsXG4gICAgICAgIEFERF9WQUxJREFUT1JfUFxuICAgIF0uaW5jbHVkZXModHlwZSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlc2NyaXB0aW9uKHR5cGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgVFJBTlNGRVJfQzoge1xuICAgICAgICAgICAgcmV0dXJuIFwiRnVuZHMgdHJhbnNmZXIgb24gQy1jaGFpblwiXG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBDT05UUkFDVF9DQUxMX0M6IHtcbiAgICAgICAgICAgIHJldHVybiBcIkNvbnRyYWN0IGNhbGwgb24gQy1jaGFpblwiXG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBFWFBPUlRfQzoge1xuICAgICAgICAgICAgcmV0dXJuIFwiRXhwb3J0IGZyb20gQy1jaGFpblwiXG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBJTVBPUlRfQzoge1xuICAgICAgICAgICAgcmV0dXJuIFwiSW1wb3J0IHRvIEMtY2hhaW5cIlxuICAgICAgICB9XG4gICAgICAgIGNhc2UgRVhQT1JUX1A6IHtcbiAgICAgICAgICAgIHJldHVybiBcIkV4cG9ydCBmcm9tIFAtY2hhaW5cIlxuICAgICAgICB9XG4gICAgICAgIGNhc2UgSU1QT1JUX1A6IHtcbiAgICAgICAgICAgIHJldHVybiBcIkltcG9ydCB0byBQLWNoYWluXCJcbiAgICAgICAgfVxuICAgICAgICBjYXNlIEFERF9ERUxFR0FUT1JfUDoge1xuICAgICAgICAgICAgcmV0dXJuIFwiU3Rha2Ugb24gUC1jaGFpblwiXG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBBRERfVkFMSURBVE9SX1A6IHtcbiAgICAgICAgICAgIHJldHVybiBcIkFkZCB2YWxpZGF0b3Igb24gUC1jaGFpblwiXG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgcmV0dXJuIFwiVW5rb3duIHRyYW5zYWN0aW9uIHR5cGVcIlxuICAgICAgICB9XG4gICAgfVxufSJdfQ==