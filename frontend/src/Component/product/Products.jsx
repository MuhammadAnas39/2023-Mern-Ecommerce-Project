import React, { useEffect, useState } from "react";
import { fetchProducts } from "../../redux/productSlice";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../home/ProductCard";
import Loader from "../layout/Loader";
import { toast } from "react-toastify";
import "./product.css";
import { AiOutlineSearch } from "react-icons/ai";
import Pagination from "@mui/material/Pagination";
import Slider from "@mui/material/Slider";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";

const Products = () => {
  const serverURL = "https://2023-mern-ecommerce-backend.vercel.app";
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [rating, setRating] = useState();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const productsPerPage = 9;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  useEffect(() => {
    if (error) {
      return toast.error(error);
    }
    dispatch(fetchProducts({ priceRange, selectedCategory, rating }));
  }, [dispatch, error, priceRange, selectedCategory, rating]);

  useEffect(() => {
    async function getCategories() {
      const { data } = await axios.get(
        `${window.location.origin}/api/v1/categories`
      );
      setCategories(data.categories);
    }
    getCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKeyword(keyword);
    dispatch(fetchProducts({ keyword }));
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h3 className="prodHeading">Products</h3>
          <form className="searchForm" onSubmit={handleSearch}>
            <AiOutlineSearch
              size={30}
              color="#757575"
              style={{ marginLeft: "5px" }}
            />
            <input
              type="text"
              placeholder="Search..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          {searchKeyword.length > 0 && (
            <p className="searchKeyword">
              Search keyword <span>{searchKeyword}</span>
            </p>
          )}
          <div className="products">
            {currentProducts?.length > 0 ? (
              currentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p style={{ fontSize: "20px" }}>No Products Found</p>
            )}
          </div>

          <div className="filterBox">
            <h3>Filter</h3>
            <div>
              <p>Price</p>
              <Slider
                getAriaLabel={() => "Price range"}
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value}`}
                min={0}
                max={30000}
              />
              <p>Rating</p>
              <Slider
                getAriaLabel={() => "Rating"}
                value={rating}
                onChange={handleRatingChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}`}
                min={0}
                max={5} // Assuming rating is on a scale of 0 to 5, adjust as needed
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedCategory}
                  label="Category"
                  onChange={handleCategoryChange}
                >
                  {/* Map over categories and generate MenuItem components */}
                  {categories?.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {productsPerPage < products?.length && searchKeyword === "" && (
            <div className="pagination">
              <Pagination
                count={Math.ceil(products?.length / productsPerPage)}
                page={currentPage}
                color="primary"
                onChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Products;
