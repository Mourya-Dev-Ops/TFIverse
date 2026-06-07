'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { reports } from '@/lib/schema/moderation';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function submitReport({ entityType, entityId, reason }: { entityType: 'meme' | 'tier_list'; entityId: string; reason: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Authentication required');
  }

  try {
    await db.insert(reports).values({
      reporterId: session.user.id,
      entityType,
      entityId,
      reason,
      status: 'pending',
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to submit report:', error);
    throw new Error('Failed to submit report');
  }
}

export async function getPendingReports() {
  const session = await auth();
  if (!session?.user?.id) { // In a real app, verify admin role here
    throw new Error('Admin access required');
  }

  try {
    const data = await db.query.reports.findMany({
      where: eq(reports.status, 'pending'),
      orderBy: [desc(reports.createdAt)],
      with: {
        reporter: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
          with: {
            profile: {
              columns: { username: true, avatarUrl: true }
            }
          }
        }
      }
    });
    return data;
  } catch (error: any) {
    console.error('Failed to fetch reports:', error);
    return [];
  }
}

export async function resolveReport(reportId: number, adminComment?: string) {
  const session = await auth();
  if (!session?.user?.id) { // In a real app, verify admin role here
    throw new Error('Admin access required');
  }

  try {
    await db.update(reports).set({
      status: 'resolved',
      adminComment,
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(reports.id, reportId));
    
    revalidatePath('/admin/moderation');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to resolve report:', error);
    throw new Error('Failed to resolve report');
  }
}

export async function dismissReport(reportId: number, adminComment?: string) {
  const session = await auth();
  if (!session?.user?.id) { // In a real app, verify admin role here
    throw new Error('Admin access required');
  }

  try {
    await db.update(reports).set({
      status: 'dismissed',
      adminComment,
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(reports.id, reportId));
    
    revalidatePath('/admin/moderation');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to dismiss report:', error);
    throw new Error('Failed to dismiss report');
  }
}
