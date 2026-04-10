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

const AVATARS = ["\u{1F9D1}", "\u{1F468}", "\u{1F469}", "\u{1F466}", "\u{1F467}", "\u{1F474}", "\u{1F475}", "\u{1F478}"];

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
      className="mx-4 h-28 overflow-hidden rounded-xl bg-gradient-to-b from-[#141b2d] to-[#0d1220] border border-indigo-900/30 px-3 py-2"
    >
      {comments.map((c) => (
        <div key={c.id} className="text-sm py-0.5 animate-fade-in flex items-center gap-1.5">
          <span className="text-xs">{AVATARS[c.id % AVATARS.length]}</span>
          <span className="text-gray-300">{c.text}</span>
        </div>
      ))}
      {comments.length === 0 && (
        <div className="text-gray-600 text-sm">{t("comments.waiting")}</div>
      )}
    </div>
  );
}
