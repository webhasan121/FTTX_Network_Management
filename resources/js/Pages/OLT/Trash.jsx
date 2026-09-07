import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import EmptyState from "@/Components/UI/EmptyState";
import PageHeader from "@/Components/UI/PageHeader";
import usePermission from "@/Hooks/usePermission";

import { Head, router } from "@inertiajs/react";

import { ArrowLeft, RotateCcw, Server, Trash2 } from "lucide-react";

export default function Trash({ olts }) {
    const { can } = usePermission();

    const restoreOlt = (olt) => {
        if (!window.confirm(`Restore "${olt.name}"?`)) {
            return;
        }

        router.patch(
            route("olts.restore", olt.id),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const forceDeleteOlt = (olt) => {
        if (
            !window.confirm(
                `Permanently delete "${olt.name}"? This action cannot be undone.`,
            )
        ) {
            return;
        }

        router.delete(route("olts.force-delete", olt.id), {
            preserveScroll: true,
        });
    };

    const goBack = () => {
        router.visit(route("olts.index"));
    };

    return (
        <AuthenticatedLayout>
            <Head title="OLT Trash" />

            <div className="space-y-6">
                <PageHeader
                    eyebrow="Network Management"
                    title="OLT Trash"
                    description="Restore deleted OLTs or permanently remove them."
                    actions={
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={goBack}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to OLTs
                        </Button>
                    }
                />

                <Card>
                    {olts.data.length === 0 ? (
                        <EmptyState
                            icon={Trash2}
                            title="Trash is empty"
                            description="There are no deleted OLTs."
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-sm border-b border-zinc-200 text-zinc-500">
                                        <th className="px-4 py-3 font-medium">
                                            OLT
                                        </th>

                                        <th className="px-4 py-3 font-medium">
                                            Code
                                        </th>

                                        <th className="px-4 py-3 font-medium">
                                            Vendor / Model
                                        </th>

                                        <th className="px-4 py-3 font-medium">
                                            IP Address
                                        </th>

                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>

                                        <th className="px-4 py-3 font-medium">
                                            Deleted
                                        </th>

                                        <th className="px-4 py-3 font-medium text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {olts.data.map((olt) => (
                                        <tr
                                            key={olt.id}
                                            className="border-b border-zinc-100 last:border-b-0"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center rounded-lg h-9 w-9 bg-zinc-100">
                                                        <Server className="w-4 h-4 text-zinc-600" />
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-zinc-900">
                                                            {olt.name}
                                                        </p>

                                                        <p className="text-xs text-zinc-500">
                                                            ID #{olt.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-sm text-zinc-700">
                                                {olt.code || "—"}
                                            </td>

                                            <td className="px-4 py-4">
                                                <p className="text-sm text-zinc-800">
                                                    {olt.vendor || "—"}
                                                </p>

                                                <p className="text-xs text-zinc-500">
                                                    {olt.model || "—"}
                                                </p>
                                            </td>

                                            <td className="px-4 py-4 text-sm text-zinc-700">
                                                {olt.ip_address || "—"}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium capitalize text-zinc-700">
                                                    {olt.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-sm text-zinc-500">
                                                {olt.deleted_at}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex justify-end gap-2">
                                                    {can("olt.restore") && (
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            icon={RotateCcw}
                                                            onClick={() =>
                                                                restoreOlt(olt)
                                                            }
                                                        >
                                                            Restore
                                                        </Button>
                                                    )}

                                                    {can(
                                                        "olt.force-delete",
                                                    ) && (
                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            icon={Trash2}
                                                            onClick={() =>
                                                                forceDeleteOlt(
                                                                    olt,
                                                                )
                                                            }
                                                        >
                                                            Delete Forever
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                {olts.links?.length > 3 && (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {olts.links.map((link, index) => (
                            <button
                                key={index}
                                type="button"
                                disabled={!link.url}
                                onClick={() => {
                                    if (link.url) {
                                        router.visit(link.url, {
                                            preserveScroll: true,
                                            preserveState: true,
                                        });
                                    }
                                }}
                                className={[
                                    "rounded-lg border px-3 py-2 text-sm transition",
                                    link.active
                                        ? "border-zinc-900 bg-zinc-900 text-white"
                                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
                                    !link.url
                                        ? "cursor-not-allowed opacity-40"
                                        : "",
                                ].join(" ")}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
