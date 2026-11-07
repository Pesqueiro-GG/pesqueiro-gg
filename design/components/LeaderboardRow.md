# LeaderboardRow

One person in a season ranking or a challenge leaderboard.

- Positions 1 to 3 get gold, silver and bronze discs; the rest show a plain number. Ties share a position.
- Your own row uses `water-soft` and a "você" tag, so you can find it at a glance.
- Under the name, show the career title in season rankings and the score in challenges.
- `delta` shows movement since your last visit as an arrow and a number, with a tooltip in words.
- XP uses the `stat` style with tabular figures so the column lines up.
- Consumer provides: `position`, `name`, `xp`, and optionally `avatar`, `rankTitle`, `delta`, `isMe`, `lang`.
