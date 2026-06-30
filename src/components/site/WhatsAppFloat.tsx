import { whatsappLink } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] pl-3 pr-5 py-3 text-white shadow-2xl hover:scale-105 transition-transform"
    >
      <WhatsAppIcon className="size-7" />
      <span className="text-sm font-medium hidden sm:inline">Fale conosco</span>
    </a>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.144-.73.115-1.103-.07-.157-2.464-1.39-2.578-1.39zm-2.84 7.063h-.012a9.93 9.93 0 0 1-5.062-1.386l-.36-.215-3.75.983 1-3.66-.236-.377A9.918 9.918 0 0 1 6.336 14.2c.002-5.484 4.466-9.945 9.953-9.945a9.88 9.88 0 0 1 7.034 2.918 9.872 9.872 0 0 1 2.913 7.034c-.003 5.485-4.467 9.947-9.95 9.947m8.464-18.41A11.815 11.815 0 0 0 16.29 2.4C9.726 2.4 4.386 7.74 4.384 14.3a11.86 11.86 0 0 0 1.59 5.95L4.282 26.4l6.305-1.654a11.873 11.873 0 0 0 5.683 1.448h.005c6.562 0 11.903-5.34 11.906-11.9a11.83 11.83 0 0 0-3.487-8.434"/>
    </svg>
  );
}
