import React, { useState, useEffect } from 'react';

interface ExternalLinkModalProps {
    url: string;
    onClose: () => void;
}

const ExternalLinkModal: React.FC<ExternalLinkModalProps> = ({ url, onClose }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
        } catch (err) {
            console.error('Failed to copy link', err);
            // Fallback for older browsers or secure context issues in WebViews
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                setCopied(true);
            } catch (copyErr) {
                console.error('Fallback copy failed', copyErr);
            }
            document.body.removeChild(textArea);
        }
    };

    const handleOpen = () => {
        // Since custom schemes like market:// or intent:// crash naive webviews,
        // we strictly use standard https:// URLs when opening.
        let targetUrl = url;
        if (url.startsWith('market://details?id=')) {
            const appId = url.split('market://details?id=')[1];
            targetUrl = `https://play.google.com/store/apps/details?id=${appId}`;
        }
        window.open(targetUrl, '_blank');
        onClose();
    };

    // Human readable host name
    let domainName = '';
    try {
        const parsed = new URL(url);
        domainName = parsed.hostname;
    } catch (e) {
        domainName = url;
    }

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in" 
            dir="rtl"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-md bg-surface border border-border-default rounded-2xl shadow-2xl overflow-hidden transform scale-100 transition-transform duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-5 border-b border-border-subtle bg-surface-subtle flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">تنبيه: مغادرة التطبيق</h3>
                        <p className="text-xs text-text-muted mt-0.5">أنت على وشك فتح رابط خارجي</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-sm text-text-secondary leading-relaxed">
                        بسبب قيود نظام الأندرويد لبعض متصفحات التطبيقات الداخلية (WebView)، قد يؤدي فتح الرابط مباشرة إلى <span className="font-bold text-text-primary">صعوبة العودة للتطبيق</span> أو عدم عمل الرابط بشكل صحيح.
                    </p>
                    
                    <div className="p-3 bg-surface-subtle border border-border-subtle rounded-xl flex items-center justify-between gap-3">
                        <div className="overflow-hidden text-right w-full">
                            <p className="text-xs text-text-muted font-mono truncate">{domainName}</p>
                            <p className="text-xs text-primary-text font-mono truncate mt-0.5" dir="ltr">{url}</p>
                        </div>
                    </div>

                    <p className="text-xs text-text-muted">
                        💡 <span className="font-semibold text-text-secondary">الحل الأفضل والموصى به:</span> قم بنسخ الرابط ثم افتحه يدويًا في متصفحك الأساسي (مثل Chrome أو Safari) لتجنب انقطاع تصفحك للقرآن الكريم.
                    </p>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-surface-subtle border-t border-border-subtle flex flex-col sm:flex-row-reverse gap-2">
                    <button
                        onClick={handleCopy}
                        className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                            copied 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg'
                        }`}
                    >
                        {copied ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                <span>تم نسخ الرابط بنجاح!</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v10.125c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-11-11.25V18.75" />
                                </svg>
                                <span>نسخ الرابط لفتحه يدويًا</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleOpen}
                        className="w-full sm:w-auto py-2.5 px-4 bg-surface border border-border-default hover:bg-surface-hover text-text-primary rounded-xl text-sm font-medium transition-colors"
                    >
                        فتح الرابط مباشرة
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto py-2.5 px-4 bg-transparent hover:bg-surface-hover text-text-muted hover:text-text-primary rounded-xl text-sm font-medium transition-colors"
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExternalLinkModal;
