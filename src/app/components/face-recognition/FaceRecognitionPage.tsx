'use client';

import React, {useEffect, useRef, useState} from 'react';
import CameraView from './CameraView';
import OverlayCanvas from './OverlayCanvas';
import StatusPanel from './StatusPanel';
import PrivacyNotice from './PrivacyNotice';
import {useCamera} from '@/app/hooks/useCamera';
import {useFaceApiModels} from '@/app/hooks/useFaceApiModels';
import {useFaceDetection} from '@/app/hooks/useFaceDetection';
import type {AppStatus} from '@/app/lib/face-recognition/types';

/**
 * リアルタイム顔検出・属性推定アプリ全体を統括するコンポーネント。
 */
export default function FaceRecognitionPage() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [containerSize, setContainerSize] = useState<{width: number; height: number}>();

    const {modelsLoaded, modelsLoading, modelError} = useFaceApiModels();
    const {videoRef, isStreaming, cameraError, startCamera} = useCamera();
    const {detections} = useFaceDetection({
        enabled: modelsLoaded && isStreaming,
        videoRef,
        canvasRef,
    });

    // カメラ自動起動
    useEffect(() => {
        startCamera();
    }, [startCamera]);

    // コンテナリサイズの監視
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    // アプリ状態の導出
    const appStatus: AppStatus = (() => {
        if (modelError) return 'modelError';
        if (cameraError) {
            if (cameraError.includes('許可されていません')) return 'permissionDenied';
            return 'cameraError';
        }
        if (modelsLoading) return 'loadingModels';
        if (!isStreaming) return 'startingCamera';
        if (detections.length === 0) return 'noFace';
        return 'analyzing';
    })();

    const errorMessage = modelError ?? cameraError ?? null;

    return (
        <div className="flex flex-col items-center px-4 py-8 min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                リアルタイム顔検出・属性推定
            </h1>

            {/* 映像 + オーバーレイ */}
            <div
                ref={containerRef}
                className="relative w-full max-w-2xl aspect-video bg-black rounded-xl overflow-hidden shadow-lg"
            >
                <CameraView videoRef={videoRef} />
                <OverlayCanvas canvasRef={canvasRef} containerSize={containerSize} />
            </div>

            {/* ステータス */}
            <StatusPanel
                status={appStatus}
                errorMessage={errorMessage}
                faceCount={detections.length}
            />

            {/* プライバシー注意書き */}
            <div className="w-full max-w-2xl">
                <PrivacyNotice />
            </div>
        </div>
    );
}
