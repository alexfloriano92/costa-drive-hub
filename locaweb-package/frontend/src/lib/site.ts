export const SITE = {
  name: "Costa Veículos",
  tagline: "Seminovos com procedência e garantia",
  phone: "(35) 99815-1851",
  whatsappRaw: "5535998151851",
  address: "Rod. Pref. João Belmiro da Costa, 146 - Centro, Cachoeira de Minas - MG, 37545-000",
  instagram: "https://www.instagram.com/veiculos.costa",
  hours: [
    { day: "Segunda-feira", time: "08:00 – 18:00" },
    { day: "Terça-feira",   time: "08:00 – 18:00" },
    { day: "Quarta-feira",  time: "08:00 – 18:00" },
    { day: "Quinta-feira",  time: "08:00 – 18:00" },
    { day: "Sexta-feira",   time: "08:00 – 18:00" },
    { day: "Sábado",        time: "08:00 – 12:00" },
    { day: "Domingo",       time: "Fechado" },
  ],
};

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(message ?? "Olá! Tenho interesse em um veículo da Costa Veículos.");
  return `https://api.whatsapp.com/send?phone=${SITE.whatsappRaw}&text=${text}`;
}

export function formatBRL(value: number | string) {
  const n = typeof value === "string" ? Number(value) : value;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

export function formatKm(value: number) {
  return `${value.toLocaleString("pt-BR")} km`;
}
