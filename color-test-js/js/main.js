const box = document.getElementById("game");
const start = document.getElementById("btn");
let score = document.getElementById("scores");
let scoreValue = document.getElementById("scoresValue");
const time = document.getElementById("time");
const timeValue = document.getElementById("timeValue");
const restart = document.getElementById("restart");
const font = document.getElementsByClassName("font");
const title = document.getElementById("title");
const boxInside = document.querySelector(".inside");
function hide() {
  box.style.display = "none";
  restart.style.display = "none";
  score.style.display = "none";
  time.style.display = "none";
}
hide();

start.addEventListener("click", function () {
  //顯示
  box.style.display = "block";
  restart.style.display = "block";
  score.style.display = "block";
  time.style.display = "block";
  startTime();
  //隱藏
  for (let item of font) {
    item.style.display = "none";
  }
  title.style.display = "none";
  start.style.display = "none";

  //
  buildBoard();
});

let n = 2;
let scores = 0;

function buildBoard() {
  boxInside.innerHTML = "";
  for (let i = 0; i < n * n; i++) {
    const btns = document.createElement("button");
    btns.classList.add("inside-btn");
    boxInside.appendChild(btns);
  }

  //  設定CSS樣式
  boxInside.style.display = "grid";
  boxInside.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
  boxInside.style.gridTemplateRows = `repeat(${n}, 1fr)`;

  boardColor();

  //點擊事件
  const answerColor = boardColor();
  const btnCLick = document.querySelectorAll(".inside-btn");

  btnCLick.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      if (index === answerColor) {
        n++;
        scores += 1;
        scoreValue.textContent = scores;
        buildBoard();
      } else {
        clearInterval(timeId);
        Swal.fire({
          title: "遊戲結束",
          text: `得到分數:${(scoreValue.textContent =
            scores)},請問是否繼續遊戲?`,
          draggable: true,
          allowOutsideClick: false,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "繼續",
          cancelButtonText: "退出",
          background: "lightpink",
          color: "black",
        }).then((result) => {
          if (result.isConfirmed) {
            clearInterval(timeId); //清除舊 timer
            n = 2;
            timeOut = 60;
            scoreValue.textContent = 0;
            startTime();
            buildBoard();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            setTimeout(() => {
              Swal.fire({
                title: "已退出遊戲",
                text: "感謝遊玩！",
              });
            }, 300);
            returnHome();
            disableButton();
          }
        });

        n = 2; // 回到起始關
      }
    });
  });
}

//button顏色
function boardColor() {
  const boxInsideBtn = document.querySelectorAll(".inside-btn");

  const H = Math.floor(Math.random() * 360);
  boxInsideBtn.forEach((btn) => {
    btn.style.backgroundColor = `hsl(${H},80%,50%)`;
  });

  const colorRandom = Math.floor(Math.random() * boxInsideBtn.length);
  boxInsideBtn[colorRandom].style.backgroundColor = `hsl(${H},80%,60%)`;

  return colorRandom;
}

//時間
let timeOut = 60;
let timeId = null;
function startTime() {
  clearInterval(timeId);
  timeOut = 60;
  timeId = setInterval(() => {
    timeOut--;
    timeValue.textContent = timeOut;

    if (timeOut <= 0) {
      clearInterval(timeId);
      Swal.fire({
        title: "遊戲結束",
        text: `得到分數:${(scoreValue.textContent =
          scores)}，請問是否繼續遊戲?`,
        draggable: true,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "繼續",
        cancelButtonText: "退出",
      }).then((result) => {
        if (result.isConfirmed) {
          clearInterval(timeId); //清除舊 timer
          n = 2;
          timeOut = 60;
          scores = 0;
          startTime();
          buildBoard();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: "已退出遊戲",
            text: "感謝遊玩！",
          });
          returnHome();
          disableButton();
        }
      });
    }
  }, 1000);
}

// 關閉按鈕
function disableButton() {
  const btn = document.querySelectorAll(".inside-btn");
  btn.forEach((btn) => (btn.disabled = true));
}

//重新開始遊戲
let restartGame = document.getElementById("restart");
restartGame.addEventListener("click", function () {
  clearInterval(timeId);
  n = 2;
  timeOut = 60;
  scoreValue.textContent = 0;
  startTime();
  buildBoard();
});

// 返回介面
function returnHome() {
  box.style.display = "none";
  restart.style.display = "none";
  score.style.display = "none";
  time.style.display = "none";
  for (let item of font) {
    item.style.display = "block";
  }
  title.style.display = "block";
  start.style.display = "block";
}
