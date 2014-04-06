describe("BowlingGame", function() {
	var game;

	function rollMany (n, pins) {
		while (n--) {
			game.roll(pins);
		}
	}

	function rollSpare() {
		game.roll(5);
		game.roll(5);
	}

	function rollStrike() {
		game.roll(10);
	}

	beforeEach(function(){
		game = new BowlingGame();
	});

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
