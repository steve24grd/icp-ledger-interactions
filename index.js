// import ic from 'ic0';
import { replica, HttpAgent } from 'ic0';
// import fetch from "cross-fetch";
import fetch from 'isomorphic-fetch';
import { Principal } from '@dfinity/principal';
//import { HttpAgent } from "@dfinity/agent";
import * as bip39 from "bip39";
import HDKey from "hdkey";
import Secp256k1 from "secp256k1";
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
// import { IDL } from "@dfinity/candid";

const steve_principal_hex = "i47b4-sc7bd-bqhxw-ya2ap-jycdi-543vp-l7dpx-32svl-bl7ee-eyjgf-4qe";
const theo_principal_hex = "lvwvg-vchlg-pkyl5-hjj4h-ddnro-w5dqq-rvrew-ujp46-7mzgf-ea4ns-2qe";

const ledgerCanisterId= "ryjl3-tyaaa-aaaaa-aaaba-cai";
const indexCanisterId = "qhbym-qaaaa-aaaaa-aaafq-cai";

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
    host = "http://127.0.0.1:4943",
    // host = "https://ic0.app", //  this points to mainnet
) {
    const identity = getIdentityFromSeed(seedPhrase);

    // console.log("Principal: ", identity.getPrincipal().toString());

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

        // const seedPhrase = "spray delay lounge bridge shrug vote number wall rally market ketchup fragile minimum wood trade ceiling gravity speak famous beyond post dinner cave gain";
        const seedPhrase = "onion employ much happy grant train kid income either endless model cargo trap cost phrase avoid version dolphin coyote town fit thunder panther movie";
        const agent = createHostAgentAndIdentityFromSeed(seedPhrase);
        //
        // Instantiate AgentCanisters
        const ic = replica(agent, { local: true });
        const index = ic(indexCanisterId);
        const ledger = ic(ledgerCanisterId);

        //------------------------- GET NAME ----------------------------

        console.log(await ledger.call('name'));

        //------------------------- GET SUBACCOUNT-ID -------------------
        const account = {
            owner: Principal.fromText(
                steve_principal_hex,
            ),
            subaccount: [hex_to_bytes("0000000000000000000000000000000000000000000000000000000000000023")],
        };
        let result = await ledger.call(
            "account_identifier",
            account,
        );
        console.log(bytes_to_hex(result));
        //5d30c908a2c2852ac24d533e0c90fe0932e39992b08106ed77ac036443502b87

        // TO VERIFY SUBACCOUNT ID VIA CLI
        // dfx ledger account-id --of-principal <PRINCIPAL> --subaccount <32-BYTES-HEX>

        //------------------------- GET BALANCE (PRINCIPAL) -------------------------
        const account_1 = {
            owner: Principal.fromText(
                steve_principal_hex,
            ),
            subaccount: [],
        };

        // IDL wrapper is the alternative to manually encoding the arguments
        // const arg = IDL.encode(
        //     [
        //         IDL.Record({
        //             owner: IDL.Principal,
        //             subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        //         }),
        //     ],
        //     [account_1],
        // );


        result_1 = await ledger.call(
            "icrc1_balance_of",
            account_1,
        );

        console.log(result_1);

        //----------------------------- TRANSFER ICP ---------------------------------
        // when subaccount is not supplied, the default subaccount is used
        // default subaccount -> 0000000000000000000000000000000000000000000000000000000000000000
        let args = {
            from_subaccount: [],
            to: {
                owner: Principal.fromText(steve_principal_hex),
                subaccount: [hex_to_bytes("0000000000000000000000000000000000000000000000000000000000000023")],
            },
            amount: BigInt(3500000),
            fee: [],
            memo: [],
            created_at_time: [],
        };
        let result_2 = await ledger.call('icrc1_transfer', args);
        console.log(result_2);

        //----------------------------- BALANCE OF SUBACCOUNT ---------------------------------

        const account_3 = {
            owner: Principal.fromText(
                steve_principal_hex,
            ),
            subaccount: [hex_to_bytes("0000000000000000000000000000000000000000000000000000000000000023")],
        };

        let result_3 = await ledger.call(
            "icrc1_balance_of",
            account_3,
        );

        console.log(result_3);

        //---------------------------------- GET TXS --------------------------------
        const args_4 = {
            account: {
                owner: Principal.fromText(steve_principal_hex),
                subaccount: [],
            },
            start: [],
            max_results: 100,
        };

        let result_4 = await index.call("get_account_transactions", args);

        console.log(result_4);

        result_4.Ok.transactions.forEach ( (tx) => {
            console.log(tx.transaction.operation);
        });

        //-------------------------------- GET BLOCK --------------------------------
        const args_5 = {
            start: 0,
            length: 100,
        };

        let result_5 = await ledger.call("query_blocks", args);
        console.log(result_5.blocks[2]);
        console.log(result_5.blocks[2].transaction.operation);

    }
)();