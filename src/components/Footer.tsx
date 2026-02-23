export default function Footer() {
  return (
    <footer className="relative h-screen overflow-hidden bg-[#F3EFE9]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/agency-office/1920/1080" 
          alt="Office" 
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Huge Footer Text */}
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none select-none">
        <h2 className="text-white text-[25vw] font-black tracking-tighter leading-[0.65] whitespace-nowrap">
          3xHike
        </h2>
      </div>
    </footer>
  );
}
