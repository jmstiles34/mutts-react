export default async function getBreeds() {
  try {
    const response = await fetch("/api/dogs/breeds", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching breeds data:", error);
  }
}
