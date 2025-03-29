const BaseUrl =
  "https://gritsquare-default-rtdb.europe-west1.firebasedatabase.app/users";

export async function getAllUsers() {
  const url = BaseUrl + ".json";

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
    }

    const userObj = await res.json();
    return userObj;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}

export async function postUser(user) {
  const url = BaseUrl + ".json";

  const options = {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-type": "application/json",
    },
  };

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`Failed to post user: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error posting user:", error);
    return null;
  }
}

/** 
export async function deleteAllMessages(id){
    const url = BaseUrl + `/${id}.json`;
    const options = {
        method: 'DELETE'
    }
    
    const res = await fetch(url, options);
    const data = await res.json();
    console.log(data);
}
    **/

/** 
export async function patchBanned(id, banned){
    console.log(id, banned)

    const url = BaseUrl + `/${id}.json`;
    const options = {
        method: 'PATCH', 
        body: JSON.stringify( {banned} ),
        headers: {
            'Content-type': 'application/json'
        }
    }
}
    **/

/** 
export async function patchBanned(id, banned) {
    console.log("Patching user:", id, "Banned:", banned);

    const url = BaseUrl + `/${id}.json`;
    const options = {
        method: 'PATCH',
        body: JSON.stringify({ banned }), 
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await fetch(url, options);

        if (!res.ok) {
            throw new Error(`Failed to patch user: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Successfully updated banned status:", data);
        return data; 
    } catch (error) {
        console.error("Error patching banned status:", error);
        return null; 
    }
}
    **/

export async function patchBanned(userName, bannedStatus) {
  try {
    const users = await getAllUsers();

    const matchingUsers = Object.entries(users).filter(
      ([id, user]) => user.userName === userName
    );

    const updates = matchingUsers.map(([id]) => {
      return fetch(
        `https://gritsquare-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ banned: bannedStatus }),
        }
      );
    });

    await Promise.all(updates);
    console.log(`Banned all users with name: ${userName}`);
  } catch (error) {
    console.error("Error patching banned status:", error);
  }
}

/// Function to update like/dislike count in Firebase
/// Takes userId and type (like or dislike) as arguments
/// Returns the updated like and dislike counts
export async function updateLikeDislikeFirebase(userId, type) {
 
  const url = `${BaseUrl}/${userId}.json`;
    
  try {
   
    const res = await fetch(url);
    const data = await res.json();

    if (!data) {
      throw new Error("User not found");
    }

    
    let newLike = data.like || 0;
    let newDislike = data.dislike || 0;

    
    if (type === "like") {
      newLike++;
    } else if (type === "dislike") {
      newDislike++;
    }

   
    const patchRes = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ like: newLike, dislike: newDislike }),
    });

    if (!patchRes.ok) {
      throw new Error("Failed to update like/dislike");
    }

    return { like: newLike, dislike: newDislike };
  } catch (error) {
    console.error("Error updating like/dislike:", error);
    throw error;
  }
}
