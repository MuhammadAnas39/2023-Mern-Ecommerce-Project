import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./updateOrder.css";
import {
  clearError,
  clearOrderDetailErros,
  clearUpdateOrderErrors,
  orderDetailFunc,
  updateOrder,
} from "../../redux/orderSlice";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";

const UpdateOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  console.log(status);

  const { order, error, loading } = useSelector((state) => state.orderDetail);
  const { isUpdated, error: updateError } = useSelector(
    (state) => state.updateOrder
  );

  const address = `${order?.shippingInfo?.address}, ${order?.shippingInfo?.city}, ${order?.shippingInfo?.state}, ${order?.shippingInfo?.pinCode}, ${order?.shippingInfo?.country}`;

  useEffect(() => {
    dispatch(orderDetailFunc(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError?.message);
    }
    if (isUpdated) {
      toast.success("Order Updated Successfully");
      navigate("/admin/orders");
      dispatch(clearUpdateOrderErrors());
    }
  }, [dispatch, id, updateError, isUpdated, navigate]);

  if (error) {
    toast.error(error.message);
    return null;
  }

  function updateOrderHandler() {
    const formData = new FormData();
    formData.append("status", status);
    dispatch(updateOrder({ id, formData }));
  }
  return (
    <div className="dashboard">
      <Sidebar />
      {loading ? (
        <Loader />
      ) : (
        <div className="updateOrder">
          <h2>Update Order</h2>
          <div
            className="updateOrderPage"
            style={{
              gridTemplateColumns:
                order?.orderStatus === "Delivered" ? "1fr" : "2fr 1fr",
            }}
          >
            <div className="box1">
              <div className="infoBox">
                <h4 className="updateOrderShipping">Shipping Info</h4>
                <div className="infoArea">
                  <div>
                    <p>Name:</p>
                    <span>{order?.user?.name}</span>
                  </div>
                  <div>
                    <p>Phone:</p>
                    <span>{order?.shippingInfo?.phoneNo}</span>
                  </div>
                  <div>
                    <p>Address:</p>
                    <span>{address}</span>
                  </div>
                </div>

                <div className="paymentDIV">
                  <h4>Payment</h4>
                  <div>
                    <p
                      style={{
                        color:
                          order?.paymentInfo?.status === "succeeded"
                            ? "green"
                            : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {order?.paymentInfo?.status === "succeeded"
                        ? "PAID"
                        : "NOT PAID"}
                    </p>

                    <div>
                      <p>Amount:</p>
                      <span>${order?.totalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="orderStatusDIV">
                  <h4>Order Status</h4>
                  <p
                    style={{
                      color:
                        order?.orderStatus === "Delivered" ? "green" : "red",
                    }}
                  >
                    {order?.orderStatus}
                  </p>
                </div>
              </div>

              <div className="cartItemsBox">
                <h4>Your Cart Items</h4>

                <div className="itemsBox">
                  {order?.orderItems?.map((item, index) => (
                    <div className="cartItemsContainer" key={item.product}>
                      <div className="itemsFirstPart">
                        <img src={item.image} alt={item.name} />
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </div>

                      <p>
                        {item.quantity} X ${item.price} ={" "}
                        <b>{item.quantity * item.price}</b>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {order?.orderStatus !== "Delivered" && (
              <div className="box2">
                <div>
                  <h4>Process Order</h4>
                  <select
                    onChange={(e) => setStatus(e.target.value)}
                    className="updateOrderSelectBox"
                  >
                    <option value="">Choose Order Status</option>

                    {order?.orderStatus === "Processing" && (
                      <option value="Shipped">Shipped</option>
                    )}

                    {order?.orderStatus === "Shipped" && (
                      <option value="Delivered">Delivered</option>
                    )}
                  </select>
                  <button
                    className="updateOrderBtn"
                    disabled={status ? false : true}
                    onClick={updateOrderHandler}
                  >
                    Update
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateOrder;
