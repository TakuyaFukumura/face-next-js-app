'use client';

import {useCallback, useEffect, useRef, useState} from 'react';

type CameraErrorType = 'permissionDenied' | 'notFound' | 'unsupported' | 'unknown';

interface UseCameraReturn {
    /** カメラ映像を表示する video 要素への ref */
    videoRef: React.RefObject<HTMLVideoElement | null>;
    /** カメラが起動し映像が再生中かどうか */
    isStreaming: boolean;
    /** カメラ取得時のエラーメッセージ。エラーなしの場合は null */
    cameraError: string | null;
    /** カメラエラーの種別。エラーなしの場合は null */
    cameraErrorType: CameraErrorType | null;
    /** カメラを起動する */
    startCamera: () => Promise<void>;
    /** カメラを停止する */
    stopCamera: () => void;
}

/**
 * カメラ (getUserMedia) の起動・停止・stream 管理を行うフック。
 * コンポーネントのアンマウント時に自動でカメラを停止する。
 */
export function useCamera(): UseCameraReturn {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [cameraErrorType, setCameraErrorType] = useState<CameraErrorType | null>(null);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsStreaming(false);
    }, []);

    const startCamera = useCallback(async () => {
        setCameraError(null);
        setCameraErrorType(null);

        if (!navigator.mediaDevices?.getUserMedia) {
            setCameraError(
                'このブラウザはカメラに対応していません。Chrome・Edge・Safari の最新版をご利用ください。',
            );
            setCameraErrorType('unsupported');
            return;
        }

        if (streamRef.current) {
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {facingMode: 'user'},
                audio: false,
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            const error = err as DOMException;
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                setCameraError(
                    'カメラの使用が許可されていません。ブラウザの設定からカメラへのアクセスを許可してから、ページを再読み込みしてください。',
                );
                setCameraErrorType('permissionDenied');
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                setCameraError('カメラが見つかりません。カメラが接続されているか確認してください。');
                setCameraErrorType('notFound');
            } else {
                setCameraError(`カメラの起動に失敗しました: ${error.message}`);
                setCameraErrorType('unknown');
            }
        }
    }, []);

    // video の再生開始を検知して isStreaming を更新
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handlePlaying = () => setIsStreaming(true);
        video.addEventListener('playing', handlePlaying);
        return () => {
            video.removeEventListener('playing', handlePlaying);
        };
    }, []);

    // アンマウント時にカメラ停止
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stopCamera]);

    return {videoRef, isStreaming, cameraError, cameraErrorType, startCamera, stopCamera};
}
