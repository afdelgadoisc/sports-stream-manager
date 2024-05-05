import { createClient } from '@libsql/client';
import { v4 as uuidv4 } from 'uuid';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await client.execute(
  'CREATE TABLE IF NOT EXISTS matches (id UUID PRIMARY KEY, home_team TEXT, away_team TEXT, home_score INT, away_score INT, active BOOLEAN, start_time DATETIME, period INT, home_shield TEXT, away_shield TEXT, result TEXT)'
);

export class MatchModel {
  static async getAll() {
    console.log('getAllMatches');
    const matches = (await client.execute('SELECT * FROM matches')).rows;
    return matches;
  }

  static async getActiveMatch() {
    const matches = (
      await client.execute('SELECT * FROM matches WHERE active = 1')
    ).rows;

    if (matches.length === 0) return null;

    return matches[0];
  }

  static async create({ input }) {
    const {
      home_team,
      away_team,
      home_score,
      away_score,
      active,
      start_time,
      period,
      home_shield,
      away_shield,
      result,
    } = input;

    const uuid = uuidv4();

    console.log(uuid);

    try {
      await client.execute({
        sql: `INSERT INTO matches (id, home_team, away_team, home_score, away_score, active, start_time, period, home_shield, away_shield, result)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          uuid,
          home_team,
          away_team,
          home_score,
          away_score,
          active,
          start_time,
          period,
          home_shield,
          away_shield,
          result,
        ],
      });
    } catch (e) {
      throw new Error('Error creating match' + e);
    }

    const matches = (
      await client.execute('SELECT * FROM matches WHERE id = ?', [uuid])
    ).rows;

    return matches[0];
  }

  static async delete({ id }) {
    const matches = (
      await client.execute('SELECT * FROM matches WHERE id = ?', [id])
    ).rows;
    if (matches.length === 0) return null;
    try {
      await client.execute('DELETE FROM matches WHERE id = ?', [id]);
    } catch (e) {
      throw new Error('Error deleting match' + e);
    }
  }

  static async update({ id, input }) {
    const matches = (
      await client.execute('SELECT * FROM matches WHERE id = ?', [id])
    ).rows;

    if (matches.length === 0) return null;

    const {
      home_team,
      away_team,
      home_score,
      away_score,
      active,
      start_time,
      period,
      home_shield,
      away_shield,
      result,
    } = input;

    try {
      await client.execute(
        `UPDATE matches SET home_team = ?, away_team = ?, home_score = ?, away_score = ?, active = ?, start_time = ?, period = ?, home_shield = ?, away_shield = ?, result = ? WHERE id = ?`,
        [
          home_team,
          away_team,
          home_score,
          away_score,
          active,
          start_time,
          period,
          home_shield,
          away_shield,
          result,
          id,
        ]
      );
    } catch (e) {
      throw new Error('Error updating match' + e);
    }

    const matchesUpdate = (
      await client.execute('SELECT * FROM matches WHERE id = ?', [id])
    ).rows;

    return matchesUpdate[0];
  }
}
