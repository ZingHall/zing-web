/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as object from './deps/sui/object';
const $moduleName = '@local-pkg/zing_governance::treasury';
export const TreasurySupplyEvent = new MoveStruct({ name: `${$moduleName}::TreasurySupplyEvent`, fields: {
        coin_type: bcs.string(),
        value: bcs.u64()
    } });
export const TreasuryClaimEvent = new MoveStruct({ name: `${$moduleName}::TreasuryClaimEvent`, fields: {
        coin_type: bcs.string(),
        value: bcs.u64()
    } });
export const BalanceKey = new MoveStruct({ name: `${$moduleName}::BalanceKey`, fields: {
        dummy_field: bcs.bool()
    } });
export const Treasury = new MoveStruct({ name: `${$moduleName}::Treasury`, fields: {
        id: object.UID
    } });
export interface BalanceOfArguments {
    self: RawTransactionArgument<string>;
}
export interface BalanceOfOptions {
    package?: string;
    arguments: BalanceOfArguments | [
        self: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function balanceOf(options: BalanceOfOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_governance';
    const argumentsTypes = [
        `${packageAddress}::treasury::Treasury`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'treasury',
        function: 'balance_of',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SupplyTreasuryArguments {
    self: RawTransactionArgument<string>;
    balance: RawTransactionArgument<string>;
}
export interface SupplyTreasuryOptions {
    package?: string;
    arguments: SupplyTreasuryArguments | [
        self: RawTransactionArgument<string>,
        balance: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function supplyTreasury(options: SupplyTreasuryOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_governance';
    const argumentsTypes = [
        `${packageAddress}::treasury::Treasury`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::balance::Balance<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["self", "balance"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'treasury',
        function: 'supply_treasury',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ClaimArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    value: RawTransactionArgument<number | bigint>;
}
export interface ClaimOptions {
    package?: string;
    arguments: ClaimArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        value: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string
    ];
}
export function claim(options: ClaimOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_governance';
    const argumentsTypes = [
        `${packageAddress}::treasury::Treasury`,
        `${packageAddress}::admin::AdminCap`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["self", "Cap", "value"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'treasury',
        function: 'claim',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
