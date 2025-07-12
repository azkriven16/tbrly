"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { TBRItem } from "@/types/tbr"

interface AddEditFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: Omit<TBRItem, "id" | "dateAdded"> & { id?: string }) => void
  editItem?: TBRItem | null
}

export function AddEditForm({ isOpen, onClose, onSave, editItem }: AddEditFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "" as "Book" | "Anime" | "Manga" | "",
    status: "" as "TBR" | "Reading" | "Watching" | "Completed" | "",
    image: "",
    notes: "",
    rating: "",
    genres: [] as string[],
    newGenre: "",
  })

  useEffect(() => {
    if (editItem) {
      setFormData({
        title: editItem.title,
        category: editItem.category,
        status: editItem.status,
        image: editItem.image,
        notes: editItem.notes || "",
        rating: editItem.rating?.toString() || "",
        genres: editItem.genre,
        newGenre: "",
      })
    } else {
      setFormData({
        title: "",
        category: "",
        status: "",
        image: "",
        notes: "",
        rating: "",
        genres: [],
        newGenre: "",
      })
    }
  }, [editItem, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.category || !formData.status) {
      return
    }

    const itemData = {
      ...(editItem && { id: editItem.id }),
      title: formData.title,
      category: formData.category as "Book" | "Anime" | "Manga",
      status: formData.status as "TBR" | "Reading" | "Watching" | "Completed",
      image: formData.image || `https://picsum.photos/seed/${formData.title.toLowerCase().replace(/\s+/g, "")}/400/600`,
      gallery: [
        `https://picsum.photos/seed/${formData.title.toLowerCase().replace(/\s+/g, "")}1/300/200`,
        `https://picsum.photos/seed/${formData.title.toLowerCase().replace(/\s+/g, "")}2/300/200`,
      ],
      genre: formData.genres,
      rating: formData.rating ? Number.parseFloat(formData.rating) : null,
      notes: formData.notes,
    }

    onSave(itemData)
    onClose()
  }

  const addGenre = () => {
    if (formData.newGenre.trim() && !formData.genres.includes(formData.newGenre.trim())) {
      setFormData((prev) => ({
        ...prev,
        genres: [...prev.genres, prev.newGenre.trim()],
        newGenre: "",
      }))
    }
  }

  const removeGenre = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.filter((g) => g !== genre),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addGenre()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editItem ? "Edit Entry" : "Add New Entry"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter title..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value as any }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Book">Book</SelectItem>
                  <SelectItem value="Anime">Anime</SelectItem>
                  <SelectItem value="Manga">Manga</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as any }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TBR">TBR</SelectItem>
                  <SelectItem value="Reading">Reading</SelectItem>
                  <SelectItem value="Watching">Watching</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL (optional)</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating (optional)</Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
              placeholder="0.0 - 5.0"
            />
          </div>

          <div className="space-y-2">
            <Label>Genres</Label>
            <div className="flex gap-2">
              <Input
                value={formData.newGenre}
                onChange={(e) => setFormData((prev) => ({ ...prev, newGenre: e.target.value }))}
                onKeyPress={handleKeyPress}
                placeholder="Add genre..."
              />
              <Button type="button" onClick={addGenre} variant="outline">
                Add
              </Button>
            </div>
            {formData.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.genres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="flex items-center gap-1">
                    {genre}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeGenre(genre)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Add your thoughts, progress, or any notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{editItem ? "Update" : "Add"} Entry</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
