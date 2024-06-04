import { MAX_ANIMATION_SPEED, MIN_ANIMATION_SPEED } from "@/lib/utils";
import React from "react";

// Controls the speed of the animation
export const SpeedSlider = ({
    min = MIN_ANIMATION_SPEED,
    max = MAX_ANIMATION_SPEED,
    step = 10,
    value,
    isDisable = false,
    handleChange
}: {
   min?: number;
   max?: number;
   step?: number;
   value?: number;
   isDisable?: boolean;
   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) =>{
    return (
        <div className="flex gap-2 items-center justify-center">
            <span className="text-center text-gray-300">Slow</span>
            <input className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                disabled={isDisable}
                onChange={handleChange}
            />
            <span className="text-center text-gray-300">Fast</span>
        </div>
    );
};