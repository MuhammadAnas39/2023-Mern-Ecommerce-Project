import "./home.css";
import { Link } from "react-router-dom";
import Rating from "react-rating-stars-component";

const Product = ({ product }) => {
  const options = {
    count: 5,
    value: product.totalRating,
    size: 24,
    activeColor: "#ff7f50",
    inactiveColor: "#d3d3d3",
    edit: false,
    isHalf: true,
  };

  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img className="img" src={product.images[0].url} alt={product.name} />
      <div className="prodDetail">
        <p>{product.name}</p>
        <div className="prodRating">
          <Rating {...options} />
          <span>{`(${product.numOfReviews} Reviews)`}</span>
        </div>
        <span className="price">{`$${product.price}`}</span>
        <h2>{product?.category}</h2>
      </div>
    </Link>
  );
};

export default Product;
