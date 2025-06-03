import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <section id="AdminDashboard" className="prose max-w-none">
      <h2 className="mb-6 text-3xl font-bold text-gray-900">Admin Dashboard</h2>

      <p className="text-lg text-gray-700">
        This guide will walk you through how to use the admin dashboard effectively.
      </p>

      <p className="mb-8 text-lg text-gray-700">
        The admin dashboard is a powerful tool for managing your NFT collections. You can create,
        configure, and optimize your collections with ease.
      </p>

      <div className="mx-auto mb-8 max-w-3xl rounded-lg bg-gray-50 p-6 shadow-sm">
        <img
          src="/docs/login.png"
          alt="Login screen"
          className="mx-auto w-full rounded-lg shadow-md"
        />
      </div>

      <p className="mb-8 text-gray-700">
        When you first access the admin page, you'll see a screen like above. Log in using your
        preferred wallet. Ensure you are on the <strong>Admin</strong> tab.
      </p>

      <div className="mx-auto mb-8 max-w-3xl rounded-lg bg-gray-50 p-6 shadow-sm">
        <img
          src="/docs/createNewCollection.png"
          alt="Create New Collection"
          className="mx-auto w-full max-w-2xl rounded-lg shadow-md"
        />
      </div>

      <div className="space-y-4 text-gray-700">
        <p>
          After logging in, you'll see the "Create Collection" modal if you don’t have any
          collections yet.
        </p>
        <p>
          You can create a new collection by entering the collection name, description, and
          uploading a banner image.
        </p>
        <p>Layers can be added to define the visual components that make up your NFTs.</p>
        <p>
          Once you're ready, click the <strong>Create Collection</strong> button to initiate the
          on-chain transaction.
        </p>
      </div>
    </section>
  );
};

export default AdminDashboard;
