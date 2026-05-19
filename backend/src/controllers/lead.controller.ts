import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import * as leadService from '../services/lead.service';
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from '../types';
import { generateCsv } from '../utils/csvExport';
import { AuthRequest } from '../interfaces';

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const data = createLeadSchema.parse(req.body);
  const authReq = req as AuthRequest;
  const lead = await leadService.createLead(data, authReq.user!.id);
  ApiResponse.success(res, lead, 'Lead created successfully', 201);
});

export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const query = leadQuerySchema.parse(req.query);
  const authReq = req as AuthRequest;
  const { leads, pagination } = await leadService.getLeads(
    query,
    authReq.user!.id,
    authReq.user!.role
  );
  res.status(200).json({
    success: true,
    data: leads,
    pagination,
  });
});

export const getLead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const lead = await leadService.getLeadById(id);
  ApiResponse.success(res, lead);
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = updateLeadSchema.parse(req.body);
  const lead = await leadService.updateLead(id, data);
  ApiResponse.success(res, lead, 'Lead updated successfully');
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await leadService.deleteLead(id);
  ApiResponse.success(res, null, 'Lead deleted successfully');
});

export const exportCSV = asyncHandler(async (req: Request, res: Response) => {
  const query = leadQuerySchema.parse(req.query);
  const authReq = req as AuthRequest;
  const leads = await leadService.exportLeads(query, authReq.user!.id, authReq.user!.role);
  const csv = generateCsv(leads.map((lead) => lead.toObject()));

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads-export.csv"');
  res.status(200).send(csv);
});
