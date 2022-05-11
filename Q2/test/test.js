const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16 } = require("snarkjs");
const { plonk } = require("snarkjs");
//var bump = require("../scripts/bump-solidity");


function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    
   
    let Verifier;
    let verifier;

    beforeEach(async function () {
        
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        
        //call the function in the contract and give it two inputs a and b with values 1 and 2 respectively
        //The fullprove functions spits out two outputs which are the proof itself and the output signal of the circuit
        //It stores them in proof and publicSignals respectively
        //publicSignals = Output
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");

        //console.log("proof: ", proof);
        //console.log("public isg: ", publicSignals);
        //print on the screen 1x2 = 2
        //console.log('1x2 =',publicSignals[0]);

        //unstringifyBigInts is a function that takes the output of the circuit and cast its type to BigInts
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);


        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        //console.log("call data: ", calldata);

        //splitting the elements into separate elements then replace all the brackets with empty string
        //convert hex to BigInt then converts the BigInts to string
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        //console.log("argv: ", argv);

        const a = [argv[0], argv[1]];
        //console.log("a: ", a);

        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        //console.log("b: ", b);
        
        const c = [argv[6], argv[7]];
        //console.log("c: ", c);

        const Input = argv.slice(8);
        //console.log("Input: ", Input);

        //verifier
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {

 
    let Verifier;
    let verifier;

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("Multiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        
        //call the function in the contract and give it two inputs a and b with values 1 and 2 respectively
        //The fullprove functions spits out two outputs which are the proof itself and the output signal of the circuit
        //It stores them in proof and publicSignals respectively
        //publicSignals = Output
        
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2", "c": "3"}, "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3/circuit_final.zkey");

        //console.log("proof: ", proof);
        //console.log("public isg: ", publicSignals);
        //print on the screen 1x2 = 2
        //console.log('1x2x3 =',publicSignals[0]);

        //unstringifyBigInts is a function that takes the output of the circuit and cast its type to BigInts
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);


        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        //console.log("call data: ", calldata);

        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        //console.log("argv: ", argv);

        //input a
        const a = [argv[0], argv[1]];
        //console.log("a: ", a);

        //input b
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        //console.log("b: ", b);
        
        //input c
        const c = [argv[6], argv[7]];
        //console.log("c: ", c);

        //the output of the circuit which is the input of the proof
        const Input = argv.slice(8);
        //console.log("Input: ", Input);


        //verify the proof is correct
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
        
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        //verify that the wrong proof will not pass
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
        
        
    });
});


describe("Multiplier3 with PLONK", function () {
 
    let Verifier;
    let verifier;

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("Multiplier3_plonkVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        
        //call the function in the contract and give it two inputs a and b with values 1 and 2 respectively
        //The fullprove functions spits out two outputs which are the proof itself and the output signal of the circuit
        //It stores them in proof and publicSignals respectively
        //publicSignals = Output
        
        const { proof, publicSignals } = await plonk.fullProve({"a":"1","b":"2", "c": "3"}, "contracts/circuits/Multiplier3_plonk/Multiplier3_plonk_js/Multiplier3_plonk.wasm","contracts/circuits/Multiplier3_plonk/Multiplier3_plonk.zkey");

        //console.log("proof: ", proof);
        //console.log("public isg: ", publicSignals);
        //print on the screen 1x2 = 2
        //console.log('1x2x3 =',publicSignals[0]);

        //unstringifyBigInts is a function that takes the output of the circuit and cast its type to BigInts
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);


        const calldata = await plonk.exportSolidityCallData(editedProof, editedPublicSignals);
        /*console.log("call data: ", calldata);
        console.log("call[0]", typeof(calldata[0]));
        console.log("call[1]", typeof(calldata[1]));
*/
        //console.log("argv: ", argv);
        //const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());

        calldataSplit = calldata.split(',');
        const proofFormatted = calldataSplit[0]
        const publicSignalsFormatted = JSON.parse(calldataSplit[1]).map(x => BigInt(x).toString())
/*
        const a = [argv[0], argv[1]];

        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        
        const c = [argv[6], argv[7]];

        const Input = argv.slice(8);

        let arr = [a,b,c];
        let arr2 = Input;
        var myBuffer = [];
        var buffer = new Buffer(calldata[0], 'utf16le');
        for (var i = 0; i < buffer.length; i++) {
                myBuffer.push(buffer[i]);
            }
*/
        //verify that the right proof will pass
        expect(await verifier.verifyProof(proofFormatted, publicSignalsFormatted)).to.be.true;
        
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
    /*
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0];
        let arr = [a,b,c];
        let arr2 = [d];
        */
        let a = '0x00';
        let b = ['0'];
        //verify that the wrong proof will not pass
        expect(await verifier.verifyProof(a, b)).to.be.false;
        
        
    });
});