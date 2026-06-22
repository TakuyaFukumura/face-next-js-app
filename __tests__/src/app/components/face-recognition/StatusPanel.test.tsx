/**
 * StatusPanel コンポーネントのテスト
 *
 * このテストファイルは、src/app/components/face-recognition/StatusPanel.tsx の機能をテストします。
 * 各アプリ状態に対応するメッセージの表示とエラー文言の表示をテストしています。
 */

import React from 'react';
import {render, screen} from '@testing-library/react';
import StatusPanel from '@/app/components/face-recognition/StatusPanel';
import '@testing-library/jest-dom';

describe('StatusPanel', () => {
    describe('状態メッセージの表示', () => {
        it('idle 状態で初期化中メッセージが表示される', () => {
            render(<StatusPanel status="idle" />);
            expect(screen.getByText('初期化中...')).toBeInTheDocument();
        });

        it('loadingModels 状態でモデル読み込み中メッセージが表示される', () => {
            render(<StatusPanel status="loadingModels" />);
            expect(screen.getByText('顔解析モデルを読み込み中...')).toBeInTheDocument();
        });

        it('modelError 状態でエラーメッセージが表示される', () => {
            render(<StatusPanel status="modelError" />);
            expect(screen.getByText('モデルの読み込みに失敗しました')).toBeInTheDocument();
        });

        it('startingCamera 状態でカメラ起動中メッセージが表示される', () => {
            render(<StatusPanel status="startingCamera" />);
            expect(screen.getByText('カメラを起動中...')).toBeInTheDocument();
        });

        it('cameraError 状態でカメラエラーメッセージが表示される', () => {
            render(<StatusPanel status="cameraError" />);
            expect(screen.getByText('カメラの取得に失敗しました')).toBeInTheDocument();
        });

        it('permissionDenied 状態で権限拒否メッセージが表示される', () => {
            render(<StatusPanel status="permissionDenied" />);
            expect(screen.getByText('カメラの使用が許可されていません')).toBeInTheDocument();
        });

        it('analyzing 状態で解析中メッセージが表示される', () => {
            render(<StatusPanel status="analyzing" />);
            expect(screen.getByText(/解析中/)).toBeInTheDocument();
        });

        it('noFace 状態で顔未検出メッセージが表示される', () => {
            render(<StatusPanel status="noFace" />);
            expect(screen.getByText('顔が検出されていません')).toBeInTheDocument();
        });
    });

    describe('解析中の顔数表示', () => {
        it('analyzing 状態で faceCount が 0 のとき顔数が表示されない', () => {
            render(<StatusPanel status="analyzing" faceCount={0} />);
            expect(screen.queryByText(/人検出/)).not.toBeInTheDocument();
        });

        it('analyzing 状態で faceCount が 1 のとき顔数が表示される', () => {
            render(<StatusPanel status="analyzing" faceCount={1} />);
            expect(screen.getByText(/1人検出/)).toBeInTheDocument();
        });

        it('analyzing 状態で faceCount が 3 のとき複数人が表示される', () => {
            render(<StatusPanel status="analyzing" faceCount={3} />);
            expect(screen.getByText(/3人検出/)).toBeInTheDocument();
        });
    });

    describe('エラーメッセージの詳細表示', () => {
        it('エラー状態で errorMessage が渡された場合に詳細が表示される', () => {
            render(
                <StatusPanel
                    status="modelError"
                    errorMessage="ネットワークエラーが発生しました"
                />,
            );
            expect(screen.getByText('ネットワークエラーが発生しました')).toBeInTheDocument();
        });

        it('エラー状態でも errorMessage が null の場合は詳細が表示されない', () => {
            render(<StatusPanel status="modelError" errorMessage={null} />);
            expect(screen.queryByText('ネットワークエラーが発生しました')).not.toBeInTheDocument();
        });

        it('通常状態では errorMessage があっても詳細が表示されない', () => {
            render(<StatusPanel status="analyzing" errorMessage="エラー" />);
            expect(screen.queryByText('エラー')).not.toBeInTheDocument();
        });
    });

    describe('アクセシビリティ', () => {
        it('role="status" が設定されている', () => {
            render(<StatusPanel status="analyzing" />);
            expect(screen.getByRole('status')).toBeInTheDocument();
        });

        it('aria-live="polite" が設定されている', () => {
            render(<StatusPanel status="analyzing" />);
            const statusEl = screen.getByRole('status');
            expect(statusEl).toHaveAttribute('aria-live', 'polite');
        });
    });

    describe('ローディングスピナー', () => {
        it('loadingModels 状態でスピナーが表示される', () => {
            const {container} = render(<StatusPanel status="loadingModels" />);
            expect(container.querySelector('.animate-spin')).toBeInTheDocument();
        });

        it('analyzing 状態でスピナーが表示されない', () => {
            const {container} = render(<StatusPanel status="analyzing" />);
            expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
        });
    });
});
