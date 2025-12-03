import { useEffect, useState } from "react";
import { loadUser } from "../services/userServices";
export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const data = await loadUser();
      setUser(data);
    }
    
    fetchUser();
  }, []);

  return (
    <div >
      <h1>Profile</h1>
      {user ? (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
}
