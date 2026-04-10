"use client";

import { useState, useEffect, useRef } from "react";
import { generateComment, getCommentInterval } from "@/game/comments";
import { t } from "@/game/i18n";

interface Comment {
  id: number;
  text: string;
}

let commentId = 0;

interface Props {
  subscribers: number;
}

export function CommentFeed({ subscribers }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const text = generateComment(subscribers);
      setComments((prev) => {
        const next = [...prev, { id: commentId++, text }];
        return next.slice(-20);
      });
    }, getCommentInterval(subscribers));

    return () => clearInterval(interval);
  }, [subscribers]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [comments]);

  return (
    <div
      ref={containerRef}
      className="mx-4 h-28 overflow-hidden rounded-lg bg-gray-800/60 border border-gray-700/50 px-3 py-2"
    >
      {comments.map((c) => (
        <div key={c.id} className="text-sm py-0.5 animate-fade-in">
          <span className="text-gray-500">&#9679;</span>{" "}
          <span className="text-gray-300">{c.text}</span>
        </div>
      ))}
      {comments.length === 0 && (
        <div className="text-gray-500 text-sm">{t("comments.waiting")}</div>
      )}
    </div>
  );
}
