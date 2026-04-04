import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function GetStartedButton() {
  return (
    <Button className="cursor-pointer group relative overflow-hidden h-12 px-8 rounded-md bg-[#2e2721] hover:bg-[#2A1D15] text-white border-none transition-all shadow-md" size="lg">
      <span className="mr-6 transition-opacity duration-500 group-hover:opacity-0 font-bold tracking-widest text-xs uppercase">
        Book Now
      </span>
      <i className="absolute right-1 top-1 bottom-1 rounded-md z-10 grid w-10 place-items-center transition-all duration-500 bg-white/10 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-white">
        <ChevronRight size={18} strokeWidth={2.5} aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1" />
      </i>
    </Button>
  );
}
