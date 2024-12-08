import { useEffect, useRef, useState } from "react";

// Inspired by https://2019.wattenberger.com/blog/react-and-d3

export interface ChartDimensions {
    width?: number;
    height?: number;
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
    boundedWidth: number;
    boundedHeight: number;
}

// Combine the default margins with the passed dimensions
function combineChartDimensions(dimensions: Partial<ChartDimensions>): ChartDimensions {
    const defaultMargins = {
        marginTop: 10,
        marginRight: 10,
        marginBottom: 40,
        marginLeft: 75,
    };

    const parsedDimensions = {
        ...defaultMargins,
        ...dimensions,
    };

    return {
        ...parsedDimensions,
        boundedWidth: Math.max(
            (parsedDimensions.width || 0) - parsedDimensions.marginLeft - parsedDimensions.marginRight,
            0
        ),
        boundedHeight: Math.max(
            (parsedDimensions.height || 0) - parsedDimensions.marginTop - parsedDimensions.marginBottom,
            0
        ),
    };
}

export default function useChartDimensions(passedSettings: Partial<ChartDimensions> = {}) {
    const ref = useRef<null | HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState(() => combineChartDimensions(passedSettings));

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            setDimensions((prevDimensions) => combineChartDimensions({
                ...prevDimensions,
                width: entry.contentRect.width || prevDimensions.width || 0,
                height: entry.contentRect.height || prevDimensions.height || 0,
            }));
        });

        resizeObserver.observe(element);
        return () => resizeObserver.unobserve(element);
    }, []);

    return [ref, dimensions] as const;
}