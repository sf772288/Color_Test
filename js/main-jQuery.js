// 首頁  start開始
$(function () {
  let bestScores = localStorage.getItem("bestScores") || 0;
  startBefore();
  $("#btn").on("click", startAfter);
  $("#restart").on("click", restart);
  $("#top1").on("click", bestScore);
  $("#removeScore").on("click", removeTopScore);
  let n = 2;
  let colorRandom = 0;
  let score = 0;
  let timeOut = 60;
  let timeId;

  //開始前
  function startBefore() {
    $(".nxnbox").hide();
    $("#scores").hide();
    $("#time").hide();
    $("#restart").hide();
  }
  //開始後
  function startAfter() {
    clearInterval(timeId);
    $(".font").hide();
    $("h1").hide();
    $("#btn").hide();
    $("#top1").hide();
    $("#game").show();
    $("#scores").show();
    $("#time").show();
    $("#restart").show();
    $("#removeScore").hide();
    startTime();
    buildBoard();
  }

  // 生成方塊
  function buildBoard() {
    $(".inside").empty();
    for (let i = 0; i < n * n; i++) {
      $(".inside").append("<button class='inside-btn'></button>");
    }
    $(".inside").css({
      display: "grid",
      "grid-template-columns": `repeat(${n}, 1fr)`,
      "grid-template-rows": `repeat(${n}, 1fr)`,
    });

    // 顏色生成

    const H = Math.floor(Math.random() * 360);
    $(".inside-btn").css("background-color", `hsl(${H},80%,50%)`);
    colorRandom = Math.floor(Math.random() * $(".inside-btn").length);
    $(".inside-btn")
      .eq(colorRandom)
      .css("background-color", `hsl(${H},80%,60%)`);

    //分數綁定
    $("#scoresValue").text(score);

    $(".inside-btn").off().on("click", startGame);
  }

  // 點擊方塊事件
  function startGame() {
    const clickBtn = $(this).index();
    if (clickBtn === colorRandom) {
      $(".inside").empty();
      n += 1;
      score += 1;
      if (score > bestScores) {
        bestScores = score;
        localStorage.setItem("bestScores", bestScores);
      }
      buildBoard();
    } else {
      $("#time").text("時間:" + timeOut);
      clearInterval(timeId);
      Swal.fire({
        title: `分數為:${score},目前最高分為:${bestScores}`,
        text: "請問是否繼續遊戲?",
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
          score = 0;
          startTime();
          buildBoard();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          clearInterval(timeId); // <--- 確保回到首頁時，計時器是停止的
          n = 2; // 順便重設難度
          timeOut = 60; // 順便重設時間
          // ...
          startBefore();
          setTimeout(() => {
            Swal.fire({
              title: "已退出遊戲",
              text: "感謝遊玩！",
            });
          }, 100);
          startBefore();
          $(".font").show();
          $("h1").show();
          $("#btn").show();
          $("#top1").show();
          $("#removeScore").show();
          $(".inside-btn").off("click");
        }
      });
    }
  }
  // 重新開始遊戲
  function restart() {
    clearInterval(timeId); //清除舊 timer
    n = 2;
    timeOut = 60;
    score = 0;
    startTime();
    buildBoard();
  }

  // 時間
  function startTime() {
    timeId = setInterval(() => {
      timeOut--;
      $("#time").text("時間:" + timeOut);

      if (timeOut <= 0) {
        clearInterval(timeId);
        // alert(`時間到~  共獲得${score}分`);
        Swal.fire({
          title: `分數:${score}`,
          text: "請問是否繼續遊戲?",
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
            score = 0;
            startTime();
            buildBoard();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
              title: "已退出遊戲",
              text: "感謝遊玩！",
            });

            startBefore();
            $(".font").show();
            $("h1").show();
            $("#btn").show();
            $("#top1").show();
            $("#removeScore").show();
            $(".inside-btn").off("click");
            $(".inside-btn").off("click");
          }
        });
      }
    }, 1000);
  }

  //最高分數
  function bestScore() {
    Swal.fire({
      title: `目前最高分數為:${bestScores}`,
      draggable: true,
    });
  }

  function removeTopScore() {
    localStorage.removeItem("bestScores");
    bestScores = 0;
  }
});
