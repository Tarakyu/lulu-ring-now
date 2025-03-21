const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.proxyLuluGames = functions.https.onRequest(async (req, res) => {
  const result = await fetch("https://api.pokerlulu.com/api/clans/8/games?page=1&limit=10", {
    headers: {
      Authorization: `Bearer ${functions.config().lulu.token}`
    }
  });

  const json = await result.json();
  res.status(result.status).send(json);
});
