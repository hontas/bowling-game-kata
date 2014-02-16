Bowling Game Kata
=================
> Uncle Bob's classic implemented in *JavaScript*

[bowling-score]: http://www.wpclipart.com/recreation/sports/bowling/bowling_scoresheet_example.png "bowling score card"


## Scoring bowling

![Bowling scoreboard][bowling-score]

The game consists of 10 frames as shown above.  In each frame the player has
two opportunities to knock down 10 pins.  The score for the frame is the total
number of pins knocked down, plus bonuses for strikes and spares.

A spare is when the player knocks down all 10 pins in two tries.  The bonus for
that frame is the number of pins knocked down by the next roll.  So in frame 3
above, the score is 10 (the total number knocked down) plus a bonus of 5 (the
number of pins knocked down on the next roll.)

A strike is when the player knocks down all 10 pins on his first try.  The bonus
for that frame is the value of the next two balls rolled.

In the tenth frame a player who rolls a spare or strike is allowed to roll the extra
balls to complete the frame.  However no more than three balls can be rolled in
tenth frame.


## The requirements

* Write class "BowlingGame" that has two methods
	- *roll(pins)*
		- called each time the player rolls a ball. The argument is the number of pins knocked down.
	- *score()*
		- called only after the very end of the game. Returns total score of the game.


## Quick design session

One game  
A game has 10 frames  
A frame has one or two rolls  
The tenth frame has two or three rolls. It's different from all the other frames  
The score function must iterate through all the frames, and calculate all their scores  
The score for a spare or a strike depends on the frames successor


## Begin

* Create directory bowling-game
* Create bowlingGame.js
* Create bowlingGame-tests.js

```js
// bowlingGame-tests.js
describe("BowlingGame", function() {
	
});
```

Install and configure *karma test-runner*

```
npm install -g karma
npm install -g karma-mocha
npm install -g karma-chai
karma-init

	Testing framework: mocha
	Require.js: no
	Capture browser: PhantomJS
	Source and test files: *.js
	Excluded:
	Run tests on change: yes
```

Open the created configuration file and change `frameworks: ['mocha'],` to `frameworks: ['mocha', 'chai'],`.  
Kick-start the test runner typing `karma start` and hitting `ENTER`


## The first test

```js
describe("BowlingGame", function() {
	it("handle gutter game", function() {
		var game = new BowlingGame();
		for (var i = 0; i < 20; i++) {
			game.roll(0);
		}
		expect(game.score()).to.equal(0);
	});
});
```


## The second test

```js
describe("BowlingGame", function() {
	var game;

	beforeEach(function(){
		game = new BowlingGame();
	});

	function rollMany (n, pins) {
		for (var i = 0; i < n; i++) {
			game.roll(pins)
		}
	}

	it("handle gutter game", function() {
		rollMany(20, 0);
		expect(game.score()).to.equal(0);
	});

	it("should handle all ones", function() {
		rollMany(20, 1);
		expect(game.score()).to.equal(20);
	});
});
```


## The third test

```js
describe("BowlingGame", function() {
	var game;

	beforeEach(function(){
		game = new BowlingGame();
	});

	function rollMany (n, pins) {
		for (var i = 0; i < n; i++) {
			game.roll(pins)
		}
	}

	function rollSpare() {
		game.roll(5);
		game.roll(5);
	}

	it("handle gutter game", function() {
		rollMany(20, 0);
		expect(game.score()).to.equal(0);
	});

	it("should handle all ones", function() {
		rollMany(20, 1);
		expect(game.score()).to.equal(20);
	});

	it("should handle one spare", function() {
		rollSpare();
		game.roll(3);
		rollMany(17, 0);
		expect(game.score()).to.equal(16);
	});
});
```


## The fourth test

```js
describe("BowlingGame", function() {
	var game;

	beforeEach(function(){
		game = new BowlingGame();
	});

	function rollMany (n, pins) {
		for (var i = 0; i < n; i++) {
			game.roll(pins)
		}
	}

	function rollSpare() {
		game.roll(5);
		game.roll(5);
	}

	function rollStrike() {
		game.roll(10);
	}

	it("should handle gutter game", function() {
		rollMany(20, 0);
		expect(game.score()).to.equal(0);
	});

	it("should handle all ones", function() {
		rollMany(20, 1);
		expect(game.score()).to.equal(20);
	});

	it("should handle one spare", function() {
		rollSpare();
		game.roll(3);
		rollMany(17, 0);
		expect(game.score()).to.equal(16);
	});

	it("should handle one strike", function() {
		rollStrike();
		game.roll(3);
		game.roll(4);
		rollMany(16, 0);
		expect(game.score()).to.equal(24);
	});
});
```


## The fifth test

```js
describe("BowlingGame", function() {
	var game;

	beforeEach(function(){
		game = new BowlingGame();
	});

	function rollMany (n, pins) {
		for (var i = 0; i < n; i++) {
			game.roll(pins)
		}
	}

	function rollSpare() {
		game.roll(5);
		game.roll(5);
	}

	function rollStrike() {
		game.roll(10);
	}

	it("should handle gutter game", function() {
		rollMany(20, 0);
		expect(game.score()).to.equal(0);
	});

	it("should handle all ones", function() {
		rollMany(20, 1);
		expect(game.score()).to.equal(20);
	});

	it("should handle one spare", function() {
		rollSpare();
		game.roll(3);
		rollMany(17, 0);
		expect(game.score()).to.equal(16);
	});

	it("should handle one strike", function() {
		rollStrike();
		game.roll(3);
		game.roll(4);
		rollMany(16, 0);
		expect(game.score()).to.equal(24);
	});

	it("should handle a perfect game", function() {
		rollMany(12, 10);
		expect(game.score()).to.equal(300);
	});
});
```


## Final code

```js
var BowlingGame = function() {
	this.rolls = [];
	this.currentRoll = 0;
};

BowlingGame.prototype.roll = function(pins) {
	this.rolls[this.currentRoll++] = pins;
};

BowlingGame.prototype.score = function() {
	var score = 0;
	var frameIndex = 0;
	var self = this;

	function sumOfBallsInFrame() {
		return self.rolls[frameIndex] + self.rolls[frameIndex + 1];
	}

	function spareBonus() {
		return self.rolls[frameIndex + 2];
	}

	function strikeBonus() {
		return self.rolls[frameIndex + 1] + self.rolls[frameIndex + 2];
	}

	function isStrike() {
		return self.rolls[frameIndex] === 10;
	}

	function isSpare() {
		return self.rolls[frameIndex] + self.rolls[frameIndex + 1] === 10;
	}

	for (var frame = 0; frame < 10; frame++) {
		if (isStrike()) {
			score += 10 + strikeBonus();
			frameIndex++;
		} else if (isSpare()) {
			score += 10 + spareBonus();
			frameIndex += 2;
		} else {
			score += sumOfBallsInFrame();
			frameIndex += 2;
		}
	}
	return score;
};
```











