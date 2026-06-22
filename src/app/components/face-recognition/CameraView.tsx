'use client';

import React from 'react';

interface CameraViewProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
}

/**
 * カメラ映像を表示する `<video>` 要素を管理するコンポーネント。
 */
export default function CameraView({videoRef}: CameraViewProps) {
    return (
        <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            aria-label="カメラ映像"
        />
    );
}
