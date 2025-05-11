import React, { useEffect, useRef } from 'react';

const PaymobPayment = ({ paymentToken, onPaymentSuccess, onPaymentFailure }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!paymentToken) return;

    const iframeSrc = \`https://accept.paymob.com/api/acceptance/iframes/920204?payment_token=\${paymentToken}\`;

    if (iframeRef.current) {
      iframeRef.current.src = iframeSrc;
    }

    // Listen for messages from the iframe for payment status
    const handleMessage = (event) => {
      if (event.origin !== 'https://accept.paymob.com') return;

      const data = event.data;
      if (data && data.success) {
        onPaymentSuccess(data);
      } else if (data && data.failed) {
        onPaymentFailure(data);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [paymentToken, onPaymentSuccess, onPaymentFailure]);

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <iframe
        ref={iframeRef}
        title="Paymob Payment"
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
};

export default PaymobPayment;
