import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Share2, Check, Copy, Twitter, Linkedin, Mail } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  content: string;
  url: string;
  symbol?: string;
}

export function ShareButton({ title, content, url, symbol }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: content,
          url
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopy();
    }
  };

  const shareToTwitter = () => {
    const text = symbol 
      ? `Check out this analysis for $${symbol}!\n${content}`
      : content;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank');
  };

  const shareViaEmail = () => {
    const subject = symbol 
      ? `Analysis for $${symbol}`
      : title;
    const body = `${content}\n\nRead more: ${url}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="flex items-center gap-2"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copy Link</span>
          </>
        )}
      </Button>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={shareToTwitter}
          className="p-2"
        >
          <Twitter className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={shareToLinkedIn}
          className="p-2"
        >
          <Linkedin className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={shareViaEmail}
          className="p-2"
        >
          <Mail className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
