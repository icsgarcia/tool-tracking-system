import { getPrisma } from "../database/db.js";

export async function checkOverdueTransactions() {
    const prisma = getPrisma();
    const now = new Date();

    const transactions = await prisma.transaction.findMany({
        where: { status: "BORROWED" },
    });

    for (const transaction of transactions) {
        if (
            now.getTime() - transaction.borrowedAt.getTime() >
            24 * 60 * 60 * 1000
        ) {
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: "UNRETURNED" },
            });
        }
    }

    console.log(`[job] Checked ${transactions.length} borrowed transactions.`);
}
