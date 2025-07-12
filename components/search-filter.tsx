"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SearchFilterProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: string;
    onStatusFilterChange: (status: string) => void;
    categoryFilter: string;
    onCategoryFilterChange: (category: string) => void;
    onClearFilters: () => void;
}

export function SearchFilter({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    categoryFilter,
    onCategoryFilterChange,
    onClearFilters,
}: SearchFilterProps) {
    const hasActiveFilters =
        statusFilter !== "all" ||
        categoryFilter !== "all" ||
        searchQuery.length > 0;

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search titles..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    <Select
                        value={statusFilter}
                        onValueChange={onStatusFilterChange}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="TBR">TBR</SelectItem>
                            <SelectItem value="Reading">Reading</SelectItem>
                            <SelectItem value="Watching">Watching</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={categoryFilter}
                        onValueChange={onCategoryFilterChange}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="Book">Book</SelectItem>
                            <SelectItem value="Anime">Anime</SelectItem>
                            <SelectItem value="Manga">Manga</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClearFilters}
                    >
                        Clear Filters
                    </Button>
                )}
            </div>

            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                        <Badge variant="secondary">Search: {searchQuery}</Badge>
                    )}
                    {statusFilter !== "all" && (
                        <Badge variant="secondary">
                            Status: {statusFilter}
                        </Badge>
                    )}
                    {categoryFilter !== "all" && (
                        <Badge variant="secondary">
                            Category: {categoryFilter}
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
