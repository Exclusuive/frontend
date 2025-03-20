import ProfileCard from "@/components/ProfileCard";

export default function ProfilePage() {
  return (
    <div className="h-full min-h-screen w-full bg-gray-100">
      {/* Projects Section */}
      <div className="bg-banner mx-auto h-48 w-full"></div>
      <ProfileCard />
      <div className="mx-auto mt-8 grid w-full max-w-screen-xl grid-cols-1 gap-6 md:grid-cols-3">
        {["Modern", "Scandinavian", "Minimalist"].map((project, index) => (
          <div key={index} className="overflow-hidden rounded-lg bg-white shadow-md">
            <div className="h-40 bg-gray-300"></div>
            <div className="p-4">
              <h3 className="font-semibold">
                Project #{index + 1} {project}
              </h3>
              <p className="text-sm text-gray-500">Project description...</p>
              <div className="mt-4 flex justify-between">
                <button className="text-blue-500">VIEW Status</button>
                {index === 0 && <button className="rounded border px-4 py-1">Manage</button>}
              </div>
            </div>
          </div>
        ))}

        {/* Create New Project Card */}
        <div className="flex items-center justify-center rounded-lg bg-white p-6 shadow-md">
          <button className="text-gray-500">+ Create a New Project</button>
        </div>
      </div>
    </div>
  );
}
