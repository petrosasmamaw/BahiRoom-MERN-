export default function CreateRoom({ HotelStatus }) {
  if (HotelStatus === null) {
    return (
      <div className="container page">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (HotelStatus === "closed") {
    return (
      <div className="container page">
        <h2>Create Room</h2>
        <p>The hotel is currently closed. Open your hotel first to add rooms.</p>
      </div>
    );
  }

  return (
    <div className="container page">
      <h2>Create Room</h2>
      <p>This page will contain the room creation form.</p>
      <p>Multiple image upload will be added later.</p>
    </div>
  );
}
