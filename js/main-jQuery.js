// 首頁  start開始
$(function () {
  $(".nxnbox").hide();
  $("#scores").hide();
  $("#time").hide();
  $("#restart").hide();
  $("#btn").on("click", function () {
    $(".font").remove();
    $("h1").remove();
    $("#btn").remove();
    $("#game").show();
    $("#scores").show();
    $("#time").show();
    $("#restart").show();

    startTime();
    buildBoard();
  });

  let n = 2;
  let colorRandom = 0;
  let score = 0;

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

    // 點擊事件
    $(".inside-btn")
      .off()
      .on("click", function () {
        const clickBtn = $(this).index();
        if (clickBtn === colorRandom) {
          $(".inside").empty();
          n += 1;
          score += 1;
          buildBoard();
        } else {
          $("#time").text("時間:" + timeOut);
          clearInterval(timeId);
          Swal.fire({
            title: `分數:${score}`,
            text: "請問是否繼續遊戲?",
            draggable: true,
            allowEscapeKey: false,
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
              // $(".inside-btn").prop("disabled", true);
              setTimeout(() => {
                Swal.fire({
                  title: "已退出遊戲",
                  text: "感謝遊玩！",
                });
              }, 300);

              $(".inside-btn").off("click");
            }
          });
        }
      });
  }
  // 重新開始遊戲
  $("#restart").on("click", function () {
    clearInterval(timeId); //清除舊 timer
    n = 2;
    timeOut = 60;
    score = 0;
    startTime();
    buildBoard();
  });

  // 時間
  let timeOut = 60;
  let timeId;
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
          allowEscapeKey: false,
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

            $(".inside-btn").off("click");
          }
        });
      }
    }, 1000);
  }
});
