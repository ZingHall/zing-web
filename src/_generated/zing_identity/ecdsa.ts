/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as object from './deps/sui/object';
const $moduleName = '@local-pkg/zing_identity::ecdsa';
export const VerifiedEvent = new MoveStruct({ name: `${$moduleName}::VerifiedEvent`, fields: {
        is_verified: bcs.bool()
    } });
export const Output = new MoveStruct({ name: `${$moduleName}::Output`, fields: {
        id: object.UID,
        value: bcs.vector(bcs.u8())
    } });
export interface Keccak256Arguments {
    data: RawTransactionArgument<number[]>;
    recipient: RawTransactionArgument<string>;
}
export interface Keccak256Options {
    package?: string;
    arguments: Keccak256Arguments | [
        data: RawTransactionArgument<number[]>,
        recipient: RawTransactionArgument<string>
    ];
}
/** Hash the data using Keccak256, output an object with the hash to recipient. */
export function keccak256(options: Keccak256Options) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        'vector<u8>',
        'address'
    ] satisfies string[];
    const parameterNames = ["data", "recipient"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'ecdsa',
        function: 'keccak256',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface EcrecoverArguments {
    signature: RawTransactionArgument<number[]>;
    msg: RawTransactionArgument<number[]>;
    recipient: RawTransactionArgument<string>;
}
export interface EcrecoverOptions {
    package?: string;
    arguments: EcrecoverArguments | [
        signature: RawTransactionArgument<number[]>,
        msg: RawTransactionArgument<number[]>,
        recipient: RawTransactionArgument<string>
    ];
}
/**
 * Recover the public key using the signature and message, assuming the signature
 * was produced over the Keccak256 hash of the message. Output an object with the
 * recovered pubkey to recipient.
 */
export function ecrecover(options: EcrecoverOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        'vector<u8>',
        'vector<u8>',
        'address'
    ] satisfies string[];
    const parameterNames = ["signature", "msg", "recipient"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'ecdsa',
        function: 'ecrecover',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface EcrecoverToEthAddressArguments {
    signature: RawTransactionArgument<number[]>;
    msg: RawTransactionArgument<number[]>;
}
export interface EcrecoverToEthAddressOptions {
    package?: string;
    arguments: EcrecoverToEthAddressArguments | [
        signature: RawTransactionArgument<number[]>,
        msg: RawTransactionArgument<number[]>
    ];
}
/**
 * Recover the Ethereum address using the signature and message, assuming the
 * signature was produced over the Keccak256 hash of the message. Output an object
 * with the recovered address to recipient.
 */
export function ecrecoverToEthAddress(options: EcrecoverToEthAddressOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        'vector<u8>',
        'vector<u8>'
    ] satisfies string[];
    const parameterNames = ["signature", "msg"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'ecdsa',
        function: 'ecrecover_to_eth_address',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface Secp256k1VerifyArguments {
    signature: RawTransactionArgument<number[]>;
    publicKey: RawTransactionArgument<number[]>;
    msg: RawTransactionArgument<number[]>;
}
export interface Secp256k1VerifyOptions {
    package?: string;
    arguments: Secp256k1VerifyArguments | [
        signature: RawTransactionArgument<number[]>,
        publicKey: RawTransactionArgument<number[]>,
        msg: RawTransactionArgument<number[]>
    ];
}
/**
 * Verified the secp256k1 signature using public key and message assuming Keccak
 * was using when signing. Emit an is_verified event of the verification result.
 */
export function secp256k1Verify(options: Secp256k1VerifyOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        'vector<u8>',
        'vector<u8>',
        'vector<u8>'
    ] satisfies string[];
    const parameterNames = ["signature", "publicKey", "msg"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'ecdsa',
        function: 'secp256k1_verify',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
