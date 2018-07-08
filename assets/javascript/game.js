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

    // Choose how many of each bone to display, and displays them.
    $('#boneyard').empty();
    var bonesHeader = $('<h1>');
    bonesHeader.text('Bones');
    $('#boneyard').append(bonesHeader);
    $('#spellbook').empty();

    for (var i = 0; i < numberOfBones; i++) {
        var boneType = bonesInRound[Math.floor(Math.random() * bonesInRound.length)];
        var bone = $('<img>');
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

            // Increase aura and animate the bone's disappearance.
            aura += parseInt($(this).attr('aura'));
            $('#auraText').text("+" + $(this).attr('aura'));
            $('#auraText').animate({
                top: -100,
                opacity: 0
            }, 800, 'linear', function () {
                $('#auraText').text("");
                $('#auraText').css('top', '0');
                $('#auraText').css('opacity', '100');
            });
            $('#playerAura').text(aura);
            $(this).animate({
                opacity: 0.1
            }, 800, 'linear');

            // Highlights a spell if the player's aura matches the spell's aura.
            for (var i = 0; i < spells.length; i++) {
                var spell = spells[i];
                var spellAura = parseInt(spell.attr('aura'));
                if (aura === spellAura) {
                    spell.css('border', 'solid 3px yellow');
                    spell.css('opacity', '1.0');
                }
                else {
                    spell.css('border', 'solid 3px #0006');
                    spell.css('opacity', '0.5');
                }
            }

            // Enemy attacks
            if (game.enemy.enemyHP > 0) {
                $('#enemy').attr('src', 'assets/images/Skeleton Attack.gif');
                $('#enemy').css('height', '120px');
                $('#enemy').css('margin-top', '0px');
                $('#enemy').css('transform', 'scaleX(-1) translateX(22px)');
                setTimeout(function () {
                    $('#enemy').attr('src', 'assets/images/Skeleton Idle.gif');
                    $('#enemy').css('height', '100px');
                    $('#enemy').css('margin-top', '36px');
                    $('#enemy').css('transform', 'scaleX(-1) translateX(0px)');

                    //Enemy takes DOT damage after attacking
                    if (game.enemy.dotDamage > 0) {
                        game.enemy.enemyHP -= game.enemy.dotDamage;
                        $('#enemyText').text("-" + game.enemy.dotDamage);
                        $('#enemyText').animate({
                            top: -100,
                            opacity: 0
                        }, 800, 'linear', function () {
                            $('#enemyText').text("");
                            $('#enemyText').css('top', '0');
                            $('#enemyText').css('opacity', '100');
                            animating = false;
                        });
                        $('#enemyHP').text(game.enemy.enemyHP);
                        $('#enemy').attr('src', 'assets/images/Skeleton Hit.gif');
                        setTimeout(function () {
                            $('#enemy').attr('src', 'assets/images/Skeleton Idle.gif');
                        }, 800);
                    }
                    else {
                        animating = false;
                    }
                }, 1800);
                setTimeout(function () {
                    playerHP -= game.enemy.power;
                    if (playerHP < 0) {
                        playerHP = 0;
                        $('#player').attr('src', 'assets/images/wizard-dead.gif');
                        setTimeout(function () {
                            animating = true;
                            message("GAME OVER");
                            setNewGame();
                        }, 1000);
                    }
                    $('#playerHP').text(playerHP);
                    $('#playerText').text("-" + game.enemy.power);
                    $('#playerText').css('color', 'rgb(255,60,60)');
                    $('#playerText').animate({
                        top: -100,
                        opacity: 0
                    }, 800, 'linear', function () {
                        $('#playerText').text("");
                        $('#playerText').css('top', '0');
                        $('#playerText').css('opacity', '100');
                    });
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
    var hasProtect = false;
    var firstBone = true;

    for (var i = 0; i < bonesOnScreen.length;) {
        var index = Math.floor(Math.random() * bonesOnScreen.length);
        var bone = bonesOnScreen[index];
        bonesOnScreen.splice(index, 1);
        spellAura += parseInt(bone.attr('aura'));
        spellOrNot += Math.floor(Math.random() * 4) + stepsWithNoSpell;
        stepsWithNoSpell += 1;
        if (spellOrNot > 5 || bonesOnScreen.length === 0 || firstBone) {
            var spellType;
            if (firstBone) {
                firstBone = false;
                var firstSpell = Math.floor(Math.random() * 2);
                if (firstSpell === 0 && roundCount > 10) {
                    spellType = 4;
                }
                else if (firstSpell === 1 && roundCount > 15) {
                    spellType = 5;
                }
                else {
                    continue;
                }
            }
            else if (!hasProtect && roundCount > 5 && bonesOnScreen.length > 0) {
                spellType = Math.floor(Math.random() * 4);
            }
            else {
                spellType = Math.floor(Math.random() * 3);
            }
            stepsWithNoSpell = 0;

            //Final spell, check if there are no damage dealing spells yet
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

            var spell = $('<img>');
            spell.attr('width', '100px');
            spell.attr('aura', spellAura);
            spell.css('margin', '20px');
            spell.css('border', 'solid 3px #0006');
            spell.css('opacity', '0.5');

            //Damage spells
            if (spellType <= 1) {
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
                    if (animating) {
                        return;
                    }
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
                        game.enemy.enemyHP -= auraToCast;
                        $(this).fadeOut();
                        $('#spell-' + auraToCast).fadeOut();
                        $('#player').attr('src', 'assets/images/wizard-attack.gif');
                        setTimeout(function () {
                            $('#player').attr('src', 'assets/images/wizard-idle.gif');
                        }, 2000);
                        setTimeout(function () {
                            if (game.enemy.enemyHP <= 0) {
                                $('#enemyHP').text('0');
                                $('#enemy').attr('src', 'assets/images/Skeleton Dead.gif');
                            }
                            else {
                                $('#enemyHP').text(game.enemy.enemyHP);
                                $('#enemy').attr('src', 'assets/images/Skeleton Hit.gif');
                                setTimeout(function () {
                                    $('#enemy').attr('src', 'assets/images/Skeleton Idle.gif');
                                }, 800);
                            }
                            $('#enemyText').text("-" + auraToCast);
                            $('#enemyText').animate({
                                top: -100,
                                opacity: 0
                            }, 800, 'linear', function () {
                                $('#enemyText').text("");
                                $('#enemyText').css('top', '0');
                                $('#enemyText').css('opacity', '100');
                                animating = false;
                            });
                        }, 1000);
                    }
                    // Check if there any any moves remaining.
                    setTimeout(noMoreMoves, 800);
                });
            }
            //Healing spells
            else if (spellType === 2) {
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
                    if (animating) {
                        return;
                    }
                    var auraToCast = parseInt($(this).attr('aura'));
                    if (auraToCast === aura) {
                        animating = true;
                        $(this).fadeOut();
                        $('#spell-' + auraToCast).fadeOut();
                        $('#player').attr('src', 'assets/images/wizard-heal.gif');
                        setTimeout(function () {
                            playerHP += auraToCast;
                            $('#playerHP').text(playerHP);
                            $('#player').attr('src', 'assets/images/wizard-idle.gif');
                            $('#playerText').text("+" + auraToCast);
                            $('#playerText').css('color', 'rgb(60,60,255)');
                            $('#playerText').animate({
                                top: -100,
                                opacity: 0
                            }, 800, 'linear', function () {
                                $('#playerText').text("");
                                $('#playerText').css('top', '0');
                                $('#playerText').css('opacity', '100');
                                animating = false;
                            });
                            if ($('#enemyHP').text() != '0') {
                                $('#enemy').attr('src', 'assets/images/Skeleton React.gif');
                                setTimeout(function () {
                                    $('#enemy').attr('src', 'assets/images/Skeleton Idle.gif');
                                }, 300);
                            }
                        }, 2000);
                    }
                    setTimeout(noMoreMoves, 800);
                });
            }

            // Protect spells
            else if (spellType === 3) {
                hasProtect = true;
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
                    if (animating) {
                        return;
                    }
                    var auraToCast = parseInt($(this).attr('aura'));
                    if (auraToCast === aura) {
                        animating = true;
                        $(this).fadeOut();
                        $('#spell-' + auraToCast).fadeOut();
                        $('#player').attr('src', 'assets/images/wizard-heal.gif');
                        setTimeout(function () {
                            if (auraToCast < 20) {
                                game.enemy.power = Math.floor(game.enemy.power * 2 / 3);
                            }
                            else if (auraToCast > 50) {
                                game.enemy.power = Math.floor(game.enemy.power / 3);
                            }
                            else {
                                game.enemy.power = Math.floor(game.enemy.power / 2);
                            }
                            $('#player').attr('src', 'assets/images/wizard-idle.gif');
                            $('#playerText').text("+Shield");
                            $('#playerText').css('color', 'rgb(60,60,255)');
                            $('#playerText').animate({
                                top: -100,
                                opacity: 0
                            }, 800, 'linear', function () {
                                $('#playerText').text("");
                                $('#playerText').css('top', '0');
                                $('#playerText').css('opacity', '100');
                                animating = false;
                            });
                            if ($('#enemyHP').text() != '0') {
                                $('#enemy').attr('src', 'assets/images/Skeleton React.gif');
                                setTimeout(function () {
                                    $('#enemy').attr('src', 'assets/images/Skeleton Idle.gif');
                                }, 300);
                            }
                        }, 2000);
                    }
                    setTimeout(noMoreMoves, 800);
                });
            }

            // DOT spell
            else if (spellType === 4) {
                spell.attr('src', 'assets/images/ice-blue-2.png');
                // Create the spell
                spell.on('click', function () {
                    if (animating) {
                        return;
                    }
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
                        game.enemy.dotDamage = auraToCast;
                        $(this).fadeOut();
                        $('#spell-' + auraToCast).fadeOut();
                        $('#player').attr('src', 'assets/images/wizard-attack.gif');
                        setTimeout(function () {
                            $('#player').attr('src', 'assets/images/wizard-idle.gif');
                        }, 2000);
                        setTimeout(function () {
                            if (game.enemy.enemyHP <= 0) {
                                $('#enemyHP').text('0');
                                $('#enemy').attr('src', 'assets/images/Skeleton Dead.gif');
                            }
                            else {
                                $('#enemyHP').text(game.enemy.enemyHP);
                                $('#enemy').attr('src', 'assets/images/Skeleton Hit.gif');
                                setTimeout(function () {
                                    $('#enemy').attr('src', 'assets/images/Skeleton Idle.gif');
                                }, 800);
                            }
                            $('#enemyText').text("+Frostbite");
                            $('#enemyText').animate({
                                top: -100,
                                opacity: 0
                            }, 800, 'linear', function () {
                                $('#enemyText').text("");
                                $('#enemyText').css('top', '0');
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
            else if (spellType === 5) {
                spell.attr('src', 'assets/images/evil-eye-eerie-2.png');
                
                // Create the spell
                spell.on('click', function () {
                    if (animating) {
                        return;
                    }
                    var auraToCast = parseInt($(this).attr('aura'));
                    if (auraToCast === aura) {
                        animating = true;
                        $(this).fadeOut();
                        $('#spell-' + auraToCast).fadeOut();
                        $('#player').attr('src', 'assets/images/wizard-heal.gif');
                        setTimeout(function () {

                            var bonesInBoneyard = $('#boneyard img');
                            for(var i=0;i<bonesInBoneyard.length;i++){
                                var boneToSee = $(bonesInBoneyard[i]);
                                var auraToSee = $('<p>');
                                auraToSee.text(boneToSee.attr('aura'));
                                auraToSee.attr('class','sightAura');
                                boneToSee.after(auraToSee);
                            }

                            $('#player').attr('src', 'assets/images/wizard-idle.gif');
                            $('#playerText').text("+Sight");
                            $('#playerText').css('color', 'rgb(60,60,255)');
                            $('#playerText').animate({
                                top: -100,
                                opacity: 0
                            }, 800, 'linear', function () {
                                $('#playerText').text("");
                                $('#playerText').css('top', '0');
                                $('#playerText').css('opacity', '100');
                                animating = false;
                            });
                            if ($('#enemyHP').text() != '0') {
                                $('#enemy').attr('src', 'assets/images/Skeleton React.gif');
                                setTimeout(function () {
                                    $('#enemy').attr('src', 'assets/images/Skeleton Idle.gif');
                                }, 300);
                            }
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

    // Create enemy
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

    var enemyHP = Math.floor(Math.random() * maxDmgDealt) + 1;
    $('#enemyHP').text(enemyHP);
    var power = Math.floor(Math.random() * ((playerHP / 2) + maxHpHealed) / numberOfBones) + 1;
    var enemyName = 'Skeleton';
    var sprite = 'assets/images/Skeleton Idle.gif'

    //Make skeleton's color match bones
    var enemyColor = 0;
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

    var dotDamage = 0;

    $('#enemy').attr('src', sprite);
    $('#enemy').css('filter', 'hue-rotate(' + enemyColor + 'deg)');

    enemy = { enemyName, enemyHP, power, dotDamage, sprite, enemyColor };

    // Display all info
    changingLevels = false;
    animating = false;
    aura = 0;
    $('#playerAura').text(aura);
    $('#playerHP').text(playerHP);
    $('#round').text(roundCount);

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
                message("ROUND " + (roundCount + 1));
                roundCount++;
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