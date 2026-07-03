import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { RequireAdmin } from "@/components/RequireAdmin";
import Home from "@/pages/Home";
import Estoque from "@/pages/Estoque";
import Veiculo from "@/pages/Veiculo";
import Contato from "@/pages/Contato";
import Auth from "@/pages/Auth";
import AdminLayout from "@/pages/AdminLayout";
import AdminList from "@/pages/AdminList";
import AdminNew from "@/pages/AdminNew";
import AdminEdit from "@/pages/AdminEdit";
import NotFound from "@/pages/NotFound";

export default function App() {
  const { pathname } = useLocation();
  const chrome = !pathname.startsWith("/admin") && !pathname.startsWith("/auth");
  return (
    <>
      {chrome && <Header />}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/veiculo/:id" element={<Veiculo />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route index element={<AdminList />} />
            <Route path="novo" element={<AdminNew />} />
            <Route path=":id" element={<AdminEdit />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {chrome && <Footer />}
      {chrome && <WhatsAppFloat />}
    </>
  );
}
