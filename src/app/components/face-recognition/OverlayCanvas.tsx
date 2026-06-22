'use client';

import React, {useEffect} from 'react';

interface OverlayCanvasProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    /** canvas の表示サイズ再同期をトリガーする依存値（コンテナの幅・高さが変化したとき更新） */
    containerSize?: {width: number; height: number};
}

/**
 * カメラ映像の上に絶対配置され、顔検出結果を描画する `<canvas>` 要素。
 */
export default function OverlayCanvas({canvasRef, containerSize}: OverlayCanvasProps) {
    // コンテナサイズが変化したら canvas の解像度を更新する
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }, [canvasRef, containerSize]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        />
    );
}
