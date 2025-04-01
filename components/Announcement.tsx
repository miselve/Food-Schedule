export function Announcement() {
  return (
    <div className={`relative bg-red-100 border-yellow-500 text-yellow-700 rounded-lg overflow-hidden transition-all duration-300 ease-in-out ? 'h-auto' : 'h-12'}`} role="alert">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="font-bold">To εστιατόριο θα μείνει κλειστό απο 14/04 μέχρι 25/4</p>
      </div>
    </div>
  );
}


