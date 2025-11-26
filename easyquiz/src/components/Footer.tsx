export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-5 mt-16">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} EasyQuiz. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}