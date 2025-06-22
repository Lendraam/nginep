export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white text-center p-4 mt-10">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} NginepAja. Seluruh hak cipta dilindungi.
      </p>
      <p className="text-xs mt-1">Fokus Akomodasi Wilayah Bandung Timur</p>
    </footer>
  );
}
