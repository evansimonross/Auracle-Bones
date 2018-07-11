# Auracle-Bones
A simple puzzle RPG game.

## How to Play
Each round, a set of bones will appear under the "Bones" header. They will come in 2-6 randomized shapes. Each unique shape has an associated "aura" value. When you click a bone, its aura is depleted and added to your aura meter at the top left of your screen. Every time you harvest a bone, the enemy attacks as well. 

Under the "Spells" header is a list of spells available in that round. Spells may only be cast when your aura meter is precisely at the value listed under the spell. The spell will be highlighted in yellow if it is available. Click it to cast.

Spells come in five varieties as of the current version:
* Damage: deals damage to the enemy equal to aura required to cast it. The icon is an orange fireball.
* Heal: heals the player equal to the aura required to cast it. The icon is a heart with a cross. 
* Shield: protects the player such that subsequent enemy attacks deal less damage. The icon is a green shield. Available from level 6 onward. 
* Frostbite: causes damage over time on the enemy, taken after each time the enemy attacks equal to the aura required to cast it. The icon is blue ice shards. Available from level 11 onward. 
* Sight: reveals the aura values for all bones on the field. The icon is a green eye. Available from level 16 onward.

The game is over if the player dies or runs out of useable spells without killing the enemy. You win if you beat the final boss at level 20.

## Project History
This project was a homework assignment for the Columbia Full Stack Web Development Coding Bootcamp, testing our preliminary ability to use JQuery. The project had two possible prompts we could choose from. One was a number guessing game in which the player had to figure out the values associated with images on a screen and add them up to an arbitrary goal. The other was a simple turn-based RPG game with hit-points and character images. After a conversation with a classmate on the subway home, I realized I wanted to somehow combine both prompts. Much brainstorming later, and I came up with the concept for Auracle Bones.

I had a big vision for this project, and I am very pleased with the way it turned out. It was challenging getting the complex behavior that I wanted out of the game, but with some patience and working step-by-step, I was able to accomplish what I had set out to do: to employ the number guessing game seemlessly as a battle mechanic for an RPG. I also believe that the concept could work for a more fleshed-out story-driven RPG sometime in the future. If any artists would be interested in a collaboration of sorts, please let me know!

If you found your way here, I hope you have fun playing around with this little game! If you have any ideas for improvement, don't be shy about letting me know or forking the project for yourself to play around with. Check out my [github.io](https://evansimonross.github.io/) page for more info about me and my other projects.

## Credits
This project would not have been possible if not for the myriad free-to-use artwork available on the web. I am no kind of visual artist, unlike the following generous creators:
* Bone and skull vectors found on [Vecteezy](https://www.vecteezy.com/).
* Spell art by [J. W. Bjerk (eleazzaar)](http://www.jwbjerk.com/art). Found on [Open Game Art.org](https://opengameart.org/content/painterly-spell-icons-part-1).
* Wizard sprites by [Calciumtrice](http://calciumtrice.tumblr.com/) Found on [Open Game Art.org](https://opengameart.org/content/animated-wizard).
* Skeleton sprite by [Jesse M.](https://twitter.com/Jsf23Art) Found on [itch.io](https://jesse-m.itch.io/skeleton-pack).
* Demon sprite by Luis Zuno aka [Ansimuz](https://www.patreon.com/ansimuz/memberships). Found on [itch.io](https://ansimuz.itch.io/gothicvania-patreon-collection).
* Aura crystal sprite by [mieki256](http://blawat2015.no-ip.com/~mieki256/). Found on [Open Game Art.org](https://opengameart.org/users/mieki256).
* Background pattern from [Toptal Subtle Patterns](https://www.toptal.com/designers/subtlepatterns/tweed/).
* Sprite editing via <https://easygif.com> and <https://piskelapp.com>.