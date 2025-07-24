interface MobileContainerProps {
  children: React.ReactNode;
}

export default function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="mobile-container">
      {children}
    </div>
  );
}
