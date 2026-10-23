"use client";

import { useState } from "react";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { HALLOWEEN_FLYER, HALLOWEEN_LINK } from "@/lib/campaign";

/**
 * Halloween flyer pop-up, home page only. Opens on every load (nothing is
 * remembered), with the close button above the flyer; the flyer itself links to
 * the event in a new tab and leaves the pop-up open for the visitor to close.
 */
export function HalloweenPopup() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/80"
        // A definite width, not `w-fit`: with a fit-to-content box the image's own
        // `max-w-full` resolves against itself and the flyer collapses to a thumbnail.
        // 92vw on a phone, 560px on a desktop, and never so wide that the 4:5 flyer
        // (plus the close button) outgrows the screen height.
        className="w-[min(92vw,560px,calc((100dvh_-_6rem)_*_0.8))] max-w-none gap-3 rounded-none border-0 bg-transparent p-0 shadow-none sm:max-w-none"
      >
        <DialogTitle className="sr-only">Halloween event: The Further</DialogTitle>
        <DialogDescription className="sr-only">
          Opens the event page in a new tab.
        </DialogDescription>

        <div className="flex justify-end">
          <DialogClose
            aria-label="Close"
            className="flex size-9 cursor-pointer items-center justify-center bg-white text-black transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <XIcon className="size-5" />
          </DialogClose>
        </div>

        <a href={HALLOWEEN_LINK} target="_blank" rel="noopener noreferrer" className="block">
          <Image
            src={HALLOWEEN_FLYER}
            alt="The Further: Halloween at SwillFam. Tap for event details."
            width={1400}
            height={1750}
            sizes="(max-width: 640px) 92vw, 560px"
            priority
            className="h-auto w-full"
          />
        </a>
      </DialogContent>
    </Dialog>
  );
}
