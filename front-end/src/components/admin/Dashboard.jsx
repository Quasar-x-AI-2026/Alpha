import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import fetchData from "../../util/fetchData";
import { GlobalContext } from "../../util/GlobalContextComponent";

import { RxCross1 } from "react-icons/rx";
import { IoCheckmarkOutline } from "react-icons/io5";

import Map from "./Map";
import Images from "./Images";

export default function Dashboard() {
  const gc = useContext(GlobalContext);
  const navigate = useNavigate();

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [fileUrls, setFileUrls] = useState([]);

  /* =======================
     AUTH GUARD
  ======================== */
  useEffect(() => {
    if (!gc?.adminLoggedIn) {
      navigate("/admin");
    }
  }, [gc?.adminLoggedIn, navigate]);

  /* =======================
     CHANGE PROVIDER STATUS
  ======================== */
  async function handlerChangeStatus(id, status) {
    try {
      const res = await fetchData("POST", "/api/admin/change-status", {
        id,
        status,
      });

      if (res?.isSuccess) {
        if (status === 1) toast.success("Account verified");
        if (status === -1) toast.success("Account rejected");

        // Remove updated provider from pending list
        gc.setManageSpacePending((old = []) =>
          old.filter((p) => (p._id || p.providerId) !== id)
        );
      } else {
        toast.error(res?.message || "Failed to change status");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  }

  /* =======================
     MODALS
  ======================== */
  function showMapModal(lat, lng) {
    setLatitude(lat);
    setLongitude(lng);
    document.getElementById("map_modal")?.showModal();
  }

  function showImageModal(urls) {
    let parsed = [];
    try {
      parsed = Array.isArray(urls) ? urls : JSON.parse(urls || "[]");
    } catch (e) {
      parsed = [];
    }
    setFileUrls(parsed);
    document.getElementById("image_modal")?.showModal();
  }

  /* =======================
     UI
  ======================== */
  return (
    <section className="mt-[80px]">
      <div className="m-5 border rounded">
        <div className="overflow-x-auto">
          <table className="table [&_*]:whitespace-nowrap">
            <thead>
              <tr className="bg-base-200">
                <th>#</th>
                <th>User Name</th>
                <th>Space Name</th>
                <th>Email</th>
                <th>Phone No</th>
                <th>Timing</th>
                <th>Max Space</th>
                <th>Rate / Hr</th>
                <th>Location</th>
                <th>Images</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {(gc?.manageSpacePending || []).map((e, i) => {
                const providerId = e._id || e.providerId;

                return (
                  <tr key={providerId || i}>
                    <th>{i + 1}</th>
                    <td>{e.fullName}</td>
                    <td>{e.spaceName}</td>
                    <td>{e.email}</td>
                    <td>{e.phoneNo}</td>
                    <td>
                      {e.from} - {e.to}
                    </td>
                    <td>{e.maxSpace}</td>
                    <td>{e.ratePerHour}</td>

                    <td
                      className="cursor-pointer text-blue-600 hover:underline"
                      onClick={() =>
                        showMapModal(e.latitude, e.longitude)
                      }
                    >
                      Show
                    </td>

                    <td
                      className="cursor-pointer text-blue-600 hover:underline"
                      onClick={() => showImageModal(e.fileUrls)}
                    >
                      Show
                    </td>

                    <td>
                      <div className="flex gap-3">
                        <button
                          className="p-1 text-white bg-green-500 rounded active:bg-green-600"
                          onClick={() =>
                            handlerChangeStatus(providerId, 1)
                          }
                        >
                          <IoCheckmarkOutline />
                        </button>

                        <button
                          className="p-1 text-white bg-red-500 rounded active:bg-red-600"
                          onClick={() =>
                            handlerChangeStatus(providerId, -1)
                          }
                        >
                          <RxCross1 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {(!gc?.manageSpacePending ||
                gc.manageSpacePending.length === 0) && (
                <tr>
                  <td colSpan={11} className="py-6 text-center">
                    No pending space providers
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MAP MODAL */}
      <dialog id="map_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl h-[70vh]">
          <Map latitude={latitude} longitude={longitude} />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* IMAGE MODAL */}
      <dialog id="image_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl h-[70vh] overflow-hidden">
          <Images fileUrls={fileUrls} />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </section>
  );
}
