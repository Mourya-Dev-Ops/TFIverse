'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { suggestions } from '@/lib/schema';
import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';

export async function submitSuggestion(formData: {
    entityType: 'people' | 'movie';
    entityId: string;
    suggestionData: any;
    reason?: string;
}) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Authentication required' };
    }

    try {
        await db.insert(suggestions).values({
            userId: session.user.id,
            entityType: formData.entityType,
            entityId: formData.entityId,
            suggestionData: formData.suggestionData,
            reason: formData.reason,
            status: 'pending',
        });

        return { success: true };
    } catch (error: any) {
        console.error('Failed to submit suggestion:', error);
        return { error: 'Failed to submit suggestion' };
    }
}

export async function approveSuggestion(suggestionId: number, adminComment?: string) {
    const session = await auth();
    // In a real app, check for admin role here
    if (!session?.user) {
        return { error: 'Admin authentication required' };
    }

    try {
        const [suggestion] = await db.select().from(suggestions).where(sql`id = ${suggestionId}`).limit(1);
        if (!suggestion) return { error: 'Suggestion not found' };

        // 1. Update the original entity (this is complex because fields vary)
        // For now, we'll just mark as approved and let the admin apply it manually 
        // or build a generic applier.

        await db.update(suggestions).set({
            status: 'approved',
            adminComment,
            reviewedBy: session.user.id,
            reviewedAt: new Date(),
            updatedAt: new Date(),
        }).where(eq(suggestions.id, suggestionId));

        return { success: true };
    } catch (error: any) {
        console.error('Failed to approve suggestion:', error);
        return { error: 'Approval failed' };
    }
}
