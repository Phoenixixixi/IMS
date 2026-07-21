import * as React from "react"
import { ChevronDown } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DropdownItem {
    value: string
    label: string
}

interface DropdownMenuRadioProps {
    title: string
    data: DropdownItem[]
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
}

export function DropdownMenuRadio({ title, data, value, onValueChange, placeholder }: DropdownMenuRadioProps) {
    const selectedLabel = data.find(d => d.value === value)?.label

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-between gap-2 w-full h-12 px-4 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/20 backdrop-blur-sm text-white text-sm font-semibold focus:outline-none">
                    <span className={selectedLabel ? 'text-white' : 'text-white/50'}>
                        {selectedLabel ?? placeholder ?? title}
                    </span>
                    <ChevronDown size={16} className="text-white/60 shrink-0" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" avoidCollisions={false} className="w-56 bg-slate-900/90 backdrop-blur-md border border-white/10 text-white shadow-xl rounded-xl max-h-64 overflow-y-auto">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-white/50 text-xs uppercase tracking-widest px-3 pt-2 pb-1">
                        {title}
                    </DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={value ?? ''} onValueChange={onValueChange}>
                        {data.map((item) => (
                            <DropdownMenuRadioItem
                                key={item.value}
                                value={item.value}
                                className="text-white/80 hover:text-white focus:bg-white/10 focus:text-white rounded-lg mx-1"
                            >
                                {item.label}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
