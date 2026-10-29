interface GoogleIconProps {
  className?: string;
}

/**
 * Logotipo oficial do Google como SVG inline (marca de quatro cores).
 */
export default function GoogleIcon({ className }: GoogleIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.6 12.28c0-.86-.08-1.7-.23-2.5H12.2v4.73h6.4a5.64 5.64 0 0 1-2.44 3.7v3.08h3.94c2.3-2.12 3.5-5.23 3.5-9Z"
        fill="#4285F4"
      />
      <path
        d="M12.2 24c3.3 0 6.07-1.1 8.1-2.98l-3.94-3.07c-1.1.74-2.5 1.17-4.16 1.17-3.19 0-5.9-2.16-6.86-5.06H1.27v3.17A12.24 12.24 0 0 0 12.2 24Z"
        fill="#34A853"
      />
      <path
        d="M5.34 14.06a7.36 7.36 0 0 1 0-4.7V6.19H1.27a12.3 12.3 0 0 0 0 11L5.34 14.06Z"
        fill="#FBBC05"
      />
      <path
        d="M12.2 4.76c1.8 0 3.41.62 4.68 1.83l3.5-3.5C18.26 1.14 15.5 0 12.2 0A12.24 12.24 0 0 0 1.27 6.19l4.07 3.17C6.3 6.92 9 4.76 12.2 4.76Z"
        fill="#EA4335"
      />
    </svg>
  );
}
