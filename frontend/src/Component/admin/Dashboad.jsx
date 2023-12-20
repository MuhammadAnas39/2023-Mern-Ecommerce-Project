import React, { useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import "./dashboard.css";
import { Link } from "react-router-dom";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { clearError, getAdminProducts } from "../../redux/productSlice.js";
import { toast } from "react-toastify";
import { getAllOrders } from "../../redux/orderSlice.js";
import { getAllUsers } from "../../redux/userSlice.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Title,
  Tooltip,
  ArcElement
);

const Dashboad = () => {
  const dispatch = useDispatch();
  const { products, error } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.adminUser);

  let totalAmount = 0;
  orders?.forEach((o) => {
    totalAmount += o.totalPrice;
  });

  useEffect(() => {
    // if (error) {
    //   toast.error(error);
    //   dispatch(clearError());
    // }
    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  const lineChartData = {
    labels: ["Initial Amount", "Total Amount"],
    datasets: [
      {
        label: "Total Amount",
        data: [0, totalAmount],
        // fill: true,
        // backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  //   Example data for bar chart (product stock)
  const doughnutChart = {
    labels: ["In Stock", "Out of Stock"],
    datasets: [
      {
        label: "Products",
        data: [
          products?.filter((product) => product.stock > 0).length,
          products?.filter((product) => product.stock === 0).length,
        ],

        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboardContainer">
        <h2>Dashboard</h2>
        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount
              <br />${totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="dashboardSummary2">
            <Link to="/admin/products">
              <p>Products</p>
              <p>{products?.length}</p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              <p>{orders?.length}</p>
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              <p>{users?.length}</p>
            </Link>
          </div>
        </div>

        <div className="chart">
          <div className="line-chart">
            <Line data={lineChartData} />
          </div>
          <div className="doughnut-chart">
            <Doughnut data={doughnutChart} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboad;
