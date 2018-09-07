## Significant Difficulties

Enabling and disabling noteboxes and the right time. Wanted to disable noteboxes while notes were playing, and enable them immidiately after.

## Code explanation

I added to the effects of play in the notebox api by modifying it to call passed in callback function if passed in when it is done
playing a note.

## How I approached and solved the problem

* First wrote helper functions I'd need e.g. for enabling the noteboxes or playing a note
* Focused on making the game run once at first then I made a game loop.
* Manually tested the code by playing the game trying to make sure every path through the code works which helped me catch a few bugs 
like game not restarting if you lost.

## What resources I used

Googled a few things to refersh my memory e.g. DOM manipulation to update the score
