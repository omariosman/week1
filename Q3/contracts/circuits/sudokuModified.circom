// [assignment] please copy the entire modified sudoku.circom here
include "../../../contracts/circuits/RangeProof.circom";


    //[assignment] hint: you will need to initialize your RangeProof components here
    

    var componentsArrayNumber = 81;
    component RangeProofComponentsPuzzle[componentsArrayNumber];
    component RangeProofComponentsSolution[componentsArrayNumber];

    for (var i = 0; i < componentsArrayNumber; i++){
           RangeProofComponentsPuzzle[i] = RangeProof(32);
    }

    for (var i = 0; i < componentsArrayNumber; i++){
           RangeProofComponentsSolution[i] = RangeProof(32);
    }

    var componentCounter = 0;
    for (var i=0; i<9; i++) {
        for (var j=0; j<9; j++) {
            
            RangeProofComponentsPuzzle[componentCounter].range[0] <== 0;
            RangeProofComponentsPuzzle[componentCounter].range[1] <== 9;
            RangeProofComponentsPuzzle[componentCounter].in <== puzzle[i][j];
            assert (RangeProofComponentsPuzzle[componentCounter].out == 1);


            RangeProofComponentsSolution[componentCounter].range[0] <== 0;
            RangeProofComponentsSolution[componentCounter].range[1] <== 9;
            RangeProofComponentsSolution[componentCounter].in <== solution[i][j];
            assert (RangeProofComponentsSolution[componentCounter].out == 1);
            mul.a[i][j] <== puzzle[i][j];
            mul.b[i][j] <== solution[i][j];

            componentCounter = componentCounter + 1;
            

        }
    }






