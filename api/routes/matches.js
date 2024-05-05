import { Router } from 'express';
import { MatchController } from '../controllers/matchController.js';

export const createMatchRouter = ({ matchModel }) => {
  const matchesRouter = Router();

  const matchController = new MatchController({ matchModel });
  matchesRouter.get('/', matchController.getAll);
  matchesRouter.get('/active', matchController.getActiveMatch);
  matchesRouter.post('/', matchController.create);
  matchesRouter.delete('/:id', matchController.delete);
  matchesRouter.patch('/:id', matchController.update);

  return matchesRouter;
};
