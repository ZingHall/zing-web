/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as object from './deps/sui/object';
import * as vec_set from './deps/sui/vec_set';
import * as type_name from './deps/std/type_name';
const $moduleName = '@local-pkg/zing_studio::config';
export const Config = new MoveStruct({ name: `${$moduleName}::Config`, fields: {
        id: object.UID,
        versions: vec_set.VecSet(bcs.u64()),
        allowed_works: vec_set.VecSet(type_name.TypeName),
        platform_fee_bps: bcs.u64(),
        allowed_stablecoins: vec_set.VecSet(type_name.TypeName),
        max_num_of_subscription_level: bcs.u8()
    } });
export interface PackageVersionOptions {
    package?: string;
    arguments?: [
    ];
}
export function packageVersion(options: PackageVersionOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'package_version',
    });
}
export interface FeeScalingOptions {
    package?: string;
    arguments?: [
    ];
}
export function feeScaling(options: FeeScalingOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'fee_scaling',
    });
}
export interface MonthDurationInWalrusEpochOptions {
    package?: string;
    arguments?: [
    ];
}
export function monthDurationInWalrusEpoch(options: MonthDurationInWalrusEpochOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'month_duration_in_walrus_epoch',
    });
}
export interface DayInMilliesecondOptions {
    package?: string;
    arguments?: [
    ];
}
export function dayInMilliesecond(options: DayInMilliesecondOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'day_in_milliesecond',
    });
}
export interface BlobExtendedDurationOptions {
    package?: string;
    arguments?: [
    ];
}
export function blobExtendedDuration(options: BlobExtendedDurationOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'blob_extended_duration',
    });
}
export interface AllowedWorksArguments {
    self: RawTransactionArgument<string>;
}
export interface AllowedWorksOptions {
    package?: string;
    arguments: AllowedWorksArguments | [
        self: RawTransactionArgument<string>
    ];
}
export function allowedWorks(options: AllowedWorksOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'allowed_works',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface PlatformFeeBpsArguments {
    self: RawTransactionArgument<string>;
}
export interface PlatformFeeBpsOptions {
    package?: string;
    arguments: PlatformFeeBpsArguments | [
        self: RawTransactionArgument<string>
    ];
}
export function platformFeeBps(options: PlatformFeeBpsOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'platform_fee_bps',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AllowedStablecoinsArguments {
    self: RawTransactionArgument<string>;
}
export interface AllowedStablecoinsOptions {
    package?: string;
    arguments: AllowedStablecoinsArguments | [
        self: RawTransactionArgument<string>
    ];
}
export function allowedStablecoins(options: AllowedStablecoinsOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'allowed_stablecoins',
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
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
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
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
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
export interface AddAllowedWorksArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
}
export interface AddAllowedWorksOptions {
    package?: string;
    arguments: AddAllowedWorksArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function addAllowedWorks(options: AddAllowedWorksOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::admin::AdminCap`
    ] satisfies string[];
    const parameterNames = ["self", "Cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'add_allowed_works',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RemoveAllowedWorksArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
}
export interface RemoveAllowedWorksOptions {
    package?: string;
    arguments: RemoveAllowedWorksArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function removeAllowedWorks(options: RemoveAllowedWorksOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::admin::AdminCap`
    ] satisfies string[];
    const parameterNames = ["self", "Cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'remove_allowed_works',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UpdatePlatformFeeBpsArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    platformFeeBps: RawTransactionArgument<number | bigint>;
}
export interface UpdatePlatformFeeBpsOptions {
    package?: string;
    arguments: UpdatePlatformFeeBpsArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        platformFeeBps: RawTransactionArgument<number | bigint>
    ];
}
export function updatePlatformFeeBps(options: UpdatePlatformFeeBpsOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::admin::AdminCap`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["self", "Cap", "platformFeeBps"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'update_platform_fee_bps',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AddAllowedStablecoinsArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
}
export interface AddAllowedStablecoinsOptions {
    package?: string;
    arguments: AddAllowedStablecoinsArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function addAllowedStablecoins(options: AddAllowedStablecoinsOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::admin::AdminCap`
    ] satisfies string[];
    const parameterNames = ["self", "Cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'add_allowed_stablecoins',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RemoveAllowedStablecoinsArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
}
export interface RemoveAllowedStablecoinsOptions {
    package?: string;
    arguments: RemoveAllowedStablecoinsArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function removeAllowedStablecoins(options: RemoveAllowedStablecoinsOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::admin::AdminCap`
    ] satisfies string[];
    const parameterNames = ["self", "Cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'remove_allowed_stablecoins',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
