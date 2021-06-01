const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const detail = `SELECT *
  FROM cricket_team; `;
  const comingData = await db.all(detail);
  response.send(comingData);
});

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;

  const fill = `INSERT INTO cricket_team (player_name,jersey_number,role)
    VALUES('${playerName}','${jerseyNumber}',${role});
        `;

  const player = await db.run(fill);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const detail = `SELECT *
  FROM cricket_team 
  WHERE player_id=${playerId};`;
  const comingData = await db.get(detail);
  response.send(comingData);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetail = request.body;
  const { playerName, jerseyNumber, role } = playerDetail;
  const detail = `UPDATE cricket_team
  SET 
   player_name='${playerName}',
   jersey_number='${jerseyNumber}',
   role='${role}'
   WHERE player_id=${playerId};`;

  await db.run(detail);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const query = `
    DELETE FROM cricket_team
    WHERE player_id=${playerId};
     `;
  await db.run(query);
  response.send("Player Removed");
});

module.exports = app;
