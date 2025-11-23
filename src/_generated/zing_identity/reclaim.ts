/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as object from './deps/sui/object';
import * as object_table from './deps/sui/object_table';
import * as table from './deps/sui/table';
const $moduleName = '@local-pkg/zing_identity::reclaim';
export const ReclaimManager = new MoveStruct({ name: `${$moduleName}::ReclaimManager`, fields: {
        id: object.UID,
        witnesses: bcs.vector(bcs.vector(bcs.u8())),
        witnesses_num_threshold: bcs.u8(),
        commitments: object_table.ObjectTable,
        identifier_hash_to_commitment: table.Table,
        max_reveal_window: bcs.u64()
    } });
export const ClaimInfo = new MoveStruct({ name: `${$moduleName}::ClaimInfo`, fields: {
        provider: bcs.string(),
        parameters: bcs.string(),
        context: bcs.string()
    } });
export const ClaimData = new MoveStruct({ name: `${$moduleName}::ClaimData`, fields: {
        identifier: bcs.string(),
        owner: bcs.string(),
        epoch: bcs.string(),
        timestamp_s: bcs.string()
    } });
export const SignedClaim = new MoveStruct({ name: `${$moduleName}::SignedClaim`, fields: {
        claim: ClaimData,
        signatures: bcs.vector(bcs.vector(bcs.u8()))
    } });
export const Proof = new MoveStruct({ name: `${$moduleName}::Proof`, fields: {
        id: object.UID,
        claimed_at: bcs.u64(),
        claim_info: ClaimInfo,
        signed_claim: SignedClaim
    } });
export const ProofCommitment = new MoveStruct({ name: `${$moduleName}::ProofCommitment`, fields: {
        id: object.UID,
        commitment_hash: bcs.vector(bcs.u8()),
        committer: bcs.Address,
        commit_timestamp: bcs.u64(),
        identifier_hash: bcs.vector(bcs.u8())
    } });
export interface NewClaimInfoArguments {
    provider: RawTransactionArgument<string>;
    parameters: RawTransactionArgument<string>;
    context: RawTransactionArgument<string>;
}
export interface NewClaimInfoOptions {
    package?: string;
    arguments: NewClaimInfoArguments | [
        provider: RawTransactionArgument<string>,
        parameters: RawTransactionArgument<string>,
        context: RawTransactionArgument<string>
    ];
}
export function newClaimInfo(options: NewClaimInfoOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        '0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String',
        '0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String',
        '0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String'
    ] satisfies string[];
    const parameterNames = ["provider", "parameters", "context"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'new_claim_info',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ProviderArguments {
    claimInfo: RawTransactionArgument<string>;
}
export interface ProviderOptions {
    package?: string;
    arguments: ProviderArguments | [
        claimInfo: RawTransactionArgument<string>
    ];
}
export function provider(options: ProviderOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::ClaimInfo`
    ] satisfies string[];
    const parameterNames = ["claimInfo"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'provider',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ParametersArguments {
    claimInfo: RawTransactionArgument<string>;
}
export interface ParametersOptions {
    package?: string;
    arguments: ParametersArguments | [
        claimInfo: RawTransactionArgument<string>
    ];
}
export function parameters(options: ParametersOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::ClaimInfo`
    ] satisfies string[];
    const parameterNames = ["claimInfo"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'parameters',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ContextArguments {
    claimInfo: RawTransactionArgument<string>;
}
export interface ContextOptions {
    package?: string;
    arguments: ContextArguments | [
        claimInfo: RawTransactionArgument<string>
    ];
}
export function context(options: ContextOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::ClaimInfo`
    ] satisfies string[];
    const parameterNames = ["claimInfo"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'context',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface IdentifierArguments {
    claimData: RawTransactionArgument<string>;
}
export interface IdentifierOptions {
    package?: string;
    arguments: IdentifierArguments | [
        claimData: RawTransactionArgument<string>
    ];
}
export function identifier(options: IdentifierOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::ClaimData`
    ] satisfies string[];
    const parameterNames = ["claimData"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'identifier',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface OwnerArguments {
    claimData: RawTransactionArgument<string>;
}
export interface OwnerOptions {
    package?: string;
    arguments: OwnerArguments | [
        claimData: RawTransactionArgument<string>
    ];
}
export function owner(options: OwnerOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::ClaimData`
    ] satisfies string[];
    const parameterNames = ["claimData"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'owner',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface EpochArguments {
    claimData: RawTransactionArgument<string>;
}
export interface EpochOptions {
    package?: string;
    arguments: EpochArguments | [
        claimData: RawTransactionArgument<string>
    ];
}
export function epoch(options: EpochOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::ClaimData`
    ] satisfies string[];
    const parameterNames = ["claimData"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'epoch',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface TimestampSArguments {
    claimData: RawTransactionArgument<string>;
}
export interface TimestampSOptions {
    package?: string;
    arguments: TimestampSArguments | [
        claimData: RawTransactionArgument<string>
    ];
}
export function timestampS(options: TimestampSOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::ClaimData`
    ] satisfies string[];
    const parameterNames = ["claimData"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'timestamp_s',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NewClaimDataArguments {
    identifier: RawTransactionArgument<string>;
    owner: RawTransactionArgument<string>;
    epoch: RawTransactionArgument<string>;
    timestampS: RawTransactionArgument<number | bigint>;
}
export interface NewClaimDataOptions {
    package?: string;
    arguments: NewClaimDataArguments | [
        identifier: RawTransactionArgument<string>,
        owner: RawTransactionArgument<string>,
        epoch: RawTransactionArgument<string>,
        timestampS: RawTransactionArgument<number | bigint>
    ];
}
export function newClaimData(options: NewClaimDataOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        '0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String',
        '0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String',
        '0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String',
        'u64'
    ] satisfies string[];
    const parameterNames = ["identifier", "owner", "epoch", "timestampS"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'new_claim_data',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ClaimDataArguments {
    signedClaim: RawTransactionArgument<string>;
}
export interface ClaimDataOptions {
    package?: string;
    arguments: ClaimDataArguments | [
        signedClaim: RawTransactionArgument<string>
    ];
}
export function claimData(options: ClaimDataOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::SignedClaim`
    ] satisfies string[];
    const parameterNames = ["signedClaim"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'claim_data',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface SignaturesArguments {
    signedClaim: RawTransactionArgument<string>;
}
export interface SignaturesOptions {
    package?: string;
    arguments: SignaturesArguments | [
        signedClaim: RawTransactionArgument<string>
    ];
}
export function signatures(options: SignaturesOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::SignedClaim`
    ] satisfies string[];
    const parameterNames = ["signedClaim"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'signatures',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NewSignedClaimArguments {
    claim: RawTransactionArgument<string>;
    signatures: RawTransactionArgument<number[][]>;
}
export interface NewSignedClaimOptions {
    package?: string;
    arguments: NewSignedClaimArguments | [
        claim: RawTransactionArgument<string>,
        signatures: RawTransactionArgument<number[][]>
    ];
}
export function newSignedClaim(options: NewSignedClaimOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::ClaimData`,
        'vector<vector<u8>>'
    ] satisfies string[];
    const parameterNames = ["claim", "signatures"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'new_signed_claim',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ProofClaimedAtArguments {
    proof: RawTransactionArgument<string>;
}
export interface ProofClaimedAtOptions {
    package?: string;
    arguments: ProofClaimedAtArguments | [
        proof: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function proofClaimedAt(options: ProofClaimedAtOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::Proof<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["proof"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'proof_claimed_at',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ProofClaimInfoArguments {
    proof: RawTransactionArgument<string>;
}
export interface ProofClaimInfoOptions {
    package?: string;
    arguments: ProofClaimInfoArguments | [
        proof: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function proofClaimInfo(options: ProofClaimInfoOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::Proof<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["proof"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'proof_claim_info',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ProofSignedClaimArguments {
    proof: RawTransactionArgument<string>;
}
export interface ProofSignedClaimOptions {
    package?: string;
    arguments: ProofSignedClaimArguments | [
        proof: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function proofSignedClaim(options: ProofSignedClaimOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::Proof<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["proof"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'proof_signed_claim',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UpdateWitnessesArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    witnesses: RawTransactionArgument<number[][]>;
}
export interface UpdateWitnessesOptions {
    package?: string;
    arguments: UpdateWitnessesArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        witnesses: RawTransactionArgument<number[][]>
    ];
    typeArguments: [
        string
    ];
}
export function updateWitnesses(options: UpdateWitnessesOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::ReclaimManager<${options.typeArguments[0]}>`,
        `${packageAddress}::admin::AdminCap`,
        'vector<vector<u8>>'
    ] satisfies string[];
    const parameterNames = ["self", "Cap", "witnesses"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'update_witnesses',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UpdateWitnessesNumThresholdArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    witnessesNumThreshold: RawTransactionArgument<number>;
}
export interface UpdateWitnessesNumThresholdOptions {
    package?: string;
    arguments: UpdateWitnessesNumThresholdArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        witnessesNumThreshold: RawTransactionArgument<number>
    ];
    typeArguments: [
        string
    ];
}
export function updateWitnessesNumThreshold(options: UpdateWitnessesNumThresholdOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::ReclaimManager<${options.typeArguments[0]}>`,
        `${packageAddress}::admin::AdminCap`,
        'u8'
    ] satisfies string[];
    const parameterNames = ["self", "Cap", "witnessesNumThreshold"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'update_witnesses_num_threshold',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UpdateMaxRevealWindowArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    maxRevealWindow: RawTransactionArgument<number | bigint>;
}
export interface UpdateMaxRevealWindowOptions {
    package?: string;
    arguments: UpdateMaxRevealWindowArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        maxRevealWindow: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string
    ];
}
export function updateMaxRevealWindow(options: UpdateMaxRevealWindowOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::ReclaimManager<${options.typeArguments[0]}>`,
        `${packageAddress}::admin::AdminCap`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["self", "Cap", "maxRevealWindow"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'update_max_reveal_window',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface CleanupExpiredCommitmentsArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    commitmentIds: RawTransactionArgument<string[]>;
}
export interface CleanupExpiredCommitmentsOptions {
    package?: string;
    arguments: CleanupExpiredCommitmentsArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        commitmentIds: RawTransactionArgument<string[]>
    ];
    typeArguments: [
        string
    ];
}
export function cleanupExpiredCommitments(options: CleanupExpiredCommitmentsOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::ReclaimManager<${options.typeArguments[0]}>`,
        `${packageAddress}::admin::AdminCap`,
        'vector<0x0000000000000000000000000000000000000000000000000000000000000002::object::ID>',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["self", "Cap", "commitmentIds"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'cleanup_expired_commitments',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface BurnProofArguments {
    proof: RawTransactionArgument<string>;
}
export interface BurnProofOptions {
    package?: string;
    arguments: BurnProofArguments | [
        proof: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function burnProof(options: BurnProofOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::Proof<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["proof"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'burn_proof',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface CommitProofArguments {
    self: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
    commitmentHash: RawTransactionArgument<number[]>;
    identifierHash: RawTransactionArgument<number[]>;
}
export interface CommitProofOptions {
    package?: string;
    arguments: CommitProofArguments | [
        self: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        commitmentHash: RawTransactionArgument<number[]>,
        identifierHash: RawTransactionArgument<number[]>
    ];
    typeArguments: [
        string
    ];
}
export function commitProof(options: CommitProofOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::ReclaimManager<${options.typeArguments[0]}>`,
        `${packageAddress}::config::Config`,
        'vector<u8>',
        'vector<u8>',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["self", "config", "commitmentHash", "identifierHash"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'commit_proof',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RevealAndVerifyProofArguments {
    self: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
    commitmentId: RawTransactionArgument<string>;
    provider: RawTransactionArgument<string>;
    parameters: RawTransactionArgument<string>;
    context: RawTransactionArgument<string>;
    identifier: RawTransactionArgument<string>;
    owner: RawTransactionArgument<string>;
    epoch: RawTransactionArgument<string>;
    timestampS: RawTransactionArgument<number | bigint>;
    signatures: RawTransactionArgument<number[][]>;
    nonce: RawTransactionArgument<number[]>;
}
export interface RevealAndVerifyProofOptions {
    package?: string;
    arguments: RevealAndVerifyProofArguments | [
        self: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        commitmentId: RawTransactionArgument<string>,
        provider: RawTransactionArgument<string>,
        parameters: RawTransactionArgument<string>,
        context: RawTransactionArgument<string>,
        identifier: RawTransactionArgument<string>,
        owner: RawTransactionArgument<string>,
        epoch: RawTransactionArgument<string>,
        timestampS: RawTransactionArgument<number | bigint>,
        signatures: RawTransactionArgument<number[][]>,
        nonce: RawTransactionArgument<number[]>
    ];
    typeArguments: [
        string
    ];
}
export function revealAndVerifyProof(options: RevealAndVerifyProofOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::reclaim::ReclaimManager<${options.typeArguments[0]}>`,
        `${packageAddress}::config::Config`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::object::ID',
        '0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String',
        '0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String',
        '0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String',
        '0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String',
        '0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String',
        '0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String',
        'u64',
        'vector<vector<u8>>',
        'vector<u8>',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["self", "config", "commitmentId", "provider", "parameters", "context", "identifier", "owner", "epoch", "timestampS", "signatures", "nonce"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'reveal_and_verify_proof',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface BytesToHexArguments {
    bytes: RawTransactionArgument<number[]>;
}
export interface BytesToHexOptions {
    package?: string;
    arguments: BytesToHexArguments | [
        bytes: RawTransactionArgument<number[]>
    ];
}
export function bytesToHex(options: BytesToHexOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        'vector<u8>'
    ] satisfies string[];
    const parameterNames = ["bytes"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'reclaim',
        function: 'bytes_to_hex',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
