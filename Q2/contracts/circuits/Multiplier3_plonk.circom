pragma circom 2.0.0;

// [assignment] Modify the circuit below to perform a multiplication of three signals

template Multiplier3_plonk () {  

   // Declaration of signals.  
   signal input a;  
   signal input b;
   signal input c;
   signal mid;  
   signal output d;  


   // Constraints.  
   mid <== a * b;
   d <== mid *c;
}

component main = Multiplier3_plonk();