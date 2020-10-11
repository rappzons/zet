- Code
  - Refactor objectFactory to create enemy types instead of hardcoded enemies. Start with the virus-bal and the slime, should be one factory method.
  

- Movement
  - Character is colliding with the side-surface, making him not able to jump over walls that he "touches"....
  - Slide under stuff, press down should shrink the hitbox and animate a sliding player
  - Shoot or sword? go with sword for now....
  - Hurt animation
      
- World
  - built from the physics editor instead of hand made. Can make "custom world shapes" not just flat ground...         
  - Enemies... first off just make something hurt him... then create an NPC that can actually hurt him... commited the blue-demon to use for this...
   
  
- Game
  - medieval dungeon cleaner? Eggs and stuff are dropped down in a hole
    and the dude needs to hack away until he can get saved. slime, slugs, shit, eggs (with spawning enemies) will fall down...
    have a creature-meter or something that you need to kep down.
    
    AND multi player: have two dungeons on the same screen and you can toss the enemies you get to your opponent.
    or co-op and help out clearing out the dungenon...  
  - Game plot :)
    ideas:
    Use the physics!!! Not so much hack and slash or run and shoot, use physics in a "random" 
    way no gameplay should be exacly like the last... let say you go for a boss battle where there are physical objects laying all around and you have no weapon of your own
    - no learning the boss "patter" or using the correct weapon... just randomness and chaos
  - Player lives and health bar
  - Build overall game state: Menu, Paused, InGame, Level:1 ...etc..etc.
  
  ...  
- Enemies  
  1. enemies&players: walk through each other
  2. only hurt when one of them is attacking
  3. hurt -> force back
  4. health bars over all enemies
  
  AI
  1. Sentry enemy: fixed pos, hit when player is within range. timed animation (player should be able to avoid if he is fast)
   -> start with the blue deamon guy
   
  2. Pasing enemy: walks to A<->B and hits enemy when in range
  
  3. Flying Homing enemy: targets the player and goes through all world objects
  
  4. walking homing enemy: targets the player and collides with walls
  
  5. Boss/special. ...
    
