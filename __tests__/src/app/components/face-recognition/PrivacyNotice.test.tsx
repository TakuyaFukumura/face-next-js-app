/**
 * PrivacyNotice コンポーネントのテスト
 *
 * このテストファイルは、src/app/components/face-recognition/PrivacyNotice.tsx の機能をテストします。
 * プライバシー注意書きの表示内容をテストしています。
 */

import React from 'react';
import {render, screen} from '@testing-library/react';
import PrivacyNotice from '@/app/components/face-recognition/PrivacyNotice';
import '@testing-library/jest-dom';

describe('PrivacyNotice', () => {
    it('注意書きの見出しが表示される', () => {
        render(<PrivacyNotice />);
        expect(screen.getByText(/ご注意/)).toBeInTheDocument();
    });

    it('映像が送信されない旨が表示される', () => {
        render(<PrivacyNotice />);
        expect(screen.getByText(/映像・推論結果はサーバーへ送信されず/)).toBeInTheDocument();
    });

    it('推定値である旨が表示される', () => {
        render(<PrivacyNotice />);
        expect(screen.getByText(/推定値/)).toBeInTheDocument();
    });

    it('個人識別を行わない旨が表示される', () => {
        render(<PrivacyNotice />);
        expect(screen.getByText(/個人の識別/)).toBeInTheDocument();
    });

    it('センシティブ用途禁止の旨が表示される', () => {
        render(<PrivacyNotice />);
        expect(screen.getByText(/採用・医療・本人確認/)).toBeInTheDocument();
    });

    it('HTTPS要件の旨が表示される', () => {
        render(<PrivacyNotice />);
        expect(screen.getByText(/HTTPS/)).toBeInTheDocument();
    });
});
