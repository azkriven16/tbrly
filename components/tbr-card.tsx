"use client";

import Image from "next/image";
import { Edit, Trash2, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TBRItem } from "@/types/tbr";

interface TBRCardProps {
    item: TBRItem;
    onEdit: (item: TBRItem) => void;
    onDelete: (id: string) => void;
}

export function TBRCard({ item, onEdit, onDelete }: TBRCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "TBR":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
            case "Reading":
            case "Watching":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case "Completed":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Book":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
            case "Anime":
                return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
            case "Manga":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        }
    };

    return (
        <Card className="group hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
                <div className="flex gap-4">
                    <div className="relative w-20 h-28 flex-shrink-0">
                        <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover rounded-md"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                                {item.title}
                            </h3>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => onEdit(item)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={() => onDelete(item.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={getStatusColor(item.status)}>
                                {item.status}
                            </Badge>
                            <Badge className={getCategoryColor(item.category)}>
                                {item.category}
                            </Badge>
                        </div>

                        {item.rating && (
                            <div className="flex items-center gap-1 mb-2">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">
                                    {item.rating}
                                </span>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-1 mb-2">
                            {item.genre.slice(0, 3).map((genre) => (
                                <Badge
                                    key={genre}
                                    variant="outline"
                                    className="text-xs"
                                >
                                    {genre}
                                </Badge>
                            ))}
                            {item.genre.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{item.genre.length - 3}
                                </Badge>
                            )}
                        </div>

                        {item.notes && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.notes}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
