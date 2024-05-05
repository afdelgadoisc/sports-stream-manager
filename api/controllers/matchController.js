import { validateMatch, validatePartialMatch } from "../schemas/matchSchema.js";

export class MatchController {
  constructor({ matchModel }) {
    this.matchModel = matchModel;
  }

  getAll = async (req, res) => {
    const matches = await this.matchModel.getAll();
    if (matches.length === 0) {
      return res.status(404).json({ message: "Matches not found" });
    }
    res.json(matches);
  };

  getActiveMatch = async (req, res) => {
    const match = await this.matchModel.getActiveMatch();
    if (match) return res.json(match);
    res.status(404).json({ message: "Match not found" });
  };

  create = async (req, res) => {
    const result = validateMatch(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }
    const newMatch = await this.matchModel.create({ input: result.data });
    res.status(201).json(newMatch);
  };

  delete = async (req, res) => {
    const { id } = req.params;

    const result = await this.matchModel.delete({ id });

    if (result === null) {
      return res.status(404).json({ message: "Match not found" });
    }

    return res.json({ message: "Match deleted" });
  };

  update = async (req, res) => {
    const result = validatePartialMatch(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;

    const updatedMatch = await this.matchModel.update({
      id,
      input: result.data,
    });

    return res.json(updatedMatch);
  };
}
