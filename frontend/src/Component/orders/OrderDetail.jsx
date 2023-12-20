import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearOrderDetailErros, orderDetailFunc } from "../../redux/orderSlice";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import "./orderDetail.css";

const OrderDetail = () => {
  const { order, error, loading } = useSelector((state) => state.orderDetail);
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();
  const dispatch = useDispatch();

  const address = `${order?.shippingInfo?.address}, ${order?.shippingInfo?.city}, ${order?.shippingInfo?.state}, ${order?.shippingInfo?.pinCode}, ${order?.shippingInfo?.country}`;

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }

    dispatch(clearOrderDetailErros());
  }, [dispatch, id, error]);

  useEffect(() => {
    dispatch(orderDetailFunc(id));
  }, [dispatch, id]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="orderDetailPage">
          <div className="orderDetailFirstChild">
            <h3>Order ID: #{order?._id}</h3>
            <h6>{order?.createdAt}</h6>

            <div className="shippingDIV">
              <h4>Shipping Info</h4>
              <div>
                <div>
                  <p>Name:</p>
                  <span>{user?.name}</span>
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
                style={{ color: order?.orderStatus === "Delivered" && "green" }}
              >
                {order?.orderStatus}
              </p>
            </div>
          </div>

          <div className="orderDetailSecondChild">
            <h4>Order Items</h4>
            <div className="orderDetailItemsContainer">
              {order?.orderItems?.map((item) => (
                <div className="orderDetailItemsCard" key={item._id}>
                  <img src={item.image} alt={item.name} />
                  <Link to={`/product/${item.id}`}>{item.name}</Link>

                  <p>
                    {item.quantity} X ${item.price} ={" "}
                    <b>{item.quantity * item.price}</b>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetail;
