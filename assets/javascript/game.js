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
            boneId = "assets/images/bone" + boneSet + boneId + ".png";
            var rotation = Math.floor(Math.random()*8)*45;
            var boneAura = auras[Math.floor(Math.random()*auras.length)];
            auras.splice(auras.indexOf(boneAura),1);
            bonesInRound.push({image: boneId, rotation, aura: boneAura});
        }

        // Choose how many of each bone to display, and displays them.

        for(var i=0; i<numberOfBones;i++){
            var boneType = bonesInRound[Math.floor(Math.random()*bonesInRound.length)];
            var bone = $('<img>');
            bone.attr('src',boneType.image);
            bone.css('transform','rotate('+boneType.rotation+'deg)');
            bone.css('float,left');
            bone.attr('width','100px');
            bone.attr('aura',boneType.aura);
            bone.on('click',function(){

                // Increase aura and animate the bone's disappearance.
                aura += parseInt($(this).attr('aura'));
                $('#aura').text(aura);
                $(this).on('click,',function(){});
                $(this).fadeOut("slow");

            });
            $('#boneyard').append(bone);
            bonesOnScreen.push(bone);
        }

        // Create the spells available in this round.

        var spellAura = 0;
        var spellOrNot = 0;
        var stepsWithNoSpell = 0;
        for(var i=0;i<numberOfBones;i++){
            var index = Math.floor(Math.random()*bonesOnScreen.length);
            var bone = bonesOnScreen[index];
            bonesOnScreen.splice(index,1);
            spellAura += parseInt(bone.attr('aura'));
            spellOrNot += Math.floor(Math.random()*5)+stepsWithNoSpell;
            if(spellOrNot>5){
                var spellType = Math.floor(Math.random()*2);
                
                var spell = {
                    spellAura, spellType
                };

                //Damage spells
                if(spellType===0){
                    if(spellAura<20){
                        spell.spellImage="assets/images/fireball-red-1.png";
                    }
                    else if(spellAura>50){
                        spell.spellImage="assets/images/fireball-red-3.png";
                    }
                    else{
                        spell.spellImage="assets/images/fireball-red-2.png";
                    }
                    // Create the spell
                    spell.cast() = function(){
                        alert("Dealt " + this.spellAura + " damage");
                    }
                }
                //Healing spells
                else if(spellType===1){
                    if(spellAura<20){
                        spell.spellImage="assets/images/heal-royal-1.png";
                    }
                    else if(spellAura>50){
                        spell.spellImage="assets/images/heal-royal-3.png";
                    }
                    else{
                        spell.spellImage="assets/images/heal-royal-2.png";
                    }
                    // Create the spell
                    spell.cast() = function(){
                        alert("Healed " + this.spellAura + " hit points");
                    }
                }

                spells.push(spell);
                spellOrNot = 0;
            }
        }

        // Display the spells:
        

        this.round = {difficulty, aura, bonesInRound, bonesOnScreen, spells, enemy};
    }
};

game.newRound();