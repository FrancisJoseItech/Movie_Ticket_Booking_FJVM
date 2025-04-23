// 📦 API instance
import {axiosInstance} from "../axios/axiosInstance";

// 🎭 Get theaters owned by the logged-in theater_owner
export const getMyTheaters = async () => {
  const res = await axiosInstance.get("/theaters/my-theaters");
  console.log("🎭 Fetched my theaters:", res.data); // 🧪 Debug
  return res.data;
};

