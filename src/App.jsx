import { useState } from "react";
import { useForm } from "react-hook-form";
import React from "react";
// import "./App.css";

function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [page, setPage] = useState(1); // State to track the current page
  const selectedSkinHealthIssues = watch("skinHealthIssues", []);

  const onSubmit = (data) => {
    console.log("Form Data: ", data);

    // Create FormData to handle image file uploads
    const formData = new FormData();
    formData.append("age", data.age);
    formData.append("gender", data.gender);
    formData.append("skinType", data.skinType);
    const selectedIssues = Object.keys(data.skinHealthIssues).filter(
      (issue) => data.skinHealthIssues[issue]
    );
    formData.append("skinHealthIssues", selectedIssues.join(", "));
    formData.append("image", data.image[0]); // Handling the file input
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
    // You can now send this formData to your backend using Axios or fetch
    console.log("FormData with file: ", formData.get("image"));
  };

  return (
    <div className="App">
      <h2>Submit Your Details</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {page === 1 && (
          <div>
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

            {/* Drop-Down Menu Question */}
            <div>
              <label>Skin Type:</label>س
              <select {...register("skinType", { required: true })}>
                <option value="">Select...</option>
                <option value="Combination Skin">Combination Skin</option>
                <option value="Dry Skin">Dry Skin</option>
                <option value="Oily Skin">Oily Skin</option>
                <option value="Normal Skin">Normal Skin</option>
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
              {errors.skinHealthIssues && <span>This field is required</span>}
            </div>
            <button type="button" onClick={() => setPage(2)}>
              Next
            </button>
          </div>
        )}

        {page === 1 && (
          <div>
            {/* Image Upload */}
            <div>
              <label>Upload Image:</label>
              <input type="file" {...register("image", { required: true })} />
              {errors.image && <span>This field is required</span>}
            </div>

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
                <label>Describe your redness issues:</label>
                <textarea
                  {...register("rednessDetails", { required: true })}
                ></textarea>
                {errors.rednessDetails && <span>This field is required</span>}
              </div>
            )}

            {selectedSkinHealthIssues.includes("pigmentation") && (
              <div>
                <label>Describe your pigmentation issues:</label>
                <textarea
                  {...register("pigmentationDetails", { required: true })}
                ></textarea>
                {errors.pigmentationDetails && (
                  <span>This field is required</span>
                )}
              </div>
            )}

            {selectedSkinHealthIssues.includes("dryness") && (
              <div>
                <label>Describe your dryness issues:</label>
                <textarea
                  {...register("drynessDetails", { required: true })}
                ></textarea>
                {errors.drynessDetails && <span>This field is required</span>}
              </div>
            )}

            {selectedSkinHealthIssues.includes("oiliness") && (
              <div>
                <label>Describe your oiliness issues:</label>
                <textarea
                  {...register("oilinessDetails", { required: true })}
                ></textarea>
                {errors.oilinessDetails && <span>This field is required</span>}
              </div>
            )}

            {/* Submit Button */}
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setPage(1)}>
              Previous
            </button>
            <button type="button" onClick={() => setPage(3)}>
              Next
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default App;
