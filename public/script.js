const firebaseConfig = {
  apiKey: "AIzaSyCU7Z37g9WcrJ4K5PlhmAqOVpBPqf7yMyA",
  authDomain: "lulu-ring-now.firebaseapp.com",
  projectId: "lulu-ring-now",
  storageBucket: "lulu-ring-now.firebasestorage.app",
  messagingSenderId: "833308441768",
  appId: "1:833308441768:web:766f8317a8a31f3d87d69d"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", function () {
  fetch("/proxyLuluGames")
    .then((res) => {
      if (res.status === 401) {
        document.querySelector(".container").innerHTML =
          '<p style="font-size: 40px; color: red;">인증이 만료됐으니 업데이트좀 하라고 말해주세요..</p>';
        throw new Error("Unauthorized");
      }
      return res.json();
    })
    .then((data) => {
      const container = document.querySelector(".container");
      container.innerHTML = "";
      const games = data.data.res.filter(
        (game) => game.gameState === "playing"
      );

      if (games.length === 0) {
        container.innerHTML =
          '<p style="font-size: 20px; color: orange;">진행중인 링번개가 없어요 ㅜㅜ</p>';
        return;
      }

      games.forEach((game) => {
        const isFull = game.activePlayerCount === game.maxPlayerCount;
        const gameElement = `
                <div class="game-card">
                    <div class="title">${game.title}</div>
                    <div class="info">시작시간: ${new Date(
                      game.createdAt
                    ).toLocaleString("ko-KR")}</div>
                    <div class="info">블라인드: ${game.smallBlind}/${
          game.bigBlind
        }</div>
                    <div class="info">플레이어: ${game.activePlayerCount}/${
          game.maxPlayerCount
        }</div>
                    <div class="info">방장: ${game.ownerUserName}</div>
                    <a class="join-btn" href="https://pokerlulu.com/ko?gameId=${
                      game.gameId
                    }" target="_blank">입장하기</a>
                    ${
                      isFull
                        ? `<button class="alert-btn" onclick="requestAlert('${game.gameId}')">빈자리 알림 받기</button>`
                        : ""
                    }
                </div>`;
        container.innerHTML += gameElement;
      });
    });

  window.requestAlert = function (gameId) {
    const ldap = prompt("워크로 알림을 받을 LDAP을 입력하세요");
    if (ldap) {
      db.collection("seatAlerts")
        .doc(`${gameId}_${ldap}`)
        .set({ gameId, ldap })
        .then(() => alert("알림 추가가 완료되었습니다."))
        .catch((err) => console.error("Firestore 저장 실패:", err));
    }
  };
});
