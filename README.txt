# Snake

--- 17-1-2017 D-M-Y ---

This project started two years ago when I made a snake game while learning JavaScript.

Recently I looked at the code the 2 years younger version of myself made, and cringed.
So I made a fresh version of the game 'snake' with my current knowledge.
It should be called 'snake.html'. The old one should be called 'SnakeGameOld', (...html and ...js).

The end goal is to develop an algorithm that will beat the snake game everytime.

The restrictions to the algorithm are similar to a humans,
in the sense that the information given to it is limited.
Only including:

	* A two dimensional array of objects representing the squares of the game,
		with a boolean named 'taken' representing whether there is a snake in that tile.
	* A one dimensional array of objects representing the segments of the snake,
		in order from tail to head, each containing an 'x' and 'y' property.
	* A 'point' object named 'apple' representing the location of the apple,
		it contains two integer properties 'x' and 'y'.
		
In addition, it is only allowed to affect the game by simulating user-input.

# Checklist

Things I plan to add to the code:

	* Make a settings panel for the user, (I know how)
		possible variables they could change:

		* Game speed.
		* Number of columns.
		* Number of rows.
		* Colors. (Maybe)

	* Use an icon for the apple. 						(Maybe) (I know how)
	* Draw only what is needed to the canvas. 			(I know how)
	* A 'playerBot' which is described above. 			(I don't know how)
	
Things I have already added:

	* Simpler code from the original two years ago.
	* Removed sound effects. Ew.
	* Styled it a little better.
	
This entire document is subject to change at any time. (Especially if I make typos.)