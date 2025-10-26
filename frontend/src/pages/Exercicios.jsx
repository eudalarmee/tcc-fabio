import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Exercicios() {
  return (
    <>
      <Header />
      <main id="treinos" className="min-h-[80vh] p-10 bg-white max-w-6xl mx-auto rounded-lg shadow-lg mt-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">
          Exercícios com Realidade Aumentada
        </h1>
        <p className="text-gray-700 text-lg">
          Aqui você encontrará exercícios com suporte de realidade aumentada — funcionalidade em desenvolvimento.
        </p>
      </main>
      <Footer />
    </>
  );
}
