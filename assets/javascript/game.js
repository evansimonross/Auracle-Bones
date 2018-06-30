var game = {
    mode:0,
    playerHP: 100,
    roundCount: 1,
    round: {},
    newRound: function(){
        var difficulty = 0;
        var aura = 0;
        var bonesInRound = [];
        var bonesOnScreen = [];
        var spells = [];
        var enemy = {};

        // Decide how many bones of how many types to use in this round.
        var numberOfBoneTypes = 0;
        var numberOfBones = 0;

        switch(difficulty){
            case 0 : 
                numberOfBoneTypes = 2;
                numberOfBones = 9;
                break;
            case 1 :
                numberOfBoneTypes = 3;
                numberOfBones = 10;
                break;
            case 2:
                numberofBoneTypes = 3;
                numberOfBones = 12;
                break;
            case 4:
                numberOfBoneTypes = 4;
                numberOfBones = 12;
                break;
            case 5:
                numberOfBoneTypes = 4;
                numberOfBones = 15;
                break;
            case 5:
                numberOfBoneTypes = 5;
                numbefOfBones = 15;
                break;
            case 6:
                numberOfBoneTypes = 5;
                numberOfBones = 20;
                break;
            case 7:
                numberOfBoneTypes = 6;
                numberOfBones = 20;
                break;
        }

        // Choose which bone images to use and their values.

        var boneSet = Math.floor(Math.random()*4)+1;
        var boneIds = ["a","b","c","d","e","f"];
        var auras = [2,3,4,5,6,7,8,9,10];

        for(var i=0;i<numberOfBoneTypes;i++){
            var boneId = boneIds[Math.floor(Math.random()*boneIds.length)];
            boneIds.splice(boneIds.indexOf(boneId),1);
            boneId = "../images/bone" + boneSet + boneId + ".png";
            var rotation = Math.floor(Math.random()*8)*45;
            var boneAura = auras[Math.floor(Math.random()*auras.length)];
            auras.splice(auras.indexOf(boneAura),1);
            bonesInRound.push({image: boneId, rotation, aura: boneAura});
        }

        // Choose how many of each bone to display.

        for(var i=0; i<numberOfBones;i++){
            var bone = bonesInRound[Math.floor(Math.random()*bonesInRound.length)];
            bonesOnScreen.push(JSON.parse(JSON.stringify(bone)));
        }


        this.round = {difficulty, aura, bonesInRound, bonesOnScreen, spells, enemy};
    }
};

game.newRound();
console.log(game.round);