import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./newProduct.css";
import { MdOutlineSdStorage } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsBodyText } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { clearError, createAdminProduct } from "../../redux/productSlice";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (success) {
      toast.success("Product created successfully");
      navigate("/admin/dashboard");
      dispatch(clearError());
    }
  }, [error, dispatch, success, navigate]);

  const [productData, setProductData] = useState({
    name: "",
    price: 0,
    description: "",
    stock: 0,
    category: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  images.forEach((i) => console.log(i));

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      const selectedImages = Array.from(files);
      setImages(selectedImages);

      // Generate image previews
      const previews = [];
      for (let i = 0; i < selectedImages.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target.result);
          if (previews.length === selectedImages.length) {
            setImagePreviews([...previews]);
            setImages([...previews]);
          }
        };
        reader.readAsDataURL(selectedImages[i]);
      }
    } else {
      setProductData((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handlenewProduct = (e) => {
    e.preventDefault();
    e.preventDefault();

    const formData = new FormData();

    // Append text fields to the FormData
    formData.append("name", productData.name);
    formData.append("price", productData.price);
    formData.append("description", productData.description);
    formData.append("stock", productData.stock);
    formData.append("category", productData.category);

    // Append each image file to the FormData
    images.forEach((image, index) => {
      formData.append(`images`, image); // Corrected this line
    });

    dispatch(createAdminProduct(formData));
  };

  return (
    <div className="dashboard">
      <Sidebar />

      {loading ? (
        <Loader />
      ) : (
        <div className="newProductContainer">
          <h2>Create Product</h2>
          <form className="newProduct-form" onSubmit={handlenewProduct}>
            <div className="newProductInputBox">
              <IoMdCreate size={20} color="#757575" />
              <input
                type="text"
                placeholder="Name"
                value={productData.name}
                onChange={handleChange}
                name="name"
              />
            </div>
            <div className="newProductInputBox">
              <AiFillDollarCircle size={20} color="#757575" />
              <input
                type="number"
                placeholder="Price"
                value={productData.price}
                onChange={handleChange}
                name="price"
              />
            </div>
            <div className="newProductDescriptionBox">
              <BsBodyText size={20} color="#757575" />
              <textarea
                placeholder="Description"
                value={productData.description}
                column={4}
                rows={4}
                name="description"
                onChange={handleChange}
              />
            </div>
            <div className="newProductInputBox">
              <MdOutlineSdStorage size={20} color="#757575" />
              <input
                type="number"
                placeholder="Stock"
                value={productData.stock}
                name="stock"
                onChange={handleChange}
              />
            </div>
            <div className="newProductInputBox">
              <BiSolidCategoryAlt size={20} color="#757575" />
              <input
                type="text"
                placeholder="Category"
                value={productData.category}
                name="category"
                onChange={handleChange}
              />
            </div>
            <div className="newProductImagesBox">
              <label className="newProdcutChooseFile" htmlFor="file" id="file">
                Choose Images({images.length})
              </label>
              <input
                type="file"
                id="file"
                name="images"
                className="newProductHiddenFile"
                onChange={handleChange}
                multiple
              />
            </div>
            <div
              className="newProductPreviewBox"
              style={{
                borderBottom:
                  imagePreviews.length > 0 && "2px solid rgb(238, 238, 238)",
              }}
            >
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  className="fileImgPreview"
                  src={preview}
                  alt={`Preview ${index + 1}`}
                />
              ))}
            </div>
            <button className="newProductSubmit" type="submit">
              Create
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewProduct;
