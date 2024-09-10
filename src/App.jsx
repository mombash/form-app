import { useState } from "react";
import { useForm } from "react-hook-form";
import React from "react";
// import "./App.css";
import { collection, addDoc } from "firebase/firestore"; // Import necessary functions
import { db } from "./Firebase"; // Import db from Firebase

function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [page, setPage] = useState(1); // State to track the current page
  const selectedSkinHealthIssues = watch("skinHealthIssues", []);

  const handleNext = (data) => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    setPage((prevPage) => prevPage - 1);
  };
  const onSubmit = async (data) => {
    if (page < 3) {
      setPage((prevPage) => prevPage + 1);
    } else {
      console.log("Form Data: ", data);

      // Create FormData to handle image file uploads
      const formData = new FormData();
      formData.append("age", data.age);
      formData.append("gender", data.gender);
      formData.append("dailySunExposure", data.dailySunExposure);
      formData.append("skinType", data.skinType);
      const selectedIssues = Object.keys(data.skinHealthIssues).filter(
        (issue) => data.skinHealthIssues[issue]
      );
      formData.append("skinHealthIssues", selectedIssues.join(", "));
      const selectedUnderEyeIssues = Object.keys(data.underEyeIssues).filter(
        (issue) => data.underEyeIssues[issue]
      );
      formData.append("underEyeIssues", selectedUnderEyeIssues.join(", "));
      // formData.append("image", data.image[0]); // Handling the file input
      // Append details for each selected skin health issue
      ["acne", "redness", "pigmentation", "dryness", "oiliness"].forEach(
        (issue) => {
          if (data[`${issue}Details`]) {
            formData.append(
              `${issue}Details`,
              JSON.stringify(data[`${issue}Details`])
            );
          }
        }
      );
/*       // Append details for each selected under eye issue
      ["wrinkles", "milia", "dryness", "darkCircles", "puffiness"].forEach(
        (issue) => {
          if (data[`${issue}Details`]) {
            formData.append(
              `${issue}Details`,
              JSON.stringify(data[`${issue}Details`])
            );
          }
        }
      ); */
      // You can now send this formData to your backend using Axios or fetch
      // console.log("FormData with file: ", formData.get("image"));

      const dataObject = {
        age : data.age,
        gender : data.gender,
        dailySunExposure : data.dailySunExposure,
        skinType : data.skinType,
        skinHealthIssues : selectedIssues,
        underEyeIssues : selectedUnderEyeIssues,
        // image : data.image[0],
        // wrinkleDetails : data.wrinkleDetails,
        // miliaDetails : data.miliaDetails,
        // drynessDetails : data.drynessDetails,
        // darkCirclesDetails : data.darkCirclesDetails,
        // puffinessDetails : data.puffinessDetails,
        ...(data.acneDetails !== undefined && data.acneDetails !== null ? { acneDetails: data.acneDetails } : {}),
        ...(data.rednessDetails !== undefined && data.rednessDetails !== null ? { rednessDetails: data.rednessDetails } : {}),
        ...(data.pigmentationDetails !== undefined && data.pigmentationDetails !== null ? { pigmentationDetails: data.pigmentationDetails } : {}),
        ...(data.drynessDetails !== undefined && data.drynessDetails !== null ? { drynessDetails: data.drynessDetails } : {}),
        ...(data.oilinessDetails !== undefined && data.oilinessDetails !== null ? { oilinessDetails: data.oilinessDetails } : {}),
      };

      try {
        const docRef = await addDoc(collection(db, "objects"), {
          dataObject,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }      
    }
  };

  return (
    <div className="App">
      <h2>Submit Your Details</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {page === 1 && (
          <div>
            <h2>Page 1</h2>
            {/* Age Field */}
            <div>
              <label>Age:</label>
              <input
                {...register("age", { required: true })}
                placeholder="Age"
              />
              {errors.age && <span>This field is required</span>}
            </div>

            {/* Drop-Down Menu Question */}
            <div>
              <label>Gender:</label>
              <select
                {...register("gender", { required: true })}
                value={watch("gender") || ""}
              >
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <span>This field is required</span>}
            </div>
            <div>
              <img src="./src/assets/skin-type.png" alt="Skin Type" />
            </div>
            {/* Drop-Down Menu Question */}
            <div>
              <label>Skin Type:</label>
              <select {...register("skinType", { required: true })}>
                <option value="">Select...</option>
                <option value="Combination Skin">Combination Skin</option>
                <option value="Dry Skin">Dry Skin</option>
                <option value="Oily Skin">Oily Skin</option>
                <option value="Normal Skin">Normal Skin</option>
              </select>
              {errors.skinType && <span>This field is required</span>}
            </div>

            {/* Drop-Down Menu Question */}
            <div>
              <label>Daily Sun Exposure:</label>
              <select {...register("dailySunExposure", { required: true })}>
                <option value="">Select...</option>
                <option value="none">None</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
              {errors.skinType && <span>This field is required</span>}
            </div>

            {/* Multiple Choice Question */}
            <div>
              <label>Skin Health Issues:</label>
              <div>
                <input
                  type="checkbox"
                  {...register("skinHealthIssues", { required: true })}
                  value="acne"
                />
                <label>acne</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  {...register("skinHealthIssues", { required: true })}
                  value="redness"
                />
                <label>redness</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  {...register("skinHealthIssues", { required: true })}
                  value="pigmentation"
                />
                <label>pigmentation</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  {...register("skinHealthIssues", { required: true })}
                  value="dryness"
                />
                <label>dryness</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  {...register("skinHealthIssues", { required: true })}
                  value="oiliness"
                />
                <label>oiliness</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  {...register("skinHealthIssues", { required: true })}
                  value="none"
                />
                <label>none</label>
              </div>
              {errors.skinHealthIssues && <span>This field is required</span>}
            </div>

            {/* Multiple Choice Question for Under Eye Issues */}
            <div>
              <label>Under Eye Issues:</label>
              <div>
                <input
                  type="checkbox"
                  {...register("underEyeIssues", { required: true })}
                  value="wrinkles"
                />
                <label>wrinkles</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  {...register("underEyeIssues", { required: true })}
                  value="milia"
                />
                <label>milia</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  {...register("underEyeIssues", { required: true })}
                  value="dryness"
                />
                <label>dryness</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  {...register("underEyeIssues", { required: true })}
                  value="darkCircles"
                />
                <label>dark circles</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  {...register("underEyeIssues", { required: true })}
                  value="puffiness"
                />
                <label>puffiness</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  {...register("underEyeIssues", { required: true })}
                  value="none"
                />
                <label>none</label>
              </div>
              {errors.underEyeIssues && <span>This field is required</span>}
            </div>

            <button type="submit">Next</button>
          </div>
        )}

        {page === 2 && (
          <div>
            <h2>Page 2</h2>
            {/* Conditionally render additional questions for each skin health issue */}
            {selectedSkinHealthIssues.includes("acne") && (
              <div>
                <h3>Describe your acne issues:</h3>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>None</th>
                      <th>Mild</th>
                      <th>Moderate</th>
                      <th>Severe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Forehead", "Chin", "Cheeks", "Jaw", "Nose"].map(
                      (area) => (
                        <tr key={area}>
                          <td>{area}</td>
                          {["None", "Mild", "Moderate", "Severe"].map(
                            (severity) => (
                              <td key={severity}>
                                <input
                                  type="radio"
                                  {...register(
                                    `acneDetails.${area.toLowerCase()}`,
                                    { required: true }
                                  )}
                                  value={severity}
                                />
                              </td>
                            )
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                {errors.acneDetails && (
                  <span>Please select a severity for each area</span>
                )}
              </div>
            )}

            {selectedSkinHealthIssues.includes("redness") && (
              <div>
                <h3>Describe your redness issues</h3>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>None</th>
                      <th>Mild</th>
                      <th>Moderate</th>
                      <th>Severe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Forehead", "Chin", "Cheeks", "Jaw", "Nose"].map(
                      (area) => (
                        <tr key={area}>
                          <td>{area}</td>
                          {["None", "Mild", "Moderate", "Severe"].map(
                            (severity) => (
                              <td key={severity}>
                                <input
                                  type="radio"
                                  {...register(
                                    `rednessDetails.${area.toLowerCase()}`,
                                    { required: true }
                                  )}
                                  value={severity}
                                />
                              </td>
                            )
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {selectedSkinHealthIssues.includes("pigmentation") && (
              <div>
                <h3>Describe your pigmentation issues</h3>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>None</th>
                      <th>Mild</th>
                      <th>Moderate</th>
                      <th>Severe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Forehead", "Chin", "Cheeks", "Jaw", "Nose"].map(
                      (area) => (
                        <tr key={area}>
                          <td>{area}</td>
                          {["None", "Mild", "Moderate", "Severe"].map(
                            (severity) => (
                              <td key={severity}>
                                <input
                                  type="radio"
                                  {...register(
                                    `pigmentationDetails.${area.toLowerCase()}`,
                                    { required: true }
                                  )}
                                  value={severity}
                                />
                              </td>
                            )
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {selectedSkinHealthIssues.includes("dryness") && (
              <div>
                <h3>Describe your dryness issues:</h3>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>None</th>
                      <th>Mild</th>
                      <th>Moderate</th>
                      <th>Severe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Forehead", "Chin", "Cheeks", "Jaw", "Nose"].map(
                      (area) => (
                        <tr key={area}>
                          <td>{area}</td>
                          {["None", "Mild", "Moderate", "Severe"].map(
                            (severity) => (
                              <td key={severity}>
                                <input
                                  type="radio"
                                  {...register(
                                    `drynessDetails.${area.toLowerCase()}`,
                                    { required: true }
                                  )}
                                  value={severity}
                                />
                              </td>
                            )
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {selectedSkinHealthIssues.includes("oiliness") && (
              <div>
                <h3>Describe your oiliness issues:</h3>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>None</th>
                      <th>Mild</th>
                      <th>Moderate</th>
                      <th>Severe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Forehead", "Chin", "Cheeks", "Jaw", "Nose"].map(
                      (area) => (
                        <tr key={area}>
                          <td>{area}</td>
                          {["None", "Mild", "Moderate", "Severe"].map(
                            (severity) => (
                              <td key={severity}>
                                <input
                                  type="radio"
                                  {...register(
                                    `oilinessDetails.${area.toLowerCase()}`,
                                    { required: true }
                                  )}
                                  value={severity}
                                />
                              </td>
                            )
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit">Next</button>
            <button type="button" onClick={handlePrevious}>
              Previous
            </button>
          </div>
        )}
        {page === 3 && (
          <div>
            <h2>Page 3</h2>

{/*             <div>
              <label>Full face close up selfie:</label>
              <input type="file" {...register("image", { required: true })} />
              {errors.image && <span>This field is required</span>}
            </div>

            <p>Upload high quality close-ups from different segments</p>
            <div>
              <label>Forehead:</label>
              <input type="file" {...register("image", { required: true })} />
              {errors.image && <span>This field is required</span>}
            </div>

            <div>
              <label>Chin:</label>
              <input type="file" {...register("image", { required: true })} />
              {errors.image && <span>This field is required</span>}
            </div>

            <div>
              <label>Left Cheeks:</label>
              <input type="file" {...register("image", { required: true })} />
              {errors.image && <span>This field is required</span>}
            </div>

            <div>
              <label>Right Cheeks:</label>
              <input type="file" {...register("image", { required: true })} />
              {errors.image && <span>This field is required</span>}
            </div>
             */}
            <button type="button" onClick={handlePrevious}>
              Previous
            </button>
            <button type="submit">Submit</button>
          </div>
        )}
      </form>
    </div>
  );
}

export default App;
