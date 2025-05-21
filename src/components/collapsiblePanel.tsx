import { ReactNode, useState, useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";

interface CollapsiblePanelProps {
  title: string;
  children: ReactNode;
}

const CollapsiblePanel = ({ title, children }: CollapsiblePanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("60px");

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setMaxHeight(`${60 + contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("60px");
    }
  }, [isExpanded]);

  return (
    <div
      className="w-full bg-white rounded-xl overflow-hidden transition-all duration-300"
      style={{ maxHeight }}
    >
      <div
        className="flex justify-between items-center px-10 h-[60px] cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-lg font-medium leading-none">{title}</span>
        <ChevronRight
          className={`w-5 h-5 transition-transform duration-300 ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </div>

      <div ref={contentRef} className="px-10 py-4">
        {children}
      </div>
    </div>
  );
};

export default CollapsiblePanel;
