"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchFilter } from "@/components/search-filter";
import { TBRCard } from "@/components/tbr-card";
import { AddEditForm } from "@/components/add-edit-form";
import { mockTBR } from "@/data/mock-data";
import type { TBRItem } from "@/types/tbr";

export default function HomePage() {
    const [items, setItems] = useState<TBRItem[]>(mockTBR);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<TBRItem | null>(null);

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch =
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.genre.some((genre) =>
                    genre.toLowerCase().includes(searchQuery.toLowerCase())
                ) ||
                (item.notes &&
                    item.notes
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()));

            const matchesStatus =
                statusFilter === "all" || item.status === statusFilter;
            const matchesCategory =
                categoryFilter === "all" || item.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [items, searchQuery, statusFilter, categoryFilter]);

    const handleSave = (
        itemData: Omit<TBRItem, "id" | "dateAdded"> & { id?: string }
    ) => {
        if (itemData.id) {
            // Edit existing item
            setItems((prev) =>
                prev.map((item) =>
                    item.id === itemData.id
                        ? {
                              ...(itemData as TBRItem),
                              dateAdded: item.dateAdded,
                          }
                        : item
                )
            );
        } else {
            // Add new item
            const newItem: TBRItem = {
                ...(itemData as Omit<TBRItem, "id" | "dateAdded">),
                id: Date.now().toString(),
                dateAdded: new Date().toISOString().split("T")[0],
            };
            setItems((prev) => [newItem, ...prev]);
        }
    };

    const handleEdit = (item: TBRItem) => {
        setEditItem(item);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditItem(null);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setCategoryFilter("all");
    };

    const getStats = () => {
        const total = items.length;
        const completed = items.filter(
            (item) => item.status === "Completed"
        ).length;
        const inProgress = items.filter(
            (item) => item.status === "Reading" || item.status === "Watching"
        ).length;
        const tbr = items.filter((item) => item.status === "TBR").length;

        return { total, completed, inProgress, tbr };
    };

    const stats = getStats();

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">My TBR List</h1>
                        <p className="text-muted-foreground">
                            Track your books, anime, and manga to read or watch
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button onClick={() => setIsFormOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Entry
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-card rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-primary">
                            {stats.total}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Total
                        </div>
                    </div>
                    <div className="bg-card rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {stats.completed}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Completed
                        </div>
                    </div>
                    <div className="bg-card rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                            {stats.inProgress}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            In Progress
                        </div>
                    </div>
                    <div className="bg-card rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {stats.tbr}
                        </div>
                        <div className="text-sm text-muted-foreground">TBR</div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-8">
                    <SearchFilter
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        categoryFilter={categoryFilter}
                        onCategoryFilterChange={setCategoryFilter}
                        onClearFilters={handleClearFilters}
                    />
                </div>

                {/* Results Count */}
                <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                        Showing {filteredItems.length} of {items.length} entries
                    </p>
                </div>

                {/* Items Grid */}
                {filteredItems.length > 0 ? (
                    <div className="space-y-4">
                        {filteredItems.map((item) => (
                            <TBRCard
                                key={item.id}
                                item={item}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                            {items.length === 0
                                ? "No entries yet. Add your first book, anime, or manga!"
                                : "No entries match your current filters."}
                        </p>
                        {items.length === 0 && (
                            <Button onClick={() => setIsFormOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Your First Entry
                            </Button>
                        )}
                    </div>
                )}

                {/* Add/Edit Form */}
                <AddEditForm
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    onSave={handleSave}
                    editItem={editItem}
                />
            </div>
        </div>
    );
}
