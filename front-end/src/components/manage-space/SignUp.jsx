import React from "react";
import toast from "react-hot-toast";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Map from "./Map";
import Button from "../form/Button";
import fetchData from "../../util/fetchData";
import { GlobalContext } from "../../util/GlobalContextComponent";
import Images from "../admin/Images";

export default function SignUp() {
  const gc = useContext(GlobalContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formDetails, setFormDetails] = useState({});
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [disableSubmit, setDisableSubmit] = useState(false);

  const [edit, setEdit] = useState(false);

  let readOnly = false;
  if (searchParams.get("action") == "view") {
    readOnly = true;
  }

  useEffect(function () {
    if (searchParams.get("action") == "edit") {
      setEdit(true);
    }

    if (gc?.manageSpace) {
      setFormDetails(gc.manageSpace);

      // Pre-fill map coordinates from backend/provider doc
      if (gc.manageSpace?.latitude) setLatitude(Number(gc.manageSpace.latitude));
      if (gc.manageSpace?.longitude)
        setLongitude(Number(gc.manageSpace.longitude));
    }
    // eslint-disable-next-line
  }, []);

  function validatePersonalDetails() {
    const fullNameReg = /^[A-Za-z]+\s[A-Za-z]+$/;
    const phoneNoReg = /^[0-9]{10}$/;
    const emailReg = /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/;

    if (!formDetails.fullName) {
      toast.error("Please Enter Full Name");
      return false;
    }
    if (!fullNameReg.test(formDetails.fullName)) {
      toast.error("Please Enter a valid Full Name");
      return false;
    }
    if (!formDetails.phoneNo) {
      toast.error("Please Enter Phone Number");
      return false;
    }
    if (!phoneNoReg.test(formDetails.phoneNo)) {
      toast.error("Please Enter a valid Phone Number");
      return false;
    }
    if (!formDetails.email) {
      toast.error("Please Enter Email");
      return false;
    }
    if (!emailReg.test(formDetails.email)) {
      toast.error("Please Enter a valid Email Address");
      return false;
    }
    if (!formDetails.password) {
      toast.error("Please Enter Password");
      return false;
    }
    if (!formDetails.spaceName) {
      toast.error("Please Enter Space Name");
      return false;
    }
    return true;
  }

  function validateSpaceDetails() {
    if (!validatePersonalDetails()) return;

    if (!formDetails.from) {
      toast.error("Please Enter From time");
      return false;
    }
    if (!formDetails.to) {
      toast.error("Please Enter To time");
      return false;
    }
    if (formDetails.from === formDetails.to) {
      toast.error("From Time and To Time can not be same");
      return false;
    }
    if (!formDetails.maxSpace) {
      toast.error("Please Enter Max Space");
      return false;
    }
    if (!formDetails.ratePerHour) {
      toast.error("Please Enter Rate Per Hour");
      return false;
    }
    return true;
  }

  function validateLocation() {
    if (!validateSpaceDetails()) return;

    // use selected state values (backend expects Numbers)
    if (!latitude || !longitude) {
      toast.error("Please select location");
      return false;
    }
    return true;
  }

  function scrollTo(id) {
    let a = document.createElement("a");
    a.href = `#${id}`;

    if (id === "space-details" && !validatePersonalDetails()) return;
    if (id === "location" && !validateSpaceDetails()) return;
    if (id === "image" && !validateLocation()) return;

    a.click();
  }

  async function handlerSubmit(e) {
    e.preventDefault();
    setDisableSubmit(true);

    if (readOnly) {
      setDisableSubmit(false);
      navigate("/manage-space/dashboard");
      return;
    }

    if (!validateLocation()) {
      setDisableSubmit(false);
      return;
    }

    const providerId = gc?.manageSpace?.providerId || gc?.manageSpace?._id;

    let files = e.target[0].files;

    if (!files.length) {
      toast.error("Please select image file");
      setDisableSubmit(false);
      return;
    }

    // Sending Images
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    let response = fetch(`${process.env.REACT_APP_BASEURL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    toast.promise(response, {
      loading: "Sending data to backend",
      success: "Data sent to backend!",
      error: "Soming went wrong while sending data to backend",
    });

    response = await response;
    response = await response.json();

    if (!response?.isSuccess) {
      setDisableSubmit(false);
      return;
    }

    // Sending Form Details (backend expects providerId for edit delete+recreate)
    let res = fetchData("POST", "/api/manage-space/add-user", {
      ...formDetails,
      fileUrls: response.data.fileUrl, // backend expects array
      latitude: Number(latitude),
      longitude: Number(longitude),
      edit,
      providerId: edit ? providerId : undefined,
    });

    toast.promise(res, {
      loading: "Analysing data",
      success: "Data analysed",
      error: "Soming went wrong while analysing data",
    });

    res = await res;

    if (res?.isSuccess) {
      toast.success("Account created successfully");
      navigate("/manage-space/dashboard");
      gc?.setManageSpace({
        ...res.data,
        status: 0,
      });
    }

    if (!res?.isSuccess) {
      if (res.message === "duplicate_email") {
        toast.error(
          "Email already exists. Please try with another email address.",
          { duration: 15000 }
        );
        scrollTo("personal-details");
      }
    }

    setDisableSubmit(false);
  }

  // backend stores fileUrls as array; support old JSON string too
  let viewFileUrls = [];
  try {
    viewFileUrls = Array.isArray(gc?.manageSpace?.fileUrls)
      ? gc.manageSpace.fileUrls
      : JSON.parse(gc?.manageSpace?.fileUrls || "[]");
  } catch (e) {
    viewFileUrls = [];
  }

  return (
    <section className="h-[100vh] overflow-auto bg-fixed  bg-1 bg-c1 scroll-parent">
      {/* Personal Details */}
      <div
        className="flex items-center justify-center w-full h-full scroll-child"
        id="personal-details"
      >
        <div className="flex flex-col items-center justify-center gap-5 [&_input]:w-[350px] bg-white p-5 py-10 rounded-lg">
          <h1 className="text-xl font-bold">Your Personal details</h1>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <input
              type="text"
              placeholder="Full Name"
              className="max-w-xs min-w-full input input-bordered"
              value={formDetails.fullName}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  fullName: e.target.value,
                })
              }
              readOnly={readOnly}
            />

            <input
              type="number"
              placeholder="Phone No"
              className="max-w-xs min-w-full input input-bordered"
              value={formDetails.phoneNo}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  phoneNo: e.target.value,
                })
              }
              readOnly={readOnly}
            />

            <input
              type="text"
              placeholder="Email Address"
              className="max-w-xs min-w-full input input-bordered"
              value={formDetails.email}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  email: e.target.value,
                })
              }
              readOnly={readOnly}
            />

            <input
              type="password"
              placeholder="Password"
              className="max-w-xs min-w-full input input-bordered"
              value={formDetails.password}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  password: e.target.value,
                })
              }
              readOnly={readOnly}
            />

            <input
              type="text"
              placeholder="Space Name"
              className="min-w-full border md:col-span-2 input input-bordered"
              value={formDetails.spaceName}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  spaceName: e.target.value,
                })
              }
              readOnly={readOnly}
            />
          </div>

          <div onClick={() => scrollTo("space-details")} className="block w-full">
            <Button className="w-full py-[10px] text-white rounded-lg bg-c3 font-bold">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Space Details */}
      <div
        className="flex items-center justify-center w-full h-full scroll-child"
        id="space-details"
      >
        <div className="flex flex-col items-center justify-center gap-5 [&_input]:w-[320px] bg-white p-5 py-10 rounded-lg">
          <h1 className="text-xl font-bold">Space details</h1>

          <div className="grid grid-cols-1 gap-5 p-1 md:grid-cols-2">
            <label className="flex flex-col">
              <div className="mb-1 ml-1">From</div>
              <input
                type="time"
                className="input input-bordered"
                value={formDetails.from}
                onChange={(e) =>
                  setFormDetails({
                    ...formDetails,
                    from: e.target.value,
                  })
                }
                readOnly={readOnly}
              />
            </label>

            <label className="flex flex-col">
              <div className="mb-1 ml-1">To</div>
              <input
                type="time"
                className="w-full input input-bordered"
                value={formDetails.to}
                onChange={(e) =>
                  setFormDetails({
                    ...formDetails,
                    to: e.target.value,
                  })
                }
                readOnly={readOnly}
              />
            </label>

            <input
              type="number"
              placeholder="Max Space"
              className="w-full input input-bordered"
              value={formDetails.maxSpace}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  maxSpace: e.target.value,
                })
              }
              readOnly={readOnly}
            />

            <input
              type="number"
              placeholder="Rate Per Hour"
              className="w-full input input-bordered"
              value={formDetails.ratePerHour}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  ratePerHour: e.target.value,
                })
              }
              readOnly={readOnly}
            />
          </div>

          <div onClick={() => scrollTo("location")} className="block w-full">
            <Button className="w-full py-[10px] text-white rounded-lg bg-c3 font-bold">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div
        className="flex items-center justify-center w-full h-full scroll-child"
        id="location"
      >
        <Map
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          latitude={latitude}      // use chosen value
          longitude={longitude}    // use chosen value
          readOnly={readOnly}
          scrollTo={scrollTo}
        />
      </div>

      {/* Image */}
      <div
        className="flex items-center justify-center w-full h-full scroll-child"
        id="image"
      >
        <div className="flex flex-col items-center justify-center gap-5 p-5 py-10 bg-white rounded-lg ">
          <h1 className="text-xl font-bold">Parking Image</h1>

          <form onSubmit={handlerSubmit}>
            {!readOnly && (
              <div className="w-full">
                <input
                  type="file"
                  className="w-full p-2 border border-gray-300 rounded"
                  multiple
                  accept="image/*"
                  readOnly={readOnly}
                />
              </div>
            )}

            <div
              className={`mt-3 w-[70vw] h-[50vh] ${
                readOnly ? " block " : " hidden "
              } `}
            >
              <Images fileUrls={viewFileUrls} />
            </div>

            <Button
              className="w-full py-[10px] text-white rounded-lg bg-c3 font-bold mt-5"
              type="submit"
              disabled={disableSubmit}
            >
              Complete
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
