var aura;
var playerHP;
var roundCount;
var game;
var animating;
var changingLevels;

function newGame() {
    var bonesInRound = [];
    var bonesOnScreen = [];
    var spells = [];
    var enemy = {};
    var playerHPAtStart = playerHP;

    // Decide how many bones of how many types to use in this round.
    var numberOfBoneTypes = Math.floor(roundCount / 5) + 2;
    var numberOfBones = Math.floor(roundCount / 2) + 8;
    if (roundCount % 5 === 0) {
        numberOfBones += 2;
    }

    // Choose which bone images to use and their values.

    var boneSet = Math.floor(Math.random() * 4) + 1;
    var boneIds = ["a", "b", "c", "d", "e", "f"];
    var auras = [2, 3, 4, 5, 6, 7, 8, 9, 10];

    for (var i = 0; i < numberOfBoneTypes; i++) {
        var boneId = boneIds[Math.floor(Math.random() * boneIds.length)];
        boneIds.splice(boneIds.indexOf(boneId), 1);
        var image = "assets/images/bone" + boneSet + boneId + ".png";
        var rotation = Math.floor(Math.random() * 8) * 45;
        var boneAura = auras[Math.floor(Math.random() * auras.length)];
        auras.splice(auras.indexOf(boneAura), 1);
        bonesInRound.push({ image, rotation, aura: boneAura });
    }

    // Display player
    var player = $('#player');
    player.attr('src', 'assets/images/wizard-idle.gif');

    // Choose how many of each bone to display, and display them.
    $('#boneyard').empty();
    var bonesHeader = $('<h1>');
    bonesHeader.text('Bones');
    $('#boneyard').append(bonesHeader);
    $('#spellbook').empty();

    for (var i = 0; i < numberOfBones; i++) {
        var boneType = bonesInRound[Math.floor(Math.random() * bonesInRound.length)];
        var bone = $('<img>');
        bone.addClass('clickable');
        bone.attr('src', boneType.image);
        bone.css('transform', 'rotate(' + boneType.rotation + 'deg)');
        bone.css('float,left');
        bone.css('margin', '20px');
        bone.attr('width', '125px');
        bone.attr('aura', boneType.aura);
        bone.on('click', function () {
            // Do not allow overlapping animations. Do not allow repeat clicks.
            if (animating) {
                return;
            }
            animating = true;
            $(this).prop('onclick', null).off('click');

            // Increase aura and animate the aura bar, aura floating text, and the bone's disappearance.
            aura += parseInt($(this).attr('aura'));
            $('#auraText').text("+" + $(this).attr('aura'));
            $('#auraText').animate({
                top: '-5%',
                opacity: 0
            }, 800, 'linear', function () {
                $('#auraText').text("");
                $('#auraText').css('top', '20%');
                $('#auraText').css('opacity', '100');
            });
            $('#playerAura').text(aura);
            var maxAura = spells[spells.length - 1].attr('aura');
            $('#auraLevel').animate({
                width: (aura / maxAura) * 100 + '%'
            }, 800, 'linear');
            $(this).animate({
                opacity: 0.1
            }, 800, 'linear');
            $(this).removeClass('clickable');

            // Highlight a spell if the player's aura matches the spell's aura.
            for (var i = 0; i < spells.length; i++) {
                var spell = spells[i];
                var spellAura = parseInt(spell.attr('aura'));
                if (aura === spellAura) {
                    spell.css('border', 'solid 3px yellow');
                    spell.css('opacity', '1.0');
                    spell.addClass('clickable');
                }
                else {
                    spell.css('border', 'solid 3px #0006');
                    spell.css('opacity', '0.5');
                    spell.removeClass('clickable');
                }
            }

            // Enemy attacks
            if (game.enemy.enemyHP > 0) {
                $('#enemy').attr('src', 'assets/images/' + game.enemy.enemyName + '-attack.gif');
                if (roundCount === 20) {
                    $('#enemy').css('height', '500px');
                    $('#enemy').css('transform', 'translate(-200px,-250px)');
                }
                else {
                    $('#enemy').css('height', '120px');
                    $('#enemy').css('margin-top', '0px');
                    $('#enemy').css('transform', 'scaleX(-1) translateX(22px)');
                }

                // Enemy returns to idle animation
                setTimeout(function () {
                    $('#enemy').attr('src', 'assets/images/' + game.enemy.enemyName + '-idle.gif');
                    if (roundCount === 20) {
                        $('#enemy').css('height', '400px');
                        $('#enemy').css('transform', 'translate(-95px,-150px)');
                    }
                    else {
                        $('#enemy').css('height', '100px');
                        $('#enemy').css('margin-top', '36px');
                        $('#enemy').css('transform', 'scaleX(-1) translateX(0px)');
                    }

                    //Enemy takes DOT damage after attacking
                    if (game.enemy.dotDamage > 0) {

                        //Animate floating text
                        var oldEnemyPercent = 100 * (game.enemy.enemyHP / game.enemy.HPAtStart);
                        game.enemy.enemyHP -= game.enemy.dotDamage;
                        $('#enemyText').text("-" + game.enemy.dotDamage);
                        $('#enemyText').animate({
                            top: '-5%',
                            opacity: 0
                        }, 800, 'linear', function () {
                            $('#enemyText').text("");
                            $('#enemyText').css('top', '20%');
                            $('#enemyText').css('opacity', '100');
                            animating = false;
                        });

                        //Animate enemy health bar
                        var newEnemyPercent = 100 * (game.enemy.enemyHP / game.enemy.HPAtStart);
                        if (newEnemyPercent < 0) {
                            newEnemyPercent = 0;
                        }
                        $('#enemyHPLevel').css('width', newEnemyPercent + '%');
                        $('#enemyHPLostLevel').css('width', (oldEnemyPercent - newEnemyPercent) + '%');
                        $('#enemyHPLostLevel').animate({
                            width: 0
                        }, 800, 'linear');

                        //Death animation
                        if (game.enemy.enemyHP <= 0) {
                            $('#enemyHP').text('0');
                            $('#enemy').attr('src', 'assets/images/' + game.enemy.enemyName + '-dead.gif');
                            if (roundCount === 20) {
                                $('#enemy').css('transform', 'translate(-50px,-225px)');
                            }
                        }

                        //Hit animation
                        else {
                            $('#enemyHP').text(game.enemy.enemyHP);
                            $('#enemy').attr('src', 'assets/images/' + game.enemy.enemyName + '-hit.gif');
                            if (roundCount === 20) {
                                $('#enemy').css('transform', 'translate(-50px,-225px)');
                            }

                            //Return to idle
                            setTimeout(function () {
                                $('#enemy').attr('src', 'assets/images/' + game.enemy.enemyName + '-idle.gif');
                                if (roundCount === 20) {
                                    $('#enemy').css('transform', 'translate(-95px,-150px)');
                                }
                            }, 800);
                        }
                    }
                    else {
                        animating = false;
                    }
                }, 1800);

                //Player hit by attack
                setTimeout(function () {
                    var oldPercent = 100 * (playerHP / playerHPAtStart);
                    playerHP -= game.enemy.power;

                    //Player death animation
                    if (playerHP < 0) {
                        playerHP = 0;
                        $('#player').attr('src', 'assets/images/wizard-dead.gif');
                        setTimeout(function () {
                            animating = true;
                            message("GAME OVER");
                            setNewGame();
                        }, 1000);
                    }

                    //Animate floating text
                    $('#playerHP').text(playerHP);
                    $('#playerText').text("-" + game.enemy.power);
                    $('#playerText').css('color', 'rgb(255,60,60)');
                    $('#playerText').animate({
                        top: '-5%',
                        opacity: 0
                    }, 800, 'linear', function () {
                        $('#playerText').text('');
                        $('#playerText').css('top', '20%');
                        $('#playerText').css('opacity', '100');
                    });

                    //Animate player health bar
                    var newPercent = 100 * (playerHP / playerHPAtStart);
                    $('#playerHPLevel').css('width', newPercent + '%');
                    $('#playerHPLostLevel').css('width', (oldPercent - newPercent) + '%');
                    $('#playerHPLostLevel').animate({
                        width: 0
                    }, 800, 'linear');
                }, 800);
            }
            else {
                animating = false;
            }

        });
        $('#boneyard').append(bone);
        bonesOnScreen.push(bone);
    }

    // Create the spells available in this round.
    var spellsHeader = $('<h1>');
    spellsHeader.text('Spells');
    $('#spellbook').append(spellsHeader);
    var spellRow = $('<div>');
    spellRow.css('overflow', 'hidden');
    $('#spellbook').append(spellRow);

    var spellAura = 0;
    var spellOrNot = 0;
    var stepsWithNoSpell = 0;
    var hasShieldSpell = false;
    var firstBone = true;

    //Randomly choose a correct order for selecting bones
    for (var i = 0; i < bonesOnScreen.length;) {
        var index = Math.floor(Math.random() * bonesOnScreen.length);
        var bone = bonesOnScreen[index];
        bonesOnScreen.splice(index, 1);
        spellAura += parseInt(bone.attr('aura'));

        //Randomly choose whether to create a spell at this level, with a higher chance the more bones chosen without creating a spell
        spellOrNot += Math.floor(Math.random() * 4) + stepsWithNoSpell;
        stepsWithNoSpell += 1;

        //Create a spell
        if (spellOrNot > 5 || bonesOnScreen.length === 0 || firstBone) {
            var spellType;

            //The first bone chosen should only create a spell if the player has access to "frostbite" or "sight".
            //These spells are so beneficial that the chance of getting them should be low: the chance to guess the correct bone on the first try.
            if (firstBone) {
                firstBone = false;

                //"Frostbite" has a 50% chance of being available from level 11 onward.
                var firstSpell = Math.floor(Math.random() * 2);
                if (firstSpell === 0 && roundCount > 10) {
                    spellType = 4;
                }

                //"Sight" is available from level 16 onward, when "Frostbite" is not.
                else if (firstSpell === 1 && roundCount > 15) {
                    spellType = 5;
                }

                //Leave this iteration without creating a spell if neither "Frostbite" nor "Sight" is to be created.
                else {
                    continue;
                }
            }

            // Choose a random number between 0 and 3 if it is possible to get the spell "Shield"
            // "Shield" should only be available from level 6 onward, and only once per round.
            else if (!hasShieldSpell && roundCount > 5 && bonesOnScreen.length > 0) {
                spellType = Math.floor(Math.random() * 4);
            }

            // Choose a random number between 0 and 2 if "Shield" is unavailable.
            else {
                spellType = Math.floor(Math.random() * 3);
            }
            stepsWithNoSpell = 0;

            //Final spell, check if there are no damage dealing spells yet. 
            //Every round needs at least one damage dealing spell, so changes the spell type if needed.
            if (bonesOnScreen.length === 0) {
                var hasDamageSpell = false;
                for (var i = 0; i < spells.length; i++) {
                    var spell = spells[i];
                    if (spell.attr('src').indexOf('fireball') != -1) {
                        hasDamageSpell = true;
                        break;
                    }
                }
                if (!hasDamageSpell) {
                    spellType = 0;
                }
            }

            //Create a spell image element
            var spell = $('<img>');
            spell.attr('width', '100px');
            spell.attr('aura', spellAura);
            spell.css('margin', '20px');
            spell.css('border', 'solid 3px #0006');
            spell.css('opacity', '0.5');

            //Damage spells
            //50% chance if protect is available.
            //67% chance if protect is unavailable.
            if (spellType <= 1) {

                //Different spell images based on spell power
                if (spellAura < 20) {
                    spell.attr('src', 'assets/images/fireball-red-1.png');
                }
                else if (spellAura > 50) {
                    spell.attr('src', 'assets/images/fireball-red-3.png');
                }
                else {
                    spell.attr('src', 'assets/images/fireball-red-2.png');
                }

                // Create the spell
                spell.on('click', function () {

                    //Do not allow spell to be cast if sprites are animating.
                    if (animating) {
                        return;
                    }

                    //Only allow spell to cast if the player has the correct amount of aura.
                    var auraToCast = parseInt($(this).attr('aura'));
                    if (auraToCast === aura) {
                        animating = true;
                        if ($('#enemyHP').text() === '0') {
                            setTimeout(function () {
                                noMoreMoves();
                                animating = false;
                            }, 800);
                            return;
                        }

                        //Show sprite attack, fade out the spell 
                        var oldEnemyPercent = 100 * (game.enemy.enemyHP / game.enemy.HPAtStart);
                        game.enemy.enemyHP -= auraToCast;
                        $(this).fadeOut();
                        $('#spell-' + auraToCast).fadeOut();
                        $('#player').attr('src', 'assets/images/wizard-attack.gif');

                        //Return to idle sprite
                        setTimeout(function () {
                            $('#player').attr('src', 'assets/images/wizard-idle.gif');
                        }, 2000);
                        setTimeout(function () {

                            //Enemy dead animation
                            if (game.enemy.enemyHP <= 0) {
                                $('#enemyHP').text('0');
                                $('#enemy').attr('src', 'assets/images/' + game.enemy.enemyName + '-dead.gif');
                                if (roundCount === 20) {
                                    $('#enemy').css('transform', 'translate(-50px,-225px)');
                                }
                            }

                            //Enemy hit animation
                            else {
                                $('#enemyHP').text(game.enemy.enemyHP);
                                $('#enemy').attr('src', 'assets/images/' + game.enemy.enemyName + '-hit.gif');
                                if (roundCount === 20) {
                                    $('#enemy').css('transform', 'translate(-50px,-225px)');
                                }

                                //Enemy returns to idle after being hit
                                setTimeout(function () {
                                    $('#enemy').attr('src', 'assets/images/' + game.enemy.enemyName + '-idle.gif');
                                    if (roundCount === 20) {
                                        $('#enemy').css('transform', 'translate(-95px,-150px)');
                                    }
                                }, 800);
                            }

                            //Enemy damage floating text animation
                            $('#enemyText').text("-" + auraToCast);
                            $('#enemyText').animate({
                                top: '-5%',
                                opacity: 0
                            }, 800, 'linear', function () {
                                $('#enemyText').text('');
                                $('#enemyText').css('top', '20%');
                                $('#enemyText').css('opacity', '100');
                                animating = false;
                            });

                            //Enemy health bar animation
                            var newEnemyPercent = 100 * (game.enemy.enemyHP / game.enemy.HPAtStart);
                            if (newEnemyPercent < 0) {
                                newEnemyPercent = 0;
                            }
                            $('#enemyHPLevel').css('width', newEnemyPercent + '%');
                            $('#enemyHPLostLevel').css('width', (oldEnemyPercent - newEnemyPercent) + '%');
                            $('#enemyHPLostLevel').animate({
                                width: 0
                            }, 800, 'linear');
                        }, 1000);
                    }
                    // Check if there any any moves remaining.
                    setTimeout(noMoreMoves, 800);
                });
            }
            //Healing spells
            //25% chance if protect is available.
            //33% chance if protect is unavailable.
            else if (spellType === 2) {

                //Different spell images based on spell power
                if (spellAura < 20) {
                    spell.attr('src', 'assets/images/heal-royal-1.png');
                }
                else if (spellAura > 50) {
                    spell.attr('src', 'assets/images/heal-royal-3.png');
                }
                else {
                    spell.attr('src', 'assets/images/heal-royal-2.png');
                }

                // Create the spell
                spell.on('click', function () {

                    //Do not allow spell to be cast if sprites are animating.
                    if (animating) {
                        return;
                    }

                    //Only allow spell to cast if the player has the correct amount of aura.
                    var auraToCast = parseInt($(this).attr('aura'));
                    if (auraToCast === aura) {
                        //Player heal animation and spell fades out
                        animating = true;
                        $(this).fadeOut();
                        $('#spell-' + auraToCast).fadeOut();
                        $('#player').attr('src', 'assets/images/wizard-heal.gif');

                        //Player returns to idle sprite
                        setTimeout(function () {
                            playerHP += auraToCast;
                            $('#playerHP').text(playerHP);
                            $('#player').attr('src', 'assets/images/wizard-idle.gif');

                            //Player HP floating text animation
                            $('#playerText').text("+" + auraToCast);
                            $('#playerText').css('color', 'rgb(60,255,60)');
                            $('#playerText').animate({
                                top: '-5%',
                                opacity: 0
                            }, 800, 'linear', function () {
                                $('#playerText').text('');
                                $('#playerText').css('top', '20%');
                                $('#playerText').css('opacity', '100');
                                animating = false;
                            });

                            //Player health bar animation
                            var healedPercent = 100 * (playerHP / playerHPAtStart);
                            if (healedPercent <= 100) {
                                $('#playerHPLevel').animate({
                                    width: healedPercent + '%'
                                }, 800, 'linear');
                            }

                            //Resets the max health to current health if heals have brought the player higher than at first in the round
                            else{
                                playerHPAtStart = playerHP;
                                $('#playerHPLevel').animate({
                                    width: '115%'
                                },400, 'linear', function(){
                                    $('#playerHPLevel').animate({
                                        width: '100%'
                                    },400, 'linear');
                                });
                            }
                        }, 2000);
                    }
                    setTimeout(noMoreMoves, 800);
                });
            }

            // Shield spell
            // 25% chance if shield spell is available.
            else if (spellType === 3) {

                //Sets a boolean to prevent another shield spell from being added.
                hasShieldSpell = true;

                //Different spell images based on spell power
                if (spellAura < 20) {
                    spell.attr('src', 'assets/images/protect-jade-1.png');
                }
                else if (spellAura > 50) {
                    spell.attr('src', 'assets/images/protect-jade-3.png');
                }
                else {
                    spell.attr('src', 'assets/images/protect-jade-2.png');
                }

                // Create the spell
                spell.on('click', function () {

                    //Do not allow spell to be cast if sprites are animating.
                    if (animating) {
                        return;
                    }

                    //Only allow spell to cast if the player has the correct amount of aura.
                    var auraToCast = parseInt($(this).attr('aura'));
                    if (auraToCast === aura) {

                        //Player shield animation and spell fade out
                        animating = true;
                        $(this).fadeOut();
                        $('#spell-' + auraToCast).fadeOut();
                        $('#player').attr('src', 'assets/images/wizard-heal.gif');

                        setTimeout(function () {

                            //Enemy's attack power is decreased depending on the strength of the shield.
                            if (auraToCast < 20) {
                                game.enemy.power = Math.floor(game.enemy.power * 2 / 3);
                            }
                            else if (auraToCast > 50) {
                                game.enemy.power = Math.floor(game.enemy.power / 3);
                            }
                            else {
                                game.enemy.power = Math.floor(game.enemy.power / 2);
                            }

                            //Player returns to idle, "+Shield" floating text animation
                            $('#player').attr('src', 'assets/images/wizard-idle.gif');
                            $('#playerText').text("+Shield");
                            $('#playerText').css('color', 'rgb(60,60,255)');
                            $('#playerText').animate({
                                top: '-5%',
                                opacity: 0
                            }, 800, 'linear', function () {
                                $('#playerText').text('');
                                $('#playerText').css('top', '20%');
                                $('#playerText').css('opacity', '100');
                                animating = false;
                            });
                        }, 2000);
                    }
                    setTimeout(noMoreMoves, 800);
                });
            }

            // Frostbite spell
            // 50% chance as first spell from level 11 onward
            else if (spellType === 4) {
                spell.attr('src', 'assets/images/ice-blue-2.png');

                // Create the spell
                spell.on('click', function () {

                    //Do not allow spell to be cast if sprites are animating.
                    if (animating) {
                        return;
                    }

                    //Only allow spell to cast if the player has the correct amount of aura.
                    var auraToCast = parseInt($(this).attr('aura'));
                    if (auraToCast === aura) {
                        animating = true;

                        //This shouldn't be possible...
                        if ($('#enemyHP').text() === '0') {
                            setTimeout(function () {
                                noMoreMoves();
                                animating = false;
                            }, 800);
                            return;
                        }

                        //Changes the enemy's dotDamage property to the value of the aura cast.
                        //It will now be affected by DOT damage every time it attacks
                        game.enemy.dotDamage = auraToCast;

                        //Animate spell fadeout, player sprite attack to idle.
                        $(this).fadeOut();
                        $('#spell-' + auraToCast).fadeOut();
                        $('#player').attr('src', 'assets/images/wizard-attack.gif');
                        setTimeout(function () {
                            $('#player').attr('src', 'assets/images/wizard-idle.gif');
                        }, 2000);
                        setTimeout(function () {

                            //This shouldn't be possible...
                            if (game.enemy.enemyHP <= 0) {
                                $('#enemyHP').text('0');
                                $('#enemy').attr('src', 'assets/images/' + game.enemy.enemyName + '-dead.gif');
                            }

                            //Enemy sprite is hit by the spell
                            else {
                                $('#enemyHP').text(game.enemy.enemyHP);
                                $('#enemy').attr('src', 'assets/images/' + game.enemy.enemyName + '-hit.gif');
                                setTimeout(function () {
                                    $('#enemy').attr('src', 'assets/images/' + game.enemy.enemyName + '-idle.gif');
                                }, 800);
                            }

                            //"+Frostbite" flying text animation
                            $('#enemyText').text("+Frostbite");
                            $('#enemyText').animate({
                                top: '-5%',
                                opacity: 0
                            }, 800, 'linear', function () {
                                $('#enemyText').text('');
                                $('#enemyText').css('top', '20%');
                                $('#enemyText').css('opacity', '100');
                                animating = false;
                            });
                        }, 1000);
                    }

                    // Check if there any any moves remaining.
                    setTimeout(noMoreMoves, 800);
                });
            }

            // Sight spell
            // 50% chance as first spell from level 16 onward
            else if (spellType === 5) {
                spell.attr('src', 'assets/images/evil-eye-eerie-2.png');

                // Create the spell
                spell.on('click', function () {

                    //Do not allow spell to be cast if sprites are animating.
                    if (animating) {
                        return;
                    }

                    //Only allow spell to cast if the player has the correct amount of aura.
                    var auraToCast = parseInt($(this).attr('aura'));
                    if (auraToCast === aura) {

                        //Fades out spell and animates player's "heal" animation
                        animating = true;
                        $(this).fadeOut();
                        $('#spell-' + auraToCast).fadeOut();
                        $('#player').attr('src', 'assets/images/wizard-heal.gif');
                        setTimeout(function () {

                            //Grab all the bones on the field and add text with their aura values after each of them
                            //The CSS class "sightAura" will position them over the bone images.
                            var bonesInBoneyard = $('#boneyard img');
                            for (var i = 0; i < bonesInBoneyard.length; i++) {
                                var boneToSee = $(bonesInBoneyard[i]);
                                var auraToSee = $('<p>');
                                auraToSee.text(boneToSee.attr('aura'));
                                auraToSee.attr('class', 'sightAura');
                                boneToSee.after(auraToSee);
                            }

                            //Change to idle sprite, "+Sight" floating text animation
                            $('#player').attr('src', 'assets/images/wizard-idle.gif');
                            $('#playerText').text("+Sight");
                            $('#playerText').css('color', 'rgb(60,60,255)');
                            $('#playerText').animate({
                                top: '-5%',
                                opacity: 0
                            }, 800, 'linear', function () {
                                $('#playerText').text('');
                                $('#playerText').css('top', '20%');
                                $('#playerText').css('opacity', '100');
                                animating = false;
                            });
                        }, 2000);
                    }
                    setTimeout(noMoreMoves, 800);
                });
            }

            spells.push(spell);
            spellOrNot = 0;

            //Display spells
            var spellCol = $('<div>');
            spellCol.css('float', 'left');
            spellCol.append(spell);
            var spellAuraText = $('<p>');
            spellAuraText.text(spellAura);
            spellAuraText.attr('id', 'spell-' + spellAura);
            spellAuraText.css('margin', '0px');
            spellCol.append(spellAuraText);
            spellRow.append(spellCol);

        }
    }

    //Create enemy

    //Find player's maximum damage dealt with damage spells and HP healed with healing spells
    var maxDmgDealt = 0;
    var maxHpHealed = 0;
    for (var i = 0; i < spells.length; i++) {
        var spell = spells[i];
        if (spell.attr('src').indexOf('fireball') != -1) {
            maxDmgDealt += parseInt(spell.attr('aura'));
        }
        else if (spell.attr('src').indexOf('heal') != -1) {
            maxHpHealed += parseInt(spell.attr('aura'));
        }
    }

    //Select a random HP value for enemy at most equal to the maximum damage the player can deal.
    //(Must be max damage if the enemy is the final boss)
    var enemyHP = Math.floor(Math.random() * maxDmgDealt) + 1;
    if (roundCount === 20) {
        enemyHP = maxDmgDealt;
    }
    $('#enemyHP').text(enemyHP);

    //Select a random attack power for the enemy.
    //After all turns are taken the maximum damage the enemy can deal should be 2/3 the player's HP and half the player's healing capacity.
    var power = Math.floor(Math.random() * ((playerHP * 2 / 3) + (maxHpHealed / 2)) / numberOfBones) + 1;
    var enemyName = '';
    var enemyColor = 0;

    // Final boss enemy if player has reached round 20
    if (roundCount === 20) {
        enemyName = 'demon';
        $('#enemy').css('position', 'absolute');
        $('#enemy').css('height', '400px');
        $('#enemy').css('transform', 'translate(-95px,-150px)');
        $('#enemy').css('z-index', '1');
    }

    // Normal skeleton enemy
    else {
        enemyName = 'skeleton';
        $('#enemy').css('position', 'static');
        $('#enemy').css('height', '100px');
        $('#enemy').css('transform', 'scaleX(-1)');
        $('#enemy').css('filter', 'FlipH');

        //Make skeleton's color match bones
        switch (boneSet) {
            case 1:
                enemyColor = 200;
                break;
            case 2:
                break;
            case 3:
                enemyColor = 50;
                break;
            case 4:
                enemyColor = 100;
                break;
            default:
                console.log("Bone set is not recognized.")
        }
    }

    // Sprite to display at the start of the round
    var sprite = 'assets/images/' + enemyName + '-idle.gif';

    // This will be used if the enemy is afflicted with frostbite.
    var dotDamage = 0;

    $('#enemy').attr('src', sprite);
    $('#enemy').css('filter', 'hue-rotate(' + enemyColor + 'deg)');

    enemy = { enemyName, enemyHP, HPAtStart: enemyHP, power, dotDamage, sprite, enemyColor };

    // Display all info
    changingLevels = false;
    animating = false;
    aura = 0;
    $('#playerAura').text(aura);
    $('#playerHP').text(playerHP);
    $('#round').text(roundCount);

    //Reset aura/HP bars
    $('#auraLevel').animate({
        width: '0%'
    }, 800, 'linear');

    $('#playerHPLevel').animate({
        width: '100%'
    }, 800, 'linear');

    $('#enemyHPLevel').animate({
        width: '100%'
    }, 800, 'linear');

    //Add a crossbones to the round counter
    if(roundCount===1){
        $('.skullcross').remove();
        $('#round').after('<img id="currentRound" class="skullcross clickable" src="assets/images/skull.png">');
    }
    else{
        $('#currentRound').before($('<img class="skullcross clickable" src="assets/images/crossbones.png">'));
    }
    if (roundCount === 20) {
        $('#currentRound').attr('src', 'assets/images/boss-skull.png');
        $('#currentRound').css('width', '18%');
        $('#currentRound').css('top', '-30px');
    }


    return { bonesInRound, spells, enemy };
}

// Check if an image container is empty of fully opaque items.
function isEmpty(imgContainer) {
    for (var i = 0; i < imgContainer.length; i++) {
        var thisImg = $(imgContainer[i]);
        if (thisImg.css('opacity') === '1') {
            return false;
        }
    }
    return true;
}

// Check whether there are any more available moves.
function noMoreMoves() {
    if (isEmpty($('#boneyard img'))) {
        if (game.enemy.enemyHP <= 0) {
            if (changingLevels) {
                return;
            }
            changingLevels = true;
            var waitTime = 1200;
            if (animating) {
                waitTime = 3000;
            }
            setTimeout(function () {
                if (roundCount === 20) {
                    message("YOU WIN");
                    setNewGame();
                    return;
                }
                roundCount++;
                message("ROUND " + (roundCount));

                setTimeout(function () {
                    game = newGame();
                }, 2000);
            }, waitTime);
        }
        else {
            aura = 0;
            animating = true;
            setTimeout(function () {
                message("GAME OVER");
                setNewGame();
            }, 1000);
        }
    }
}

// Display a floating message to the center of the screen.
function message(messageText) {
    $('#message').text(messageText);
    setTimeout(function () {
        $('#message').animate({
            top: '20%',
            opacity: 0
        }, 1000, 'linear', function () {
            $('#message').text("");
            $('#message').css('top', '50%');
            $('#message').css('opacity', '100');
        });
    }, 800);
}

// Set up a new game to be started upon clicking the clickMe bone.
function setNewGame() {
    aura = 0;
    playerHP = 100;
    roundCount = 1;
    animating = false;
    changingLevels = false;

    $('#boneyard').empty();
    var bonesHeader = $('<h1>');
    bonesHeader.text('Bones');
    var bone = $('<img>');
    bone.addClass('clickable');
    bone.attr('id', 'clickMe');
    bone.attr('src', 'assets/images/bone2c.png');
    bone.attr('width', '125px');
    var text = $('<p>');
    text.text('Click the bone to begin a new game...')
    $('#boneyard').append(bonesHeader);
    $('#boneyard').append(bone);
    $('#boneyard').append($('<br>'));
    $('#boneyard').append(text);
    $('#clickMe').on('click', function () {
        game = newGame();
    });

}

$(document).ready(setNewGame());