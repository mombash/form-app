import { useState } from "react";
import { useForm } from "react-hook-form";
import React from "react";
// import "./App.css";
import { collection, addDoc } from "firebase/firestore"; // Import necessary functions
import { db } from "./Firebase"; // Import db from Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./Firebase";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      age: "",
      gender: "",
      skinType: "",
      skinHealthIssues: [],
    },
  });
  const [page, setPage] = useState(1); // State to track the current page
  const selectedSkinHealthIssues = watch("skinHealthIssues", []);

  const handleNext = (data) => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const onSubmit = async (data) => {
    if (page < 3) {
      setPage((prevPage) => prevPage + 1);
    } else {
      console.log("Form Data: ", data);

      // const imageFiles = Array.from(data.images);
      // const imageUrls = await Promise.all(
      //   imageFiles.map(async (image) => await uploadImage(image))
      // );

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
        age: data.age,
        gender: data.gender,
        dailySunExposure: data.dailySunExposure,
        skinType: data.skinType,
        skinHealthIssues: selectedIssues,
        underEyeIssues: selectedUnderEyeIssues,
        // images: imageUrls, // Include the image URLs here
        // wrinkleDetails : data.wrinkleDetails,
        // miliaDetails : data.miliaDetails,
        // drynessDetails : data.drynessDetails,
        // darkCirclesDetails : data.darkCirclesDetails,
        // puffinessDetails : data.puffinessDetails,
        ...(data.acneDetails !== undefined && data.acneDetails !== null
          ? { acneDetails: data.acneDetails }
          : {}),
        ...(data.rednessDetails !== undefined && data.rednessDetails !== null
          ? { rednessDetails: data.rednessDetails }
          : {}),
        ...(data.pigmentationDetails !== undefined &&
        data.pigmentationDetails !== null
          ? { pigmentationDetails: data.pigmentationDetails }
          : {}),
        ...(data.drynessDetails !== undefined && data.drynessDetails !== null
          ? { drynessDetails: data.drynessDetails }
          : {}),
        ...(data.oilinessDetails !== undefined && data.oilinessDetails !== null
          ? { oilinessDetails: data.oilinessDetails }
          : {}),
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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      minWidth="99vw"
      bgcolor="#f5f5f5"
    >
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          {page === 1 && (
            <Container>
              <Typography variant="h4" component="h1" gutterBottom>
                Multi-Step Form
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                Page 1
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Age"
                    {...register("age", {
                      required: true,
                      pattern: /^[0-9]+$/,
                      validate: (value) => parseInt(value) > 0,
                    })}
                    error={!!errors.age}
                    helperText={
                      errors.age
                        ? "Please enter a valid age (whole number)"
                        : ""
                    }
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    error={!!errors.gender}
                  >
                    <InputLabel>Gender:</InputLabel>
                    <Select
                      {...register("gender", { required: true })}
                      value={watch("gender") || ""}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                    {errors.gender && <span>This field is required</span>}
                  </FormControl>
                  <Grid>
                    <img src="/assets/skin-type.png" alt="Skin Type" />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.skinType}
                      >
                        <InputLabel>Skin Type</InputLabel>
                        <Select
                          {...register("skinType", { required: true })}
                          value={watch("skinType") || ""}
                        >
                          <MenuItem value="">Select...</MenuItem>
                          <MenuItem value="Combination Skin">
                            Combination Skin
                          </MenuItem>
                          <MenuItem value="Dry Skin">Dry Skin</MenuItem>
                          <MenuItem value="Oily Skin">Oily Skin</MenuItem>
                          <MenuItem value="Normal Skin">Normal Skin</MenuItem>
                        </Select>
                        {errors.skinType && <span>This field is required</span>}
                      </FormControl>
                    </Grid>
                    <Grid>
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.dailySunExposure}
                      >
                        <InputLabel>Daily Sun Exposure</InputLabel>
                        <Select
                          {...register("dailySunExposure", { required: true })}
                          value={watch("dailySunExposure") || ""}
                        >
                          <MenuItem value="">Select...</MenuItem>
                          <MenuItem value="none">None</MenuItem>
                          <MenuItem value="mild">Mild</MenuItem>
                          <MenuItem value="moderate">Moderate</MenuItem>
                          <MenuItem value="severe">Severe</MenuItem>
                        </Select>
                        {errors.dailySunExposure && (
                          <span>This field is required</span>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl
                        component="fieldset"
                        margin="normal"
                        error={!!errors.skinHealthIssues}
                      >
                        <FormLabel component="legend">
                          Skin Health Issues
                        </FormLabel>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...register("skinHealthIssues")}
                                value="acne"
                                checked={
                                  Array.isArray(watch("skinHealthIssues")) &&
                                  watch("skinHealthIssues").includes("acne")
                                }
                              />
                            }
                            label="Acne"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...register("skinHealthIssues")}
                                value="redness"
                                checked={
                                  Array.isArray(watch("skinHealthIssues")) &&
                                  watch("skinHealthIssues").includes("redness")
                                }
                              />
                            }
                            label="Redness"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...register("skinHealthIssues")}
                                value="wrinkles"
                                checked={
                                  Array.isArray(watch("skinHealthIssues")) &&
                                  watch("skinHealthIssues").includes("wrinkles")
                                }
                              />
                            }
                            label="Wrinkles"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...register("skinHealthIssues")}
                                value="pigmentation"
                                checked={
                                  Array.isArray(watch("skinHealthIssues")) &&
                                  watch("skinHealthIssues").includes(
                                    "pigmentation"
                                  )
                                }
                              />
                            }
                            label="Pigmentation"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...register("skinHealthIssues")}
                                value="dryness"
                                checked={
                                  Array.isArray(watch("skinHealthIssues")) &&
                                  watch("skinHealthIssues").includes("dryness")
                                }
                              />
                            }
                            label="Dryness"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...register("skinHealthIssues")}
                                value="oiliness"
                                checked={
                                  Array.isArray(watch("skinHealthIssues")) &&
                                  watch("skinHealthIssues").includes("oiliness")
                                }
                              />
                            }
                            label="Oiliness"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...register("skinHealthIssues", {
                                  required: true,
                                })}
                                value="none"
                                checked={
                                  Array.isArray(watch("skinHealthIssues")) &&
                                  watch("skinHealthIssues").includes("none")
                                }
                              />
                            }
                            label="None"
                          />
                        </FormGroup>
                        {errors.skinHealthIssues && (
                          <span>This field is required</span>
                        )}
                      </FormControl>
                    </Grid>
                    <FormControl
                      component="fieldset"
                      margin="normal"
                      error={!!errors.underEyeIssues}
                    >
                      <FormLabel component="legend">Under Eye Issues</FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...register("underEyeIssues", {
                                required: true,
                              })}
                              value="wrinkles"
                              checked={
                                Array.isArray(watch("underEyeIssues")) &&
                                watch("underEyeIssues").includes("wrinkles")
                              }
                            />
                          }
                          label="Wrinkles"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...register("underEyeIssues", {
                                required: true,
                              })}
                              value="milia"
                              checked={
                                Array.isArray(watch("underEyeIssues")) &&
                                watch("underEyeIssues").includes("milia")
                              }
                            />
                          }
                          label="Milia"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...register("underEyeIssues", {
                                required: true,
                              })}
                              value="dryness"
                              checked={
                                Array.isArray(watch("underEyeIssues")) &&
                                watch("underEyeIssues").includes("dryness")
                              }
                            />
                          }
                          label="Dryness"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...register("underEyeIssues", {
                                required: true,
                              })}
                              value="none"
                              checked={
                                Array.isArray(watch("underEyeIssues")) &&
                                watch("underEyeIssues").includes("none")
                              }
                            />
                          }
                          label="None"
                        />
                      </FormGroup>
                      {errors.underEyeIssues && (
                        <span>This field is required</span>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between">
                      <Button variant="contained" color="primary" type="submit">
                        {page < 3 ? "Next" : "Submit"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          )}

          {page === 2 && (
            <div>
              <h2>Page 2</h2>
              {/* Conditionally render additional questions for each skin health issue */}
              {selectedSkinHealthIssues.includes("acne") && (
                <div>
                  <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">
                      Describe your acne issues:
                    </FormLabel>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell>None</TableCell>
                            <TableCell>Mild</TableCell>
                            <TableCell>Moderate</TableCell>
                            <TableCell>Severe</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {["Forehead", "Chin", "Cheeks", "Jaw", "Nose"].map(
                            (area) => (
                              <TableRow key={area}>
                                <TableCell>{area}</TableCell>
                                {["None", "Mild", "Moderate", "Severe"].map(
                                  (severity) => (
                                    <TableCell key={severity}>
                                      <Radio
                                        {...register(
                                          `acneDetails.${area.toLowerCase()}`,
                                          { required: true }
                                        )}
                                        value={severity}
                                        name={`acneDetails.${area.toLowerCase()}`}
                                        checked={
                                          watch(
                                            `acneDetails.${area.toLowerCase()}`
                                          ) === severity
                                        }
                                      />
                                    </TableCell>
                                  )
                                )}
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {errors.acneDetails && (
                      <span>Please select a severity for each area</span>
                    )}
                  </FormControl>
                </div>
              )}

              {selectedSkinHealthIssues.includes("redness") && (
                <div>
                  <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">
                      Describe your redness issues:
                    </FormLabel>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell>None</TableCell>
                            <TableCell>Mild</TableCell>
                            <TableCell>Moderate</TableCell>
                            <TableCell>Severe</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {["Forehead", "Chin", "Cheeks", "Jaw", "Nose"].map(
                            (area) => (
                              <TableRow key={area}>
                                <TableCell>{area}</TableCell>
                                {["None", "Mild", "Moderate", "Severe"].map(
                                  (severity) => (
                                    <TableCell key={severity}>
                                      <Radio
                                        {...register(
                                          `rednessDetails.${area.toLowerCase()}`,
                                          { required: true }
                                        )}
                                        value={severity}
                                      />
                                    </TableCell>
                                  )
                                )}
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </FormControl>
                </div>
              )}

              {selectedSkinHealthIssues.includes("pigmentation") && (
                <div>
                  <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">
                      Describe your pigmentation issues:
                    </FormLabel>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell>None</TableCell>
                            <TableCell>Mild</TableCell>
                            <TableCell>Moderate</TableCell>
                            <TableCell>Severe</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {["Forehead", "Chin", "Cheeks", "Jaw", "Nose"].map(
                            (area) => (
                              <TableRow key={area}>
                                <TableCell>{area}</TableCell>
                                {["None", "Mild", "Moderate", "Severe"].map(
                                  (severity) => (
                                    <TableCell key={severity}>
                                      <Radio
                                        {...register(
                                          `pigmentationDetails.${area.toLowerCase()}`,
                                          { required: true }
                                        )}
                                        value={severity}
                                      />
                                    </TableCell>
                                  )
                                )}
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </FormControl>
                </div>
              )}

              {selectedSkinHealthIssues.includes("dryness") && (
                <div>
                  <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">
                      Describe your dryness issues:
                    </FormLabel>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell>None</TableCell>
                            <TableCell>Mild</TableCell>
                            <TableCell>Moderate</TableCell>
                            <TableCell>Severe</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {["Forehead", "Chin", "Cheeks", "Jaw", "Nose"].map(
                            (area) => (
                              <TableRow key={area}>
                                <TableCell>{area}</TableCell>
                                {["None", "Mild", "Moderate", "Severe"].map(
                                  (severity) => (
                                    <TableCell key={severity}>
                                      <Radio
                                        {...register(
                                          `drynessDetails.${area.toLowerCase()}`,
                                          { required: true }
                                        )}
                                        value={severity}
                                      />
                                    </TableCell>
                                  )
                                )}
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </FormControl>
                </div>
              )}

              {selectedSkinHealthIssues.includes("oiliness") && (
                <div>
                  <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">
                      Describe your oiliness issues:
                    </FormLabel>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell>None</TableCell>
                            <TableCell>Mild</TableCell>
                            <TableCell>Moderate</TableCell>
                            <TableCell>Severe</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {["Forehead", "Chin", "Cheeks", "Jaw", "Nose"].map(
                            (area) => (
                              <TableRow key={area}>
                                <TableCell>{area}</TableCell>
                                {["None", "Mild", "Moderate", "Severe"].map(
                                  (severity) => (
                                    <TableCell key={severity}>
                                      <Radio
                                        {...register(
                                          `oilinessDetails.${area.toLowerCase()}`,
                                          { required: true }
                                        )}
                                        value={severity}
                                      />
                                    </TableCell>
                                  )
                                )}
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </FormControl>
                </div>
              )}

              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  {page < 3 ? "Next" : "Submit"}
                </Button>
              </Box>
            </div>
          )}
          {page === 3 && (
            <Grid container spacing={3}>
              {/* <Grid item xs={12}>
                <Typography variant="h6">Upload Images</Typography>
                <input
                  type="file"
                  {...register("images", { required: true })}
                  multiple
                />
                {errors.images && <span>This field is required</span>}
              </Grid> */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handlePrevious}
                  >
                    Previous
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </form>
      </Container>
    </Box>
  );
}

export default App;
