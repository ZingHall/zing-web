/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as object from './deps/sui/object';
import * as vec_set from './deps/sui/vec_set';
import * as type_name from './deps/std/type_name';
const $moduleName = '@local-pkg/zing_identity::config';
export const Config = new MoveStruct({ name: `${$moduleName}::Config`, fields: {
        id: object.UID,
        registry: vec_set.VecSet(type_name.TypeName),
        versions: vec_set.VecSet(bcs.u64()),
        base_read_fee: bcs.u64()
    } });
export interface PackageVersionOptions {
    package?: string;
    arguments?: [
    ];
}
export function packageVersion(options: PackageVersionOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'package_version',
    });
}
export interface BaseReadFeeArguments {
    self: RawTransactionArgument<string>;
}
export interface BaseReadFeeOptions {
    package?: string;
    arguments: BaseReadFeeArguments | [
        self: RawTransactionArgument<string>
    ];
}
export function baseReadFee(options: BaseReadFeeOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::config::Config`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'base_read_fee',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AddVersionArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    version: RawTransactionArgument<number | bigint>;
}
export interface AddVersionOptions {
    package?: string;
    arguments: AddVersionArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        version: RawTransactionArgument<number | bigint>
    ];
}
export function addVersion(options: AddVersionOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::admin::AdminCap`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["self", "Cap", "version"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'add_version',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RemoveVersionArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    version: RawTransactionArgument<number | bigint>;
}
export interface RemoveVersionOptions {
    package?: string;
    arguments: RemoveVersionArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        version: RawTransactionArgument<number | bigint>
    ];
}
export function removeVersion(options: RemoveVersionOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::admin::AdminCap`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["self", "Cap", "version"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'remove_version',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface UpdateReadFeeArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    fee: RawTransactionArgument<number | bigint>;
}
export interface UpdateReadFeeOptions {
    package?: string;
    arguments: UpdateReadFeeArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        fee: RawTransactionArgument<number | bigint>
    ];
}
export function updateReadFee(options: UpdateReadFeeOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::admin::AdminCap`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["self", "Cap", "fee"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'update_read_fee',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AssertVersionArguments {
    self: RawTransactionArgument<string>;
}
export interface AssertVersionOptions {
    package?: string;
    arguments: AssertVersionArguments | [
        self: RawTransactionArgument<string>
    ];
}
export function assertVersion(options: AssertVersionOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::config::Config`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'assert_version',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface DerivedObjectKeyArguments {
    name: RawTransactionArgument<string>;
}
export interface DerivedObjectKeyOptions {
    package?: string;
    arguments: DerivedObjectKeyArguments | [
        name: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function derivedObjectKey(options: DerivedObjectKeyOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        '0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String'
    ] satisfies string[];
    const parameterNames = ["name"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'derived_object_key',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
