"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function verifyRun(runId: number, adminName: string) {
  try {
    // 1. Update the run status in DB (simulated via Verification table for now as 'is_verified' field might need migration)
    // Ideally we would update an 'is_verified' boolean on the ArenaRun model itself if it existed,
    // or simply create a Verification record which implies verification.

    const verification = await prisma.verification.create({
      data: {
        runId: runId,
        verified_by: adminName,
        notes: "Verified via HITL Dashboard",
      },
    });

    // 2. In a real scenario, we might trigger a webhook here:
    // await fetch('https://webhook.site/...', { method: 'POST', body: JSON.stringify(verification) });

    // 3. Revalidate the cache to update the UI
    revalidatePath("/arena");
    
    return { success: true, data: verification };
  } catch (error) {
    console.error("Verification failed:", error);
    return { success: false, error: "Failed to verify run" };
  }
}
