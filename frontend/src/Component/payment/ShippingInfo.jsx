import React, { useState } from "react";
import { Country, State } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import OrderSlider from "./OrderSlider";
import "./shippingInfo.css";
import { FaHome, FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot, FaLocationPin } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { setShippingInfo } from "../../redux/cartSlice";
import { toast } from "react-toastify";

const ShippingInfo = () => {
  const { shippingInfo } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [address, setAddress] = useState(shippingInfo.address);
  const [phone, setPhone] = useState(shippingInfo.phone);
  const [country, setCountry] = useState(shippingInfo.country);
  const [state, setState] = useState(shippingInfo.state);
  const [city, setCity] = useState(shippingInfo.city);
  const [pin, setPin] = useState(shippingInfo.pin);

  const shippingHandler = (e) => {
    e.preventDefault();
    if (phone.length === 11) {
      dispatch(
        setShippingInfo({
          address,
          phoneNo: phone,
          country,
          state,
          city,
          pinCode: pin,
        })
      );
      navigate("/confirmorder");
    } else {
      return toast.error("Please enter a correct number");
    }
  };

  return (
    <>
      <OrderSlider stage={0} />

      <form className="shippingContainer" onSubmit={shippingHandler}>
        <h3>Shipping Info</h3>

        <div className="shippingInputBox">
          <FaHome size={20} color="#757575" />
          <input
            required
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="shippingInputBox">
          <FaPhoneAlt size={20} color="#757575" />
          <input
            required
            type="number"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="shippingSelectBox">
          <select
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Select a country</option>
            {Country.getAllCountries().map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>

          {country && (
            <select
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Select a state</option>
              {State.getStatesOfCountry(country).map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="shippingInputBox">
          <FaLocationDot size={20} color="#757575" />
          <input
            required
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="shippingInputBox">
          <FaLocationPin size={20} color="#757575" />
          <input
            required
            type="text"
            placeholder="Pin Code"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default ShippingInfo;
