import { useRef, useState, useEffect } from "react";
import "./InvestRangeType.css"

type InvestRangeOpts = {
    min: number,
    max: number,
    step: number,
    name: string,
    label: string,
    defaultValue?: number,
    onChange: (input: React.RefObject<HTMLInputElement|null>) => void
}

export default function InvestRangeType(opts: InvestRangeOpts) {
    const selfRef = useRef<HTMLInputElement|null>(null);
    const [currentValue, setCurrentValue] = useState(opts.defaultValue || opts.min);
    const randId = (Math.random() * 10000 % 9999).toString();
    
    const handleChange = () => {
        if (selfRef.current) {
            setCurrentValue(Number(selfRef.current.value));
            // Calculate percentage for filled track
            const percentage = ((Number(selfRef.current.value) - opts.min) / (opts.max - opts.min)) * 100;
            selfRef.current.style.setProperty('--value', `${percentage}%`);
        }
        opts.onChange(selfRef);
    };

    // Set initial percentage on mount
    useEffect(() => {
        if (selfRef.current) {
            const percentage = ((currentValue - opts.min) / (opts.max - opts.min)) * 100;
            selfRef.current.style.setProperty('--value', `${percentage}%`);
        }
    }, [currentValue, opts.min, opts.max]);

    return (
        <div className="invest-range">
            <label htmlFor={randId}>{opts.label}</label>
            <div style={{ marginBottom: '10px', position: "relative"}}>
                <span>{opts.min}</span>
                <span className="current-value" style={{ 
                    position: "absolute",
                    top: "-35px",
                    left: `${parseInt(selfRef.current?.value || '0')  / opts.max * (selfRef.current?.offsetWidth || 0)}px`
                }}>{currentValue}</span>
                <input 
                    ref={selfRef}
                    type="range" 
                    name={opts.name} 
                    id={randId} 
                    value={currentValue}
                    onChange={handleChange}
                    min={opts.min}
                    max={opts.max}
                    step={opts.step}
                />
                <span>{opts.max}</span>
            </div>
            
        </div>
    );
};