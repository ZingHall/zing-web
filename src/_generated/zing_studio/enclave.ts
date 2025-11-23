/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveTuple, MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index';
import { bcs, type BcsType } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as object from './deps/sui/object';
const $moduleName = '@local-pkg/zing_studio::enclave';
export const Pcrs = new MoveTuple({ name: `${$moduleName}::Pcrs`, fields: [bcs.vector(bcs.u8()), bcs.vector(bcs.u8()), bcs.vector(bcs.u8())] });
export const EnclaveConfig = new MoveStruct({ name: `${$moduleName}::EnclaveConfig`, fields: {
        id: object.UID,
        name: bcs.string(),
        pcrs: Pcrs,
        version: bcs.u64()
    } });
export const Enclave = new MoveStruct({ name: `${$moduleName}::Enclave`, fields: {
        id: object.UID,
        pk: bcs.vector(bcs.u8()),
        config_version: bcs.u64(),
        owner: bcs.Address
    } });
export function IntentMessage<T extends BcsType<any>>(...typeParameters: [
    T
]) {
    return new MoveStruct({ name: `${$moduleName}::IntentMessage<${typeParameters[0].name as T['name']}>`, fields: {
            intent: bcs.u8(),
            timestamp_ms: bcs.u64(),
            payload: typeParameters[0]
        } });
}
export interface CreateEnclaveConfigArguments {
    Cap: RawTransactionArgument<string>;
    name: RawTransactionArgument<string>;
    pcr0: RawTransactionArgument<number[]>;
    pcr1: RawTransactionArgument<number[]>;
    pcr2: RawTransactionArgument<number[]>;
}
export interface CreateEnclaveConfigOptions {
    package?: string;
    arguments: CreateEnclaveConfigArguments | [
        Cap: RawTransactionArgument<string>,
        name: RawTransactionArgument<string>,
        pcr0: RawTransactionArgument<number[]>,
        pcr1: RawTransactionArgument<number[]>,
        pcr2: RawTransactionArgument<number[]>
    ];
}
export function createEnclaveConfig(options: CreateEnclaveConfigOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::admin::AdminCap`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
        'vector<u8>',
        'vector<u8>',
        'vector<u8>'
    ] satisfies string[];
    const parameterNames = ["Cap", "name", "pcr0", "pcr1", "pcr2"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'enclave',
        function: 'create_enclave_config',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RegisterEnclaveArguments {
    enclaveConfig: RawTransactionArgument<string>;
    document: RawTransactionArgument<string>;
}
export interface RegisterEnclaveOptions {
    package?: string;
    arguments: RegisterEnclaveArguments | [
        enclaveConfig: RawTransactionArgument<string>,
        document: RawTransactionArgument<string>
    ];
}
export function registerEnclave(options: RegisterEnclaveOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::enclave::EnclaveConfig`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::nitro_attestation::NitroAttestationDocument'
    ] satisfies string[];
    const parameterNames = ["enclaveConfig", "document"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'enclave',
        function: 'register_enclave',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface VerifySignatureArguments<P extends BcsType<any>> {
    enclave: RawTransactionArgument<string>;
    intentScope: RawTransactionArgument<number>;
    timestampMs: RawTransactionArgument<number | bigint>;
    payload: RawTransactionArgument<P>;
    signature: RawTransactionArgument<number[]>;
}
export interface VerifySignatureOptions<P extends BcsType<any>> {
    package?: string;
    arguments: VerifySignatureArguments<P> | [
        enclave: RawTransactionArgument<string>,
        intentScope: RawTransactionArgument<number>,
        timestampMs: RawTransactionArgument<number | bigint>,
        payload: RawTransactionArgument<P>,
        signature: RawTransactionArgument<number[]>
    ];
    typeArguments: [
        string
    ];
}
export function verifySignature<P extends BcsType<any>>(options: VerifySignatureOptions<P>) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::enclave::Enclave`,
        'u8',
        'u64',
        `${options.typeArguments[0]}`,
        'vector<u8>'
    ] satisfies string[];
    const parameterNames = ["enclave", "intentScope", "timestampMs", "payload", "signature"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'enclave',
        function: 'verify_signature',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UpdatePcrsWithDocumentArguments {
    config: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    document: RawTransactionArgument<string>;
}
export interface UpdatePcrsWithDocumentOptions {
    package?: string;
    arguments: UpdatePcrsWithDocumentArguments | [
        config: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        document: RawTransactionArgument<string>
    ];
}
export function updatePcrsWithDocument(options: UpdatePcrsWithDocumentOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::enclave::EnclaveConfig`,
        `${packageAddress}::admin::AdminCap`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::nitro_attestation::NitroAttestationDocument'
    ] satisfies string[];
    const parameterNames = ["config", "Cap", "document"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'enclave',
        function: 'update_pcrs_with_document',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface UpdatePcrsArguments {
    config: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    pcr0: RawTransactionArgument<number[]>;
    pcr1: RawTransactionArgument<number[]>;
    pcr2: RawTransactionArgument<number[]>;
}
export interface UpdatePcrsOptions {
    package?: string;
    arguments: UpdatePcrsArguments | [
        config: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        pcr0: RawTransactionArgument<number[]>,
        pcr1: RawTransactionArgument<number[]>,
        pcr2: RawTransactionArgument<number[]>
    ];
}
export function updatePcrs(options: UpdatePcrsOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::enclave::EnclaveConfig`,
        `${packageAddress}::admin::AdminCap`,
        'vector<u8>',
        'vector<u8>',
        'vector<u8>'
    ] satisfies string[];
    const parameterNames = ["config", "Cap", "pcr0", "pcr1", "pcr2"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'enclave',
        function: 'update_pcrs',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface UpdateNameArguments {
    config: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    name: RawTransactionArgument<string>;
}
export interface UpdateNameOptions {
    package?: string;
    arguments: UpdateNameArguments | [
        config: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        name: RawTransactionArgument<string>
    ];
}
export function updateName(options: UpdateNameOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::enclave::EnclaveConfig`,
        `${packageAddress}::admin::AdminCap`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::string::String'
    ] satisfies string[];
    const parameterNames = ["config", "Cap", "name"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'enclave',
        function: 'update_name',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface Pcr0Arguments {
    config: RawTransactionArgument<string>;
}
export interface Pcr0Options {
    package?: string;
    arguments: Pcr0Arguments | [
        config: RawTransactionArgument<string>
    ];
}
export function pcr0(options: Pcr0Options) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::enclave::EnclaveConfig`
    ] satisfies string[];
    const parameterNames = ["config"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'enclave',
        function: 'pcr0',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface Pcr1Arguments {
    config: RawTransactionArgument<string>;
}
export interface Pcr1Options {
    package?: string;
    arguments: Pcr1Arguments | [
        config: RawTransactionArgument<string>
    ];
}
export function pcr1(options: Pcr1Options) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::enclave::EnclaveConfig`
    ] satisfies string[];
    const parameterNames = ["config"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'enclave',
        function: 'pcr1',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface Pcr2Arguments {
    config: RawTransactionArgument<string>;
}
export interface Pcr2Options {
    package?: string;
    arguments: Pcr2Arguments | [
        config: RawTransactionArgument<string>
    ];
}
export function pcr2(options: Pcr2Options) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::enclave::EnclaveConfig`
    ] satisfies string[];
    const parameterNames = ["config"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'enclave',
        function: 'pcr2',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface PkArguments {
    enclave: RawTransactionArgument<string>;
}
export interface PkOptions {
    package?: string;
    arguments: PkArguments | [
        enclave: RawTransactionArgument<string>
    ];
}
export function pk(options: PkOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::enclave::Enclave`
    ] satisfies string[];
    const parameterNames = ["enclave"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'enclave',
        function: 'pk',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface DestroyOldEnclaveArguments {
    e: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
}
export interface DestroyOldEnclaveOptions {
    package?: string;
    arguments: DestroyOldEnclaveArguments | [
        e: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>
    ];
}
export function destroyOldEnclave(options: DestroyOldEnclaveOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::enclave::Enclave`,
        `${packageAddress}::enclave::EnclaveConfig`
    ] satisfies string[];
    const parameterNames = ["e", "config"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'enclave',
        function: 'destroy_old_enclave',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface DeployOldEnclaveByOwnerArguments {
    e: RawTransactionArgument<string>;
}
export interface DeployOldEnclaveByOwnerOptions {
    package?: string;
    arguments: DeployOldEnclaveByOwnerArguments | [
        e: RawTransactionArgument<string>
    ];
}
export function deployOldEnclaveByOwner(options: DeployOldEnclaveByOwnerOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::enclave::Enclave`
    ] satisfies string[];
    const parameterNames = ["e"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'enclave',
        function: 'deploy_old_enclave_by_owner',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface PkToAddressArguments {
    pk: RawTransactionArgument<number[]>;
}
export interface PkToAddressOptions {
    package?: string;
    arguments: PkToAddressArguments | [
        pk: RawTransactionArgument<number[]>
    ];
}
export function pkToAddress(options: PkToAddressOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        'vector<u8>'
    ] satisfies string[];
    const parameterNames = ["pk"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'enclave',
        function: 'pk_to_address',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
