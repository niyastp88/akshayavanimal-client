import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkIn, checkOut, getMyAttendance } from "../redux/slices/attendanceSlice";

const AttendanceButton = () => {
  const dispatch = useDispatch();
  const { today } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(getMyAttendance());
  }, [dispatch]);

  const handleCheckIn = () => {
    if (window.confirm("Check-in cheyyano?")) {
      dispatch(checkIn());
    }
  };

  const handleCheckOut = () => {
    if (window.confirm("Check-out cheyyano?")) {
      dispatch(checkOut());
    }
  };

  // 🔥 UI LOGIC
  if (!today) {
    return (
      <button
        onClick={handleCheckIn}
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow"
      >
        Check In
      </button>
    );
  }

  if (today && !today.checkOut) {
    return (
      <button
        onClick={handleCheckOut}
        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow"
      >
        Check Out
      </button>
    );
  }

  return null; // 🔥 hide after checkout
};

export default AttendanceButton;