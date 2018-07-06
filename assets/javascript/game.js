var aura = 0;
var playerHP = 100;
var roundCount = 1;
var game = {};
var animating = false;
var changingLevels = false;

function newGame() {
    var bonesInRound = [];
    var bonesOnScreen = [];
    var spells = [];
    var enemy = {};

    // Decide how many bones of how many types to use in this round.
    var numberOfBoneTypes = 0;
    var numberOfBones = 0;

    switch (roundCount) {
        case 1:
            numberOfBoneTypes = 2;
            numberOfBones = 9;
            break;
        case 2:
            numberOfBoneTypes = 2;
            numberOfBones = 10;
            break;
        case 3:
            numberOfBoneTypes = 3;
            numberOfBones = 10;
            break;
        case 4:
            numberOfBoneTypes = 3;
            numberOfBones = 12;
            break;
        case 5:
            numberOfBoneTypes = 3;
            numberOfBones = 15;
            break;
        case 6:
            numberOfBoneTypes = 4;
            numberOfBones = 15;
            break;
        case 7:
            numberOfBoneTypes = 4;
            numberOfBones = 18;
            break;
        case 8:
            numberOfBoneTypes = 5;
            numberOfBones = 18;
            break;
        case 9:
            numberOfBoneTypes = 5;
            numberOfBones = 25;
        case 10:
            numberOfBoneTypes = 6;
            numberOfBones = 30;
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
            // Do not allow overlapping animations
            if (animating) {
                return;
            }
            animating = true;
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
            $(this).fadeOut("slow");

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
                    animating = false;
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

            // Check if there any any moves remaining.
            setTimeout(noMoreMoves(), 1200);

        });
        $('#boneyard').append(bone);
        bonesOnScreen.push(bone);
    }

    var emptyBone = $('<img>');
    emptyBone.attr('src', 'assets/images/empty.png');
    emptyBone.css('float,left');
    emptyBone.css('margin', '20px');
    emptyBone.attr('width', '125px');
    emptyBone.attr('height', '125px');
    $('#boneyard').append(emptyBone);

    // Create the spells available in this round.

    var spellAura = 0;
    var spellOrNot = 0;
    var stepsWithNoSpell = 0;
    for (var i = 0; i < bonesOnScreen.length;) {
        var index = Math.floor(Math.random() * bonesOnScreen.length);
        var bone = bonesOnScreen[index];
        bonesOnScreen.splice(index, 1);
        spellAura += parseInt(bone.attr('aura'));
        spellOrNot += Math.floor(Math.random() * 5) + stepsWithNoSpell;
        if (spellOrNot > 5 || bonesOnScreen.length === 0) {
            var spellType = Math.floor(Math.random() * 2);

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
            if (spellType === 0) {
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
                    setTimeout(noMoreMoves(), 800);
                });
            }
            //Healing spells
            else if (spellType === 1) {
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
                            if (('#enemyHP').text() != '0') {
                                $('#enemy').attr('src', 'assets/images/Skeleton React.gif');
                                setTimeout(function () {
                                    $('#enemy').attr('src', 'assets/images/Skeleton Idle.gif');
                                }, 300);
                            }
                        }, 2000);
                    }
                    setTimeout(noMoreMoves(), 800);
                    if ($('#enemyHP').text() === '0') {
                        return;
                    }

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
            spellCol.append(spellAuraText);
            $('#spellbook').append(spellCol);

        }
    }
    var emptySpellCol = $('<div>');
    emptySpellCol.css('float', 'left');
    var emptySpell = $('<img>');
    emptySpell.attr('src', 'assets/images/empty.png');
    emptySpell.attr('width', '140px');
    emptySpell.attr('height', '192px');
    emptySpellCol.append(emptySpell);
    emptySpellCol.append($('<p>'));
    $('#spellbook').append(emptySpell);

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
    var power = Math.floor(maxHpHealed / numberOfBones) + 1;
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

    $('#enemy').attr('src', sprite);
    $('#enemy').css('filter', 'hue-rotate(' + enemyColor + 'deg)');

    enemy = { enemyName, enemyHP, power, sprite, enemyColor };

    // Display all info
    changingLevels = false;
    animating = false;
    aura = 0;
    $('#playerAura').text(aura);
    $('#playerHP').text(playerHP);
    $('#round').text(roundCount);

    return { bonesInRound, spells, enemy };
}

function isEmpty(imgContainer) {
    for (var i = 0; i < imgContainer.length; i++) {
        var thisImg = imgContainer[i];
        if (thisImg.getAttribute('src').indexOf('empty') >= 0) {
            return true;
        }
        else if (thisImg.getAttribute('style').indexOf('none') === -1) {
            return false;
        }
    }
}

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

function message(messageText) {
    $('#message').text(messageText);
    setTimeout(function () {
        $('#message').animate({
            top: '15%',
            opacity: 0
        }, 1000, 'linear', function () {
            $('#message').text("");
            $('#message').css('top', '40%');
            $('#message').css('opacity', '100');
        });
    }, 800);
}

function setNewGame(){
    $('#boneyard').empty();
    var bonesHeader = $('<h1>');
    bonesHeader.text('Bones');
    var bone = $('<img>');
    bone.attr('id','clickMe');
    bone.attr('src','assets/images/bone2c.png');
    bone.attr('width','125px');
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

setNewGame();

//$(document).ready( setNewGame() );