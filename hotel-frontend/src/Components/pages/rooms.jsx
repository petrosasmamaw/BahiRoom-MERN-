export default function Rooms({ HotelStatus }) {
  return (
    <div className="container page">
      {HotelStatus === "closed" && (
        <>
          <h2>Your Rooms</h2>
          <p>The hotel is currently closed. Please open the hotel to manage rooms.</p>
        </>
      )}

      {HotelStatus === "open" && (
        <>
          <h2>Your Rooms</h2>
          <p>Here you will see the rooms you created.</p>
          <p>Later we will fetch them from the backend.</p>
        </>
      )}
    </div>
  );
}
