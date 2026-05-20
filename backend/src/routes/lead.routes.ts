import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  importLeads,
  exportCSV,
} from '../controllers/lead.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createLeadSchema,
  updateLeadSchema,
  leadQuerySchema,
  bulkImportSchema,
} from '../types';

const router = Router();

router.use(authenticate);

router.get('/export', validate(leadQuerySchema, 'query'), exportCSV);
router.get('/', validate(leadQuerySchema, 'query'), getLeads);
router.get('/:id', getLead);
router.post('/import', validate(bulkImportSchema), importLeads);
router.post('/', validate(createLeadSchema), createLead);
router.put('/:id', validate(updateLeadSchema), updateLead);
router.delete('/:id', authorize('Admin'), deleteLead);

export default router;
