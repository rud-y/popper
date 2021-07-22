document.addEventListener("DOMContentLoaded", () => {
  const playArea = {};
  const player = {};

  let gameObj = {
    data: [
      {
        icon: "\u0026#8902;",
        value: 10,
      },
      {
        icon: "\u0026#10031;",
        value: 30,
      },
      {
        icon: "\u0026#10036;",
        value: 50,
      },
      {
        icon: "\u0026#10042;",
        value: 70,
      },
      {
        icon: "\u0026#10084;",
        value: 75,
      },
      {
        icon: "\u0026#9813;",
        value: 50,
      },
      {
        icon: "\u0026#9822;",
        value: 60,
      },
      {
        icon: "\u0026#9924;",
        value: 45,
      },
      {
        icon: "\u0026#9971;",
        value: 85,
      },
      {
        icon: "\u0026#9729;",
        value: -50,
      },
      {
        icon: "\u0026#9785;",
        value: -100,
      },
      {
        icon: "\u0026#9760;",
        value: -190,
      },
      {
        icon: "\u0026#9791;",
        value: -30,
      },
    ],
  };

  playArea.stats = document.querySelector(".stats");

  playArea.main = document.querySelector(".main");

  playArea.game = document.querySelector(".game");

  playArea.btns = Array.from(document.querySelectorAll(".btn"));

  playArea.page = Array.from(document.querySelectorAll(".page"));

  /// Stats for scores and lives
  player.score = 0;
  player.lives = 3;
  player.previousScore = 0;
  player.scoresArray = [];
  let theBest = 0;
  player.bestScore = 0;

  // EventListener for buttons
  playArea.btns.forEach((item) => {
    item.addEventListener("click", handleButtonClick);
  });

  // Getting data -- from gameObj object with icons and values
  function getData() {
    playArea.main.classList.add("visible");
    buildBoard();
  }
  getData();

  //Build Board Grid
  function buildBoard() {
    playArea.scorer = document.createElement("span");
    playArea.scorer.innerHTML =
      "Hit the popping squares to earn points. If you skip any square with negative value more than three times... the game is over. Collect as much points as you can. Good luck! <hr> <b>⬇ Start! ⬇</b>";
    playArea.stats.appendChild(playArea.scorer);

    let rows = 5;
    let cols = 5;
    let cnt = 0;
    //DEFINING square width
    playArea.game.style.width = cols * 80 + cols * 2;
    playArea.game.style.margin = "auto";
    // Y axis
    for (let y = 0; y < rows; y++) {
      let divMain = document.createElement("div");
      divMain.setAttribute("class", "row");
      divMain.style.width = cols * 80 + cols * 2;
      // X axis
      for (let x = 0; x < cols; x++) {
        let div = document.createElement("div");
        div.setAttribute("class", "pop");
        cnt++;
        div.innerText = cnt;
        div.cnt = cnt;
        divMain.appendChild(div);
      }
      playArea.game.appendChild(divMain);
    }
  }

  function handleButtonClick(e) {
    if (e.target.classList.contains("new-game")) {
      startGame();
    }
  }

  //Starting the Game >> startPop() & updateScore
  function startGame() {
    player.score = 0;
    player.lives = 3;
    playArea.main.classList.remove("visible");
    playArea.game.classList.add("visible");
    //player gameOver set to false
    player.gameOver = false;
    startPop();
    updateScore();
  }

  ////// Select random div from the grid ////////
  function randomUp() {
    const pops = document.querySelectorAll(".pop");
    const idx = Math.floor(Math.random() * pops.length);

    if (pops[idx].cnt == playArea.last) {
      return randomUp();
    }
    playArea.last = pops[idx].cnt;
    return pops[idx];
  }

  //StartPop to set timeout for randomly selected squares of the grid
  function startPop() {
    let newPop = randomUp();
    newPop.classList.add("active");
    newPop.addEventListener("click", hitPop);
    const time = Math.floor(Math.random() * 500 + 500);
    const val = Math.floor(Math.random() * gameObj.data.length);

    newPop.old = newPop.innerText;
    //Access gameObj - values of randomly assigned game squares
    newPop.v = gameObj.data[val].value;
    newPop.innerHTML =
      gameObj.data[val].icon + "<br>" + gameObj.data[val].value;
    // Setting timeout when square is hit
    playArea.inPlay = setTimeout(function () {
      newPop.classList.remove("active");
      newPop.removeEventListener("click", hitPop);
      newPop.innerText = newPop.old;

      if (newPop.v < 0) {
        player.lives--;
        updateScore();
      }

      if (player.lives <= 0) {
        gameOver();
      }

      if (!player.gameOver) {
        startPop();
      }
    }, time);
  }

  //Score update ----
  function updateScore() {
    playArea.scorer.innerHTML =
      "Lives: " +
      player.lives +
      "<br/>Score: <b>" +
      player.score +
      "</b></b><br/><br/> Previous: " +
      player.previousScore +
      "<br/>Your best: " +
      player.bestScore;
  }

  //GameOver ----
  function gameOver() {
    player.gameOver = true;
    playArea.main.classList.add("visible");
    playArea.game.classList.remove("visible");
    document.querySelector(".new-game").innerHTML = "Play again?";
    player.previousScore = player.score;
    player.scoresArray.push(player.previousScore);
    // ----
    let scoresArraySorted = player.scoresArray.sort(function compare(x, y) {
      return x - y;
    });
    theBest = scoresArraySorted[scoresArraySorted.length - 1];
    player.bestScore = theBest;
  }

  function hitPop(e) {
    let newPop = e.target;
    //Adding or subtracting value in a square
    player.score = player.score + newPop.v;
    updateScore();
    newPop.classList.remove("active");
    newPop.removeEventListener("click", hitPop);
    newPop.innerHTML = newPop.old;

    clearTimeout(playArea.inPlay);
    if (!player.gameOver) {
      startPop();
    }
  }
});
