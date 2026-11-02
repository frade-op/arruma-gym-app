import { Building2, Check, Link2, Mail, Plus, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useEstablishments } from "@/features/establishments/EstablishmentsProvider";
import { Button } from "@/shared/components/Button";
import { usePreferences } from "@/shared/preferences/PreferencesProvider";

interface ConnectionRequest {
  id: number;
  establishmentName: string;
  email: string | null;
}

export function EstablishmentsPage() {
  const {
    establishments,
    selectedEstablishmentId,
    setSelectedEstablishmentId,
    addManualEstablishment,
  } = useEstablishments();
  const { t } = usePreferences();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requestType, setRequestType] = useState<"existing" | "new" | "manual">("existing");
  const [existingId, setExistingId] = useState(establishments[0].id);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    if (!dialogOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDialogOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dialogOpen]);

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestType === "manual") {
      const establishmentName = newName.trim();
      if (!establishmentName) return;
      addManualEstablishment(establishmentName);
      setConfirmation(t("establishments.manual.saved", { name: establishmentName }));
      setDialogOpen(false);
      setNewName("");
      setNewEmail("");
      return;
    }

    const establishment = establishments.find(({ id }) => id === existingId);
    const establishmentName = requestType === "existing" ? establishment?.name : newName.trim();
    if (!establishmentName) return;

    setRequests((current) => [
      ...current,
      {
        id: Date.now(),
        establishmentName,
        email: requestType === "new" ? newEmail.trim() : null,
      },
    ]);
    setConfirmation(t("establishments.request.saved", { name: establishmentName }));
    setDialogOpen(false);
    setNewName("");
    setNewEmail("");
  }

  function openDialog() {
    setConfirmation("");
    setDialogOpen(true);
  }

  return (
    <section>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-bold tracking-widest text-muted">
            {t("establishments.eyebrow")}
          </p>
          <h1 className="text-3xl font-bold tracking-tight">{t("establishments.title")}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">{t("establishments.subtitle")}</p>
        </div>
        <Button onClick={openDialog}>
          <Plus className="h-4 w-4" aria-hidden />
          {t("establishments.add")}
        </Button>
      </div>

      <div className="mb-7 flex gap-3 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <SlidersHorizontal className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden />
        <p className="text-sm leading-6 text-muted">{t("establishments.dataMethods")}</p>
      </div>

      {confirmation && (
        <p role="status" className="mb-5 rounded-lg border border-success-foreground/30 bg-success-background p-3 text-sm text-success-foreground">
          {confirmation}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {establishments.map((establishment) => {
          const isSelected = selectedEstablishmentId === establishment.id;
          const hasRequest = requests.some((request) => request.establishmentName === establishment.name);
          const isManual = establishment.dataSource === "manual";

          return (
            <article key={establishment.id} className="rounded-xl border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-tint-background text-brand-tint-foreground">
                  <Building2 className="h-5 w-5" aria-hidden />
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1 text-[10px] font-semibold text-muted">
                  {isManual ? (
                    <SlidersHorizontal className="h-3 w-3" aria-hidden />
                  ) : (
                    <Link2 className="h-3 w-3" aria-hidden />
                  )}
                  {isManual ? t("establishments.manual") : t("establishments.connected")}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-bold">{establishment.name}</h2>
              {establishment.location && (
                <p className="mt-1 text-sm text-muted">
                  {t("establishments.location", { location: establishment.location })}
                </p>
              )}
              <p className="mt-4 text-xs text-muted">
                {isManual ? t("establishments.manualDescription") : t("establishments.connectionDescription")}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                {hasRequest ? (
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-300">
                    {t("establishments.request.pending")}
                  </span>
                ) : isSelected ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success-foreground">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                    {t("establishments.selected")}
                  </span>
                ) : (
                  <span className="text-xs text-muted">{t("establishments.available")}</span>
                )}
                <Link
                  to="/"
                  onClick={() => setSelectedEstablishmentId(establishment.id)}
                  className="text-xs font-bold text-brand-tint-foreground hover:text-foreground"
                >
                  {t("establishments.open")}
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {requests.length > 0 && (
        <section className="mt-9">
          <div className="mb-4">
            <p className="mb-1 text-[10px] font-bold tracking-widest text-muted">
              {t("establishments.requests.eyebrow")}
            </p>
            <h2 className="text-xl font-bold">{t("establishments.requests.title")}</h2>
          </div>
          <ul className="overflow-hidden rounded-xl border border-border bg-surface">
            {requests.map((request) => (
              <li key={request.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4 last:border-b-0">
                <span>
                  <strong className="block text-sm">{request.establishmentName}</strong>
                  {request.email && <span className="mt-1 block text-xs text-muted">{request.email}</span>}
                </span>
                <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                  {t("establishments.request.pending")}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">{t("establishments.request.demoOnly")}</p>
        </section>
      )}

      {dialogOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="establishment-dialog-title"
            className="my-auto w-full max-w-lg rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="establishment-dialog-title" className="text-xl font-bold">
                  {t("establishments.dialog.title")}
                </h2>
                <p className="mt-1 text-sm text-muted">{t("establishments.dialog.subtitle")}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                aria-label={t("establishments.dialog.close")}
                onClick={() => setDialogOpen(false)}
                className="px-2"
              >
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </div>

            <form onSubmit={submitRequest} className="space-y-5">
              <fieldset className="space-y-3">
                <legend className="mb-2 text-sm font-semibold">
                  {t("establishments.dialog.connectionType")}
                </legend>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3">
                  <input
                    type="radio"
                    name="connection-type"
                    value="existing"
                    checked={requestType === "existing"}
                    onChange={() => setRequestType("existing")}
                    className="mt-1 accent-brand-600"
                  />
                  <span>
                    <strong className="block text-sm">{t("establishments.dialog.existing")}</strong>
                    <span className="mt-1 block text-xs text-muted">{t("establishments.dialog.existingDescription")}</span>
                  </span>
                </label>
                {requestType === "existing" && (
                  <label className="grid gap-1.5 text-sm font-medium">
                    {t("establishments.dialog.selectLabel")}
                    <select
                      value={existingId}
                      onChange={(event) => setExistingId(event.target.value)}
                      className="rounded-lg border border-border bg-background px-3 py-2.5 text-foreground"
                    >
                      {establishments.map(({ id, name }) => (
                        <option key={id} value={id}>{name}</option>
                      ))}
                    </select>
                  </label>
                )}
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3">
                  <input
                    type="radio"
                    name="connection-type"
                    value="new"
                    checked={requestType === "new"}
                    onChange={() => setRequestType("new")}
                    className="mt-1 accent-brand-600"
                  />
                  <span>
                    <strong className="block text-sm">{t("establishments.dialog.notListed")}</strong>
                    <span className="mt-1 block text-xs text-muted">{t("establishments.dialog.notListedDescription")}</span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3">
                  <input
                    type="radio"
                    name="connection-type"
                    value="manual"
                    checked={requestType === "manual"}
                    onChange={() => setRequestType("manual")}
                    className="mt-1 accent-brand-600"
                  />
                  <span>
                    <strong className="block text-sm">{t("establishments.dialog.manual")}</strong>
                    <span className="mt-1 block text-xs text-muted">{t("establishments.dialog.manualDescription")}</span>
                  </span>
                </label>
              </fieldset>

              {(requestType === "new" || requestType === "manual") && (
                <div className="space-y-4">
                  <label className="grid gap-1.5 text-sm font-medium">
                    {t("establishments.dialog.nameLabel")}
                    <input
                      type="text"
                      required
                      maxLength={120}
                      value={newName}
                      onChange={(event) => setNewName(event.target.value)}
                      className="rounded-lg border border-border bg-background px-3 py-2.5 text-foreground"
                    />
                  </label>
                  {requestType === "new" && (
                    <label className="grid gap-1.5 text-sm font-medium">
                      <span className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4" aria-hidden />
                        {t("establishments.dialog.emailLabel")}
                      </span>
                      <input
                        type="email"
                        required
                        maxLength={254}
                        autoComplete="email"
                        value={newEmail}
                        onChange={(event) => setNewEmail(event.target.value)}
                        className="rounded-lg border border-border bg-background px-3 py-2.5 text-foreground"
                      />
                    </label>
                  )}
                </div>
              )}

              {requestType === "new" && (
                <p className="rounded-lg bg-background p-3 text-xs leading-5 text-muted">
                  {t("establishments.dialog.demoOnly")}
                </p>
              )}
              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                  {t("establishments.dialog.cancel")}
                </Button>
                <Button type="submit">
                  {requestType === "manual"
                    ? t("establishments.dialog.manualSubmit")
                    : t("establishments.dialog.submit")}
                </Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
