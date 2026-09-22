import { differenceInDays } from "date-fns";
import type {
  Community,
  EditSuggestion,
  Place,
  PlaceFilters,
  PlaceType,
  StockReport,
  ThreadMessage,
  UserProfile,
} from "@/types";
import {
  STOCK_STALE_DAYS,
  communities as seedCommunities,
  demoUser,
  editSuggestions as seedEdits,
  places as seedPlaces,
  stockReports as seedStock,
  threadMessages as seedMessages,
} from "./seed";

const g = globalThis as unknown as {
  __makomStore?: {
    places: Place[];
    stock: StockReport[];
    communities: Community[];
    edits: EditSuggestion[];
    messages: ThreadMessage[];
    user: UserProfile | null;
  };
};

function store() {
  if (!g.__makomStore) {
    g.__makomStore = {
      places: [...seedPlaces],
      stock: [...seedStock],
      communities: [...seedCommunities],
      edits: [...seedEdits],
      messages: [...seedMessages],
      user: null,
    };
  }
  return g.__makomStore;
}

export function getPlaces(filters?: Partial<PlaceFilters>): Place[] {
  let list = store().places;
  if (!filters) return list;

  if (filters.query?.trim()) {
    const q = filters.query.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.chainName?.toLowerCase().includes(q) ||
        p.nameLocal?.toLowerCase().includes(q) ||
        p.agencyName?.toLowerCase().includes(q),
    );
  }
  if (filters.types && filters.types.length > 0) {
    list = list.filter((p) => filters.types!.includes(p.type));
  }
  if (filters.status && filters.status.length > 0) {
    list = list.filter((p) => filters.status!.includes(p.kashrutStatus));
  }
  if (filters.denomination) {
    list = list.filter((p) => {
      if (p.type !== "synagogue" && p.type !== "judaica" && p.type !== "community") {
        return true;
      }
      return !p.denomination || p.denomination === filters.denomination;
    });
  }
  if (filters.nusach) {
    list = list.filter((p) => {
      if (p.type !== "synagogue" && p.type !== "judaica") return true;
      return !p.nusach || p.nusach === filters.nusach;
    });
  }
  if (filters.orthodoxStream) {
    list = list.filter((p) => {
      if (p.type !== "synagogue") return true;
      return !p.orthodoxStream || p.orthodoxStream === filters.orthodoxStream;
    });
  }
  return list;
}

export function getPlace(id: string): Place | undefined {
  return store().places.find((p) => p.id === id);
}

export function getCommunities(): Community[] {
  return store().communities;
}

export function getCommunity(id: string): Community | undefined {
  return store().communities.find((c) => c.id === id);
}

export function getStockForPlace(placeId: string): StockReport[] {
  return store()
    .stock.filter((s) => s.placeId === placeId)
    .sort(
      (a, b) =>
        new Date(b.confirmedAt).getTime() - new Date(a.confirmedAt).getTime(),
    );
}

export function isStockStale(report: StockReport, now = new Date()): boolean {
  return differenceInDays(now, new Date(report.confirmedAt)) >= STOCK_STALE_DAYS;
}

export function getEdits(status?: EditSuggestion["status"]): EditSuggestion[] {
  const list = store().edits;
  return status ? list.filter((e) => e.status === status) : list;
}

export function getThreadMessages(threadKey: string): ThreadMessage[] {
  return store()
    .messages.filter((m) => m.threadKey === threadKey && !m.reported)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
}

export function placeThreadKey(placeId: string) {
  return `place:${placeId}`;
}

export function cityThreadKey(city: string, countryCode: string) {
  return `city:${city}|${countryCode}`;
}

export function getUser(): UserProfile | null {
  return store().user;
}

export function signInDemo(): UserProfile {
  const next = { ...demoUser };
  store().user = next;
  return next;
}

export function signOut() {
  store().user = null;
}

export function updateUser(patch: Partial<UserProfile>): UserProfile | null {
  const user = store().user;
  if (!user) return null;
  store().user = { ...user, ...patch };
  return store().user;
}

export function addPlace(
  input: Omit<Place, "id" | "source" | "kashrutStatus"> & {
    kashrutStatus?: Place["kashrutStatus"];
  },
): Place {
  const place: Place = {
    ...input,
    id: `place-${Date.now()}`,
    source: "community",
    kashrutStatus: input.kashrutStatus ?? "community_report",
  };
  store().places.push(place);
  return place;
}

export function addStockReport(
  input: Omit<StockReport, "id" | "confirmations" | "reportedAt" | "confirmedAt"> & {
    reportedAt?: string;
  },
): StockReport {
  const now = new Date().toISOString();
  const report: StockReport = {
    ...input,
    id: `stock-${Date.now()}`,
    reportedAt: input.reportedAt ?? now,
    confirmedAt: now,
    confirmations: 0,
  };
  store().stock.push(report);
  return report;
}

export function confirmStock(id: string): StockReport | undefined {
  const report = store().stock.find((s) => s.id === id);
  if (!report) return undefined;
  report.confirmedAt = new Date().toISOString();
  report.confirmations += 1;
  return report;
}

export function addEditSuggestion(
  input: Omit<EditSuggestion, "id" | "status" | "createdAt">,
): EditSuggestion {
  const edit: EditSuggestion = {
    ...input,
    id: `edit-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  store().edits.push(edit);
  return edit;
}

export function resolveEdit(
  id: string,
  status: "accepted" | "rejected",
): EditSuggestion | undefined {
  const edit = store().edits.find((e) => e.id === id);
  if (!edit) return undefined;
  edit.status = status;
  if (status === "accepted") {
    const place = getPlace(edit.placeId);
    if (place && edit.field in place) {
      (place as unknown as Record<string, string>)[edit.field] = edit.newValue;
    }
  }
  return edit;
}

const rateLimit = new Map<string, number>();

export function addMessage(
  threadKey: string,
  author: UserProfile,
  body: string,
): { ok: true; message: ThreadMessage } | { ok: false; error: string } {
  const trimmed = body.trim();
  if (!trimmed) return { ok: false, error: "empty" };
  if (trimmed.length > 500) return { ok: false, error: "too_long" };

  const last = rateLimit.get(author.id) ?? 0;
  if (Date.now() - last < 3000) return { ok: false, error: "rate_limit" };
  rateLimit.set(author.id, Date.now());

  const message: ThreadMessage = {
    id: `msg-${Date.now()}`,
    threadKey,
    authorId: author.id,
    authorName: author.displayName,
    body: trimmed,
    createdAt: new Date().toISOString(),
  };
  store().messages.push(message);
  return { ok: true, message };
}

export function reportMessage(id: string): boolean {
  const msg = store().messages.find((m) => m.id === id);
  if (!msg) return false;
  msg.reported = true;
  return true;
}

export const PLACE_TYPE_GROUPS: Record<string, PlaceType[]> = {
  eat: ["restaurant", "bakery", "butcher", "hotel"],
  shop: ["grocery_branch", "judaica"],
  kehilla: ["community", "school", "mikvah"],
  tefilla: ["synagogue"],
};
