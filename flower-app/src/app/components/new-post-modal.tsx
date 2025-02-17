// components/new-post-modal.tsx
"use client";

import { useState } from "react";
import { useCsrfToken } from "@/hooks/useCsrfToken";
import { ImageIcon, Flower, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area"

interface NewPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated?: () => void;
}

export function NewPostModal({ isOpen, onClose, onPostCreated }: NewPostModalProps) {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");
    const csrfToken = useCsrfToken();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            if (image) {
                formData.append("image_url", image);
            }
            formData.append("caption", caption);
            if (tags.length > 0) {
              tags.forEach((tag) => formData.append("tags", tag));
            }
            const res = await fetch("https://127.0.0.1:8000/api/posts/", {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CSRFToken": csrfToken,
                },
                body: formData,
            });
            if (!res.ok) {
                throw new Error(`投稿に失敗しました (status: ${res.status})`);
            }

            onClose();
            if (onPostCreated) {
                onPostCreated();
            }            
            setCaption("");
            setImage(null);
            setTags([]);
            setCurrentTag("");

        } catch (error) {
            console.error("投稿エラー:", error);
            alert("投稿に失敗しました。");
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        const fileInput = document.getElementById("image") as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleAddTag = () => {
        if (currentTag.trim() !== "" && !tags.includes(currentTag.trim())) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") { 
            e.preventDefault();
            handleAddTag();
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] w-full">
                <DialogHeader>
                    <DialogTitle>新規投稿</DialogTitle>

                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 画像アップロード */}
                    <div className="space-y-2">
                        <label htmlFor="image" className="block text-sm font-medium">
                            画像
                        </label>
                        <div className="flex items-center space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => document.getElementById("image")?.click()}
                            >
                                <ImageIcon className="h-4 w-4" />
                            </Button>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            {image ? (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-muted-foreground">{image.name}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleRemoveImage}
                                        aria-label="選択した画像を削除"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <span className="text-sm text-muted-foreground">
                                    画像を選択してください
                                </span>
                            )}
                        </div>
                        {image && (
                            <div className="mt-2">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="選択した画像のプレビュー"
                                    className="max-h-64 object-cover mx-auto"
                                />
                            </div>
                        )}
                    </div>

                    {/* キャプション */}
                    <div className="space-y-2">
                        <label htmlFor="caption" className="block text-sm font-medium">
                            キャプション
                        </label>
                        <Textarea
                            id="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="あなたの花の物語を共有しましょう..."
                            rows={4}
                        />
                    </div>

                    {/* タグ入力 */}
                    <div className="space-y-2">
                        <label htmlFor="tags" className="block text-sm font-medium">
                            タグ (カンマまたはEnterで区切って追加)
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                            <Input
                                type="text"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder="タグを入力..."
                                className="flex-1 min-w-0"
                            />
                            <Button type="button" variant="outline" size="icon" onClick={handleAddTag} disabled={!currentTag.trim()}>
                                <Tag className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                            <ScrollArea className="h-28 w-full">
                                <div className="flex flex-wrap gap-1">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="mr-1">
                                        {tag}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="ml-1 rounded-full p-0 h-4 w-4"
                                            onClick={() => handleRemoveTag(tag)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                                </div>
                            </ScrollArea>
                        </div>

                    </div>

                    <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? "投稿中..." : (
                            <>
                                <Flower className="mr-2 h-4 w-4" />
                                投稿する
                            </>
                        )}
                    </Button>

                </form>
            </DialogContent>
        </Dialog>
    );
}