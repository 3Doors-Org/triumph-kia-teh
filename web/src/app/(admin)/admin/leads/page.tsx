import Link from "next/link";

import type { SerializedLeadSummary } from "@/components/admin/leads-detail-panel";
import { LeadsDetailPanel } from "@/components/admin/leads-detail-panel";
import { Card } from "@/components/ui";
import { getLeadById, getLeadsPage, parseAdminLeadsQuery } from "@/lib/admin/leads-list";
import { requireRole } from "@/lib/auth/require-role";
import { LEAD_STATUS_VALUES, leadInquiryTypeValues } from "@/lib/leads/status";
import { routes } from "@/lib/routes";

export default async function LeadsAdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole(["owner"]);
  const resolved = flatten(await searchParams);
  const selectedIdRaw = resolved.leadId;
  delete resolved.leadId;

  const listParams = parseAdminLeadsQuery(new URLSearchParams(resolved));
  const { data, nextCursor, total } = await getLeadsPage(listParams);
  const selectedId =
    selectedIdRaw &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(selectedIdRaw)
      ? selectedIdRaw
      : data[0]?.id ?? null;

  const detailData = selectedId ? await getLeadById(selectedId) : null;
  const serializedDetail: SerializedLeadSummary | null = detailData
    ? {
        id: detailData.id,
        name: detailData.name,
        email: detailData.email,
        inquiryType: detailData.inquiryType,
        message: detailData.message,
        sourcePage: detailData.sourcePage,
        status: detailData.status,
        adminNotes: detailData.adminNotes,
        createdAt: detailData.createdAt.toISOString(),
      }
    : null;

  const nextHref = nextCursor
    ? toLeadsHref({ ...listParams, cursor: nextCursor, leadId: selectedId ?? undefined })
    : null;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Leads</h1>
        <p className="text-sm text-(--color-muted-fg)">
          Review contact submissions, update status, and keep private follow-up notes.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)]">
        <Card className="space-y-4 p-4">
          <form className="grid gap-3 md:grid-cols-[1fr_140px_140px_auto]" method="get">
            <input type="hidden" name="leadId" value={selectedId ?? ""} />
            <input
              name="search"
              defaultValue={listParams.search ?? ""}
              placeholder="Search name, email, or message"
              className="rounded-md border border-(--color-muted) px-3 py-2 text-sm"
            />
            <select
              name="status"
              defaultValue={listParams.status ?? ""}
              className="rounded-md border border-(--color-muted) px-3 py-2 text-sm"
            >
              <option value="">All statuses</option>
              {LEAD_STATUS_VALUES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <select
              name="inquiryType"
              defaultValue={listParams.inquiryType ?? ""}
              className="rounded-md border border-(--color-muted) px-3 py-2 text-sm"
            >
              <option value="">All types</option>
              {leadInquiryTypeValues.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-md border border-(--color-muted) px-3 py-2 text-sm hover:bg-(--color-muted)"
            >
              Apply
            </button>
          </form>

          <p className="text-xs text-(--color-muted-fg)">
            {total} total · showing {data.length} on this page
          </p>

          <ul className="divide-y divide-(--color-muted) border border-(--color-muted) rounded-md">
            {data.length === 0 ? (
              <li className="px-3 py-6 text-sm text-(--color-muted-fg)">No leads match these filters.</li>
            ) : (
              data.map((row) => {
                const active = row.id === selectedId;
                return (
                  <li key={row.id}>
                    <Link
                      href={toLeadsHref({ ...listParams, leadId: row.id })}
                      className={`block px-3 py-3 text-sm transition-colors ${active ? "bg-(--color-primary)/10" : "hover:bg-(--color-muted)"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{row.name}</span>
                        <span className="text-xs uppercase text-(--color-muted-fg)">{row.status}</span>
                      </div>
                      <p className="text-xs text-(--color-muted-fg)">{row.email}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-(--color-muted-fg)">{row.message}</p>
                    </Link>
                  </li>
                );
              })
            )}
          </ul>

          {nextHref ? (
            <div>
              <Link
                href={nextHref}
                className="inline-flex rounded-md border border-(--color-muted) px-3 py-1 text-sm hover:bg-(--color-muted)"
              >
                Older inquiries
              </Link>
            </div>
          ) : null}
        </Card>

        <LeadsDetailPanel lead={serializedDetail} />
      </div>
    </section>
  );
}

function flatten(params: Record<string, string | string[] | undefined>): Record<string, string> {
  const output: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") output[key] = value;
    else if (Array.isArray(value) && value.length > 0) output[key] = value[0] ?? "";
  }
  return output;
}

function toLeadsHref(args: {
  cursor?: string;
  limit: number;
  status?: string;
  inquiryType?: string;
  search?: string;
  leadId?: string;
}) {
  const search = new URLSearchParams();
  if (args.search) search.set("search", args.search);
  if (args.status) search.set("status", args.status);
  if (args.inquiryType) search.set("inquiryType", args.inquiryType);
  if (args.cursor) search.set("cursor", args.cursor);
  search.set("limit", String(args.limit));
  if (args.leadId) search.set("leadId", args.leadId);
  return `${routes.admin.leads}?${search.toString()}`;
}
