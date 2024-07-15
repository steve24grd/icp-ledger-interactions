import { replica, HttpAgent } from 'ic0';
import fetch from 'isomorphic-fetch';
import * as bip39 from "bip39";
import HDKey from "hdkey";
import Secp256k1 from "secp256k1";
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { Principal } from '@dfinity/principal';

// Define the BIP44 derivation path for ICP.
const DERIVATION_PATH = "m/44'/223'/0'/0";

const getIdentityFromSeed = (mnemonic, index = 0) => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const masterKey = HDKey.fromMasterSeed(seed);

    // Derive the private and public keys using the BIP44 derivation path.
    const { privateKey } = masterKey.derive(`${DERIVATION_PATH}/${index}`);
    const publicKey = Secp256k1.publicKeyCreate(privateKey, false);

    console.log("publicKey: ", bytes_to_hex(publicKey));

    return Secp256k1KeyIdentity.fromKeyPair(publicKey, privateKey);
};

function createHostAgentAndIdentityFromSeed(
    seedPhrase,
    host = "https://ic0.app", //  this points to mainnet
) {
    const identity = getIdentityFromSeed(seedPhrase);

    // Initialize and return the HttpAgent with the generated identity.
    return new HttpAgent({
        host,
        identity,
        fetch,
        verifyQuerySignatures: false,
    });
}

function hex_to_bytes(hex) {
    return hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
}

function bytes_to_hex(bytes) {
    return Array.prototype.map.call(bytes, x => ('00' + x.toString(16)).slice(-2)).join('');
}

(
    async () => {
        const ledgerCanisterId = "mxzaz-hqaaa-aaaar-qaada-cai";
        const principal_hex = "pztcx-5wpjw-ko6rv-3cjff-466eb-4ywbn-a5jww-rs6yy-ypk4a-ceqfb-nqe";

        const seedPhrase = "onion employ much happy grant train kid income either endless model cargo trap cost phrase avoid version dolphin coyote town fit thunder panther movie";
        const agent = createHostAgentAndIdentityFromSeed(seedPhrase);
        //
        // Instantiate AgentCanisters
        const ic = replica(agent, { local: false });
        const ledger = ic(ledgerCanisterId);

        //------------------------- GET NAME ----------------------------

        // console.log(await ledger.call('icrc1_name'));

        //------------------------- GET FEE ----------------------------

        // console.log(await ledger.call('icrc1_fee'));

        //------------------------- GET BALANCE (PRINCIPAL) -------------------------
        const account_1 = {
            owner: Principal.fromText(
                principal_hex,
            ),
            subaccount: [],
        };

        const result_1 = await ledger.call(
            "icrc1_balance_of",
            account_1,
        );

        console.log(result_1);

        //----------------------------- TRANSFER ICP #1 ---------------------------------
        // when subaccount is not supplied, the default subaccount is used
        // default subaccount -> 0000000000000000000000000000000000000000000000000000000000000000
        // let args = {
        //     from_subaccount: [],
        //     to: {
        //         owner: Principal.fromText(principal_hex),
        //         subaccount: [],
        //     },
        //     amount: BigInt(3500000),
        //     fee: [],
        //     memo: [],
        //     created_at_time: [],
        // };
        // let result = await ledger.call('icrc1_transfer', args);
        // console.log(result);

        //----------------------------- TRANSFER ICP #2 ---------------------------------

        // let args = {
        //     from_subaccount: [],
        //     to: hex_to_bytes("5c8aea1a5c6b871125c5b876688f2c28483a37314717750f2175156742fd08d8"),
        //     amount: {
        //         e8s: BigInt(990000),
        //     }, 
        //     fee: {
        //         e8s: BigInt(10),
        //     },
        //     memo: 0,
        //     created_at_time: [],
        // };
        // let result_2 = await ledger.call('transfer', args);
        // console.log(result_2);        


    }
)();