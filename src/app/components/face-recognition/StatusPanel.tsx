'use client';

import React from 'react';
import type {AppStatus} from '@/app/lib/face-recognition/types';

interface StatusPanelProps {
    status: AppStatus;
    errorMessage?: string | null;
    faceCount?: number;
}

const STATUS_MESSAGES: Record<AppStatus, string> = {
    idle: '初期化中...',
    loadingModels: '顔解析モデルを読み込み中...',
    modelError: 'モデルの読み込みに失敗しました',
    startingCamera: 'カメラを起動中...',
    cameraError: 'カメラの取得に失敗しました',
    permissionDenied: 'カメラの使用が許可されていません',
    analyzing: '解析中',
    noFace: '顔が検出されていません',
};

/**
 * アプリの現在の状態・エラー文言を表示するパネル。
 */
export default function StatusPanel({status, errorMessage, faceCount = 0}: StatusPanelProps) {
    const isError =
        status === 'modelError' || status === 'cameraError' || status === 'permissionDenied';
    const isLoading = status === 'loadingModels' || status === 'startingCamera' || status === 'idle';
    const isAnalyzing = status === 'analyzing';

    return (
        <div
            role="status"
            aria-live="polite"
            className="mt-4 px-4 py-3 rounded-lg text-sm text-center"
        >
            <div className="flex items-center justify-center gap-2">
                {isLoading && (
                    <span
                        className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                        aria-hidden="true"
                    />
                )}
                <span
                    className={
                        isError
                            ? 'text-red-600 dark:text-red-400 font-medium'
                            : isAnalyzing
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-600 dark:text-gray-400'
                    }
                >
                    {STATUS_MESSAGES[status]}
                    {isAnalyzing && faceCount > 0 && `（${faceCount}人検出）`}
                </span>
            </div>
            {isError && errorMessage && (
                <p className="mt-2 text-red-500 dark:text-red-400 text-xs">{errorMessage}</p>
            )}
        </div>
    );
}
