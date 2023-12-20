import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./newProduct.css";
import { MdOutlineSdStorage } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsBodyText } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  fetchProductDetails,
  updateAdminProduct,
} from "../../redux/productSlice";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const { loading, error, isUpdated, product } = useSelector(
    (state) => state.products
  );

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [oldImage, setOldImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    // Update local state when product details change
    setName(product?.name);
    setPrice(product?.price);
    setDescription(product?.description);
    setStock(product?.stock);
    setCategory(product?.category);
    setOldImages(product?.images?.map((img) => img.url) || []);
    setImagePreviews(product?.images?.map((img) => img.url) || []);
  }, [product]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (isUpdated) {
      toast.success("Product updated successfully");
      navigate("/admin/dashboard");
    }
    dispatch(clearError());
  }, [error, dispatch, isUpdated, navigate]);

  const handleChange = (e) => {
    const { files } = e.target;

    const selectedImages = Array.from(files);

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
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("category", category);

    if (images?.length > 0) {
      images?.forEach((image) => {
        formData.append(`images`, image);
      });
    }
    // dispatch(updateAdminProduct({ id, updatedData: formData }));
    dispatch(updateAdminProduct({ id, formData }));
  };

  return (
    <div className="dashboard">
      <Sidebar />

      {loading ? (
        <Loader />
      ) : (
        <div className="newProductContainer">
          <h2>Update Product</h2>
          <form className="newProduct-form" onSubmit={handleUpdateProduct}>
            <div className="newProductInputBox">
              <IoMdCreate size={20} color="#757575" />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="newProductInputBox">
              <AiFillDollarCircle size={20} color="#757575" />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="newProductDescriptionBox">
              <BsBodyText size={20} color="#757575" />
              <textarea
                placeholder="Description"
                value={description}
                column={4}
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="newProductInputBox">
              <MdOutlineSdStorage size={20} color="#757575" />
              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div className="newProductInputBox">
              <BiSolidCategoryAlt size={20} color="#757575" />
              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="newProductImagesBox">
              <label className="newProdcutChooseFile" htmlFor="file" id="file">
                Choose Images(
                {images?.length ? images?.length : oldImage?.length})
              </label>
              <input
                type="file"
                id="file"
                className="newProductHiddenFile"
                onChange={handleChange}
                multiple
              />
            </div>
            <div
              className="newProductPreviewBox"
              style={{
                borderBottom:
                  imagePreviews?.length > 0 && "2px solid rgb(238, 238, 238)",
              }}
            >
              {imagePreviews?.map((preview, index) => (
                <img
                  key={index}
                  className="fileImgPreview"
                  src={preview}
                  alt={`Preview ${index + 1}`}
                />
              ))}
            </div>
            <button className="newProductSubmit" type="submit">
              Update
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateProduct;
