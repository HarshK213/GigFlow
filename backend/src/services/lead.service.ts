import { Lead, ILeadDocument } from '../models/Lead';
import { ApiError } from '../utils/ApiError';
import { PaginationMeta } from '../interfaces';

interface GetLeadsFilters {
  status?: string;
  source?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'latest' | 'oldest';
}

interface GetLeadsResult {
  leads: ILeadDocument[];
  pagination: PaginationMeta;
}

export async function createLead(
  data: { name: string; email: string; status?: string; source?: string },
  userId: string
): Promise<ILeadDocument> {
  const lead = await Lead.create({
    name: data.name,
    email: data.email,
    status: data.status || 'New',
    source: data.source || 'Website',
    createdBy: userId,
  });
  return lead;
}

export async function getLeads(
  filters: GetLeadsFilters,
  userId: string,
  userRole: string
): Promise<GetLeadsResult> {
  const query: Record<string, unknown> = {};
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;

  if (userRole === 'Sales') {
    query.createdBy = userId;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.source) {
    query.source = filters.source;
  }

  if (filters.search) {
    const searchRegex = { $regex: filters.search, $options: 'i' };
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const sortOrder = filters.sort === 'oldest' ? 1 : -1;

  const [leads, total] = await Promise.all([
    Lead.find(query).sort({ createdAt: sortOrder }).skip(skip).limit(limit),
    Lead.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    leads,
    pagination: {
      total,
      currentPage: page,
      totalPages,
      limit,
    },
  };
}

export async function getLeadById(id: string): Promise<ILeadDocument> {
  const lead = await Lead.findById(id);
  if (!lead) {
    throw ApiError.notFound('Lead not found');
  }
  return lead;
}

export async function updateLead(
  id: string,
  data: Partial<{ name: string; email: string; status: string; source: string }>
): Promise<ILeadDocument> {
  const lead = await Lead.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!lead) {
    throw ApiError.notFound('Lead not found');
  }
  return lead;
}

export async function deleteLead(id: string): Promise<void> {
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) {
    throw ApiError.notFound('Lead not found');
  }
}

export async function bulkImportLeads(
  leadsData: Array<{
    name: string;
    email: string;
    status?: string;
    source?: string;
  }>,
  userId: string
): Promise<{ imported: number; errors: Array<{ row: number; message: string }> }> {
  const errors: Array<{ row: number; message: string }> = [];
  const validLeads: Array<{
    name: string;
    email: string;
    status: string;
    source: string;
    createdBy: string;
  }> = [];

  leadsData.forEach((data, index) => {
    const rowNum = index + 1;
    if (!data.name || !data.email) {
      errors.push({
        row: rowNum,
        message: !data.name ? 'Name is required' : 'Email is required',
      });
      return;
    }
    validLeads.push({
      name: data.name,
      email: data.email,
      status: data.status || 'New',
      source: data.source || 'Website',
      createdBy: userId,
    });
  });

  if (validLeads.length > 0) {
    await Lead.insertMany(validLeads);
  }

  return { imported: validLeads.length, errors };
}

export async function exportLeads(
  filters: GetLeadsFilters,
  userId: string,
  userRole: string
): Promise<ILeadDocument[]> {
  const query: Record<string, unknown> = {};

  if (userRole === 'Sales') {
    query.createdBy = userId;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.source) {
    query.source = filters.source;
  }

  if (filters.search) {
    const searchRegex = { $regex: filters.search, $options: 'i' };
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const sortOrder = filters.sort === 'oldest' ? 1 : -1;

  return Lead.find(query).sort({ createdAt: sortOrder });
}
