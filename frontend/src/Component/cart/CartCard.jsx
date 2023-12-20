import React from "react";
import { Link } from "react-router-dom";
import "./cartCard.css";
import { useDispatch } from "react-redux";
import { removeItem } from "../../redux/cartSlice";

const CartCard = ({ item }) => {
  const dispatch = useDispatch();

  function deleteItem(id) {
    dispatch(removeItem(id));
  }
  return (
    <div className="cartCard">
      <img src={item?.image} alt={item?.name} />
      <div className="cartCardContent">
        <Link to={`/product/${item.id}`}>{item?.name}</Link>
        <p>Price ${item?.price}</p>
        <p className="cartRemove" onClick={() => deleteItem(item?.product)}>
          Remove
        </p>
      </div>
    </div>
  );
};

export default CartCard;
