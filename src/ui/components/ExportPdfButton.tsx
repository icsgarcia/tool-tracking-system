import { FileDown, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";

type ExportType = "users" | "assets" | "transactions" | "userTransactions";

interface ExportPdfButtonProps {
    type: ExportType;
    userId?: string;
    userName?: string;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function capitalize(str: string) {
    return str
        .toLowerCase()
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

function wrapHtml(title: string, tableHtml: string) {
    const now = new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return `<!DOCTYPE html>
<html>
<head>
<style>
    @page { size: landscape; margin: 10mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; padding: 16px; }
    h1 { font-size: 18px; margin-bottom: 4px; }
    .subtitle { color: #666; font-size: 11px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    th, td { padding: 6px 8px; text-align: left; border: 1px solid #ddd; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    th { background-color: #f5f5f5; font-weight: 600; font-size: 11px; }
    td { font-size: 11px; }
    tr:nth-child(even) { background-color: #fafafa; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
    .badge-active, .badge-returned { background: #dcfce7; color: #166534; }
    .badge-inactive { background: #f3f4f6; color: #4b5563; }
    .badge-borrowed { background: #fef3c7; color: #92400e; }
    .badge-unreturned { background: #fee2e2; color: #991b1b; }
</style>
</head>
<body>
    <h1>${title}</h1>
    <p class="subtitle">Exported on ${now}</p>
    ${tableHtml}
</body>
</html>`;
}

function buildUsersTable(users: User[]) {
    const rows = users
        .map(
            (user) => `<tr>
        <td>
            <img src="${user.qrCodeImage}" alt="QR Code" style="width: 80px; height: 80px;" />
        </td>
        <td>${user.schoolNumber}</td>
        <td>${capitalize(`${user.firstName} ${user.middleName} ${user.lastName}`)}</td>
        <td>${user.email || "-"}</td>
        <td>${user.role}</td>
        <td>${user.department || "-"}</td>
        <td>${user.yearLevel}</td>
        <td><span class="badge ${user.status === "ACTIVE" ? "badge-active" : "badge-inactive"}">${user.status}</span></td>
    </tr>`,
        )
        .join("");

    return `<table>
        <thead><tr>
            <th>QR Code</th><th>School No.</th><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Year</th><th>Status</th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table>`;
}

function buildAssetsTable(assets: Asset[]) {
    const rows = assets
        .map(
            (asset) => `<tr>
        <td style="text-align: center;">
            <img src="${asset.qrCodeImage}" alt="QR Code" style="width: 80px; height: 80px;" />
        
        </td>
        <td>${asset.temporaryTagNumber || "-"}</td>
        <td>${asset.assetName}</td>
        <td>${asset.assetCount}</td>
        <td>${asset.borrowedCount}</td>
        <td>${asset.availableCount}</td>
    </tr>`,
        )
        .join("");

    return `<table>
        <thead><tr>
            <th>QR Code</th><th>Tag No.</th><th>Tool Name</th><th>Total Qty</th><th>Checked Out</th><th>Available</th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table>`;
}

function buildTransactionsTable(transactions: Transactions[]) {
    const rows = transactions
        .map(
            (t) => `<tr>
        <td>${capitalize(`${t.user.firstName} ${t.user.middleName} ${t.user.lastName}`)}</td>
        <td>${t.asset.assetName}</td>
        <td>${t.borrowCount}</td>
        <td>${t.returnCount ?? "0"}</td>
        <td>${formatDate(t.borrowedAt)}</td>
        <td>${t.returnedAt ? formatDate(t.returnedAt) : "-"}</td>
        <td><span class="badge ${t.status === "RETURNED" ? "badge-returned" : t.status === "BORROWED" ? "badge-borrowed" : "badge-unreturned"}">${t.status}</span></td>
    </tr>`,
        )
        .join("");

    return `<table>
        <thead><tr>
            <th>User Name</th><th>Tool</th><th>Borrowed Qty</th><th>Returned Qty</th><th>Borrowed At</th><th>Returned At</th><th>Status</th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table>`;
}

function buildUserTransactionsTable(transactions: UserTransactions[]) {
    const rows = transactions
        .map(
            (t) => `<tr>
        <td>${t.asset.assetName}</td>
        <td>${t.borrowCount}</td>
        <td>${t.returnCount ?? "0"}</td>
        <td>${formatDate(t.borrowedAt)}</td>
        <td>${t.returnedAt ? formatDate(t.returnedAt) : "-"}</td>
        <td><span class="badge ${t.status === "RETURNED" ? "badge-returned" : t.status === "BORROWED" ? "badge-borrowed" : "badge-unreturned"}">${t.status}</span></td>
    </tr>`,
        )
        .join("");

    return `<table>
        <thead><tr>
            <th>Tool Name</th><th>Borrowed Qty</th><th>Returned Qty</th><th>Borrowed Date</th><th>Returned Date</th><th>Status</th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table>`;
}

const ExportPdfButton = ({ type, userId, userName }: ExportPdfButtonProps) => {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            let html: string;
            let filename: string;

            if (type === "users") {
                const users = await window.api.user.exportAllUsers();
                html = wrapHtml("Users Report", buildUsersTable(users));
                filename = "users-report.pdf";
            } else if (type === "assets") {
                const assets = await window.api.asset.exportAllAssets();
                html = wrapHtml("Tools Report", buildAssetsTable(assets));
                filename = "tools-report.pdf";
            } else if (type === "transactions") {
                const transactions =
                    await window.api.transaction.exportAllTransactions();
                html = wrapHtml(
                    "Transactions Report",
                    buildTransactionsTable(transactions),
                );
                filename = "transactions-report.pdf";
            } else {
                const transactions =
                    await window.api.transaction.getUserTransactions(userId!, {
                        page: 0,
                        pageSize: 999999,
                    });
                const title = userName
                    ? `Transactions - ${userName}`
                    : "My Transactions";
                html = wrapHtml(
                    title,
                    buildUserTransactionsTable(transactions.data),
                );
                filename = "my-transactions-report.pdf";
            }

            const result = await window.api.print.exportPdf(html, filename);
            if (result.success) {
                toast.success("PDF exported successfully.");
            }
        } catch (error) {
            toast.error("Failed to export PDF.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={loading}
            size="sm"
            className="shrink-0 sm:size-default"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <FileDown className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
                {loading ? "Exporting..." : "Export PDF"}
            </span>
        </Button>
    );
};

export default ExportPdfButton;
