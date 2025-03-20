export default function Header() {
  return (
    <div className="absolute h-48 bg-gradient-to-r from-blue-500 to-blue-400">
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Type"
          className="rounded-lg px-4 py-2 shadow-md focus:outline-none"
        />
        <button className="text-white">Sign In</button>
      </div>
    </div>
  );
}
