export default function Reservation({ HotelStatus }) {
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
        <h2>Reservations</h2>
        <p>Your hotel is currently closed. Open it to see and manage reservations.</p>
      </div>
    );
  }

  return (
    <div className="container page">
      <h2>Reservations</h2>
      <p>Here you will see incoming reservations.</p>
      <p>Later we will connect it to the backend.</p>
    </div>
  );
}
