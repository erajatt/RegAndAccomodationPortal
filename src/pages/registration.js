import React, { useState, useEffect } from "react";
import "./registration.css"; // Import the CSS file
import axios from "axios";
import FeeBreakdown from "../components/FeeBreakdown";
import RegistrationDetails from "../components/RegistrationDetails";
import { useNavigate, Link } from "react-router-dom";
import DropdownTextInput from "../components/dropdownInput";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { DateTime } from "luxon";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti, { ReactConfetti } from "react-confetti";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

const IST = "Asia/Kolkata";

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea (North)",
  "Korea (South)",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const Saarc = [
  "Afghanistan",
  "Bangladesh",
  "Bhutan",
  "India",
  "Maldives",
  "Nepal",
  "Pakistan",
  "Sri Lanka",
];

const countryCodes = [
  { code: "93", name: "Afghanistan" },
  { code: "355", name: "Albania" },
  { code: "213", name: "Algeria" },
  { code: "376", name: "Andorra" },
  { code: "244", name: "Angola" },
  { code: "1-268", name: "Antigua and Barbuda" },
  { code: "54", name: "Argentina" },
  { code: "374", name: "Armenia" },
  { code: "61", name: "Australia" },
  { code: "43", name: "Austria" },
  { code: "994", name: "Azerbaijan" },
  { code: "1-242", name: "Bahamas" },
  { code: "973", name: "Bahrain" },
  { code: "880", name: "Bangladesh" },
  { code: "1-246", name: "Barbados" },
  { code: "375", name: "Belarus" },
  { code: "32", name: "Belgium" },
  { code: "501", name: "Belize" },
  { code: "229", name: "Benin" },
  { code: "975", name: "Bhutan" },
  { code: "591", name: "Bolivia" },
  { code: "387", name: "Bosnia and Herzegovina" },
  { code: "267", name: "Botswana" },
  { code: "55", name: "Brazil" },
  { code: "673", name: "Brunei" },
  { code: "359", name: "Bulgaria" },
  { code: "226", name: "Burkina Faso" },
  { code: "257", name: "Burundi" },
  { code: "238", name: "Cabo Verde" },
  { code: "855", name: "Cambodia" },
  { code: "237", name: "Cameroon" },
  { code: "1", name: "Canada" },
  { code: "236", name: "Central African Republic" },
  { code: "235", name: "Chad" },
  { code: "56", name: "Chile" },
  { code: "86", name: "China" },
  { code: "57", name: "Colombia" },
  { code: "269", name: "Comoros" },
  { code: "242", name: "Congo" },
  { code: "506", name: "Costa Rica" },
  { code: "385", name: "Croatia" },
  { code: "53", name: "Cuba" },
  { code: "357", name: "Cyprus" },
  { code: "420", name: "Czech Republic" },
  { code: "45", name: "Denmark" },
  { code: "253", name: "Djibouti" },
  { code: "1-767", name: "Dominica" },
  { code: "1-809, 1-829, 1-849", name: "Dominican Republic" },
  { code: "670", name: "East Timor" },
  { code: "593", name: "Ecuador" },
  { code: "20", name: "Egypt" },
  { code: "503", name: "El Salvador" },
  { code: "240", name: "Equatorial Guinea" },
  { code: "291", name: "Eritrea" },
  { code: "372", name: "Estonia" },
  { code: "268", name: "Eswatini" },
  { code: "251", name: "Ethiopia" },
  { code: "679", name: "Fiji" },
  { code: "358", name: "Finland" },
  { code: "33", name: "France" },
  { code: "241", name: "Gabon" },
  { code: "220", name: "Gambia" },
  { code: "995", name: "Georgia" },
  { code: "49", name: "Germany" },
  { code: "233", name: "Ghana" },
  { code: "30", name: "Greece" },
  { code: "1-473", name: "Grenada" },
  { code: "502", name: "Guatemala" },
  { code: "224", name: "Guinea" },
  { code: "245", name: "Guinea-Bissau" },
  { code: "592", name: "Guyana" },
  { code: "509", name: "Haiti" },
  { code: "504", name: "Honduras" },
  { code: "36", name: "Hungary" },
  { code: "354", name: "Iceland" },
  { code: "91", name: "India" },
  { code: "62", name: "Indonesia" },
  { code: "98", name: "Iran" },
  { code: "964", name: "Iraq" },
  { code: "353", name: "Ireland" },
  { code: "972", name: "Israel" },
  { code: "39", name: "Italy" },
  { code: "225", name: "Ivory Coast" },
  { code: "1-876", name: "Jamaica" },
  { code: "81", name: "Japan" },
  { code: "962", name: "Jordan" },
  { code: "7", name: "Kazakhstan" },
  { code: "254", name: "Kenya" },
  { code: "686", name: "Kiribati" },
  { code: "850", name: "Korea (North)" },
  { code: "82", name: "Korea (South)" },
  { code: "383", name: "Kosovo" },
  { code: "965", name: "Kuwait" },
  { code: "996", name: "Kyrgyzstan" },
  { code: "856", name: "Laos" },
  { code: "371", name: "Latvia" },
  { code: "961", name: "Lebanon" },
  { code: "266", name: "Lesotho" },
  { code: "231", name: "Liberia" },
  { code: "218", name: "Libya" },
  { code: "423", name: "Liechtenstein" },
  { code: "370", name: "Lithuania" },
  { code: "352", name: "Luxembourg" },
  { code: "261", name: "Madagascar" },
  { code: "265", name: "Malawi" },
  { code: "60", name: "Malaysia" },
  { code: "960", name: "Maldives" },
  { code: "223", name: "Mali" },
  { code: "356", name: "Malta" },
  { code: "692", name: "Marshall Islands" },
  { code: "222", name: "Mauritania" },
  { code: "230", name: "Mauritius" },
  { code: "52", name: "Mexico" },
  { code: "691", name: "Micronesia" },
  { code: "373", name: "Moldova" },
  { code: "377", name: "Monaco" },
  { code: "976", name: "Mongolia" },
  { code: "382", name: "Montenegro" },
  { code: "212", name: "Morocco" },
  { code: "258", name: "Mozambique" },
  { code: "95", name: "Myanmar" },
  { code: "264", name: "Namibia" },
  { code: "674", name: "Nauru" },
  { code: "977", name: "Nepal" },
  { code: "31", name: "Netherlands" },
  { code: "64", name: "New Zealand" },
  { code: "505", name: "Nicaragua" },
  { code: "227", name: "Niger" },
  { code: "234", name: "Nigeria" },
  { code: "389", name: "North Macedonia" },
  { code: "47", name: "Norway" },
  { code: "968", name: "Oman" },
  { code: "92", name: "Pakistan" },
  { code: "680", name: "Palau" },
  { code: "507", name: "Panama" },
  { code: "675", name: "Papua New Guinea" },
  { code: "595", name: "Paraguay" },
  { code: "51", name: "Peru" },
  { code: "63", name: "Philippines" },
  { code: "48", name: "Poland" },
  { code: "351", name: "Portugal" },
  { code: "974", name: "Qatar" },
  { code: "40", name: "Romania" },
  { code: "7", name: "Russia" },
  { code: "250", name: "Rwanda" },
  { code: "1-869", name: "Saint Kitts and Nevis" },
  { code: "1-758", name: "Saint Lucia" },
  { code: "1-784", name: "Saint Vincent and the Grenadines" },
  { code: "685", name: "Samoa" },
  { code: "378", name: "San Marino" },
  { code: "239", name: "Sao Tome and Principe" },
  { code: "966", name: "Saudi Arabia" },
  { code: "221", name: "Senegal" },
  { code: "381", name: "Serbia" },
  { code: "248", name: "Seychelles" },
  { code: "232", name: "Sierra Leone" },
  { code: "65", name: "Singapore" },
  { code: "421", name: "Slovakia" },
  { code: "386", name: "Slovenia" },
  { code: "677", name: "Solomon Islands" },
  { code: "252", name: "Somalia" },
  { code: "27", name: "South Africa" },
  { code: "211", name: "South Sudan" },
  { code: "34", name: "Spain" },
  { code: "94", name: "Sri Lanka" },
  { code: "249", name: "Sudan" },
  { code: "597", name: "Suriname" },
  { code: "46", name: "Sweden" },
  { code: "41", name: "Switzerland" },
  { code: "963", name: "Syria" },
  { code: "886", name: "Taiwan" },
  { code: "992", name: "Tajikistan" },
  { code: "255", name: "Tanzania" },
  { code: "66", name: "Thailand" },
  { code: "228", name: "Togo" },
  { code: "676", name: "Tonga" },
  { code: "1-868", name: "Trinidad and Tobago" },
  { code: "216", name: "Tunisia" },
  { code: "90", name: "Turkey" },
  { code: "993", name: "Turkmenistan" },
  { code: "688", name: "Tuvalu" },
  { code: "256", name: "Uganda" },
  { code: "380", name: "Ukraine" },
  { code: "971", name: "United Arab Emirates" },
  { code: "44", name: "United Kingdom" },
  { code: "1", name: "United States" },
  { code: "598", name: "Uruguay" },
  { code: "998", name: "Uzbekistan" },
  { code: "678", name: "Vanuatu" },
  { code: "379", name: "Vatican City" },
  { code: "58", name: "Venezuela" },
  { code: "84", name: "Vietnam" },
  { code: "967", name: "Yemen" },
  { code: "260", name: "Zambia" },
  { code: "263", name: "Zimbabwe" },
];

const categoryFees = {
  SSM: 6500,
  SSN: 7200,
  SFM: 8400,
  SFN: 9600,
  SIM: 11000,
  SIN: 12100,
  NSN: 16600,
  NFN: 38180,
  NIN: 45650,
};

const accompanyingFees = {
  SSM: 3800,
  SSN: 3800,
  SFM: 3800,
  SFN: 3800,
  SIM: 3800,
  SIN: 3800,
  NSN: 14940,
  NFN: 14940,
  NIN: 14940,
};

const paperFees = {
  1: 0,
  2: 0.25,
};

const updatedCountryCodes = countryCodes.map((country) => ({
  code: `+${country.code}`,
  name: country.name,
}));

const Registration = () => {
  const { width, height } = useWindowSize();

  const [step, setStep] = useState(1);
  const [res, setRes] = useState({ category: "abc", fee: "INR 0" });
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [emailid, setemailid] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPaper1IdValid, setIsPaper1IdValid] = useState(false);
  const [isPaper2IdValid, setIsPaper2IdValid] = useState(false);

  const setEmail = async (token) => {
    try {
      const response = await axios.post(
        "https://regportal.onrender.com/auth/userAccess",
        { token }
      );
      setemailid(response.data.userEmail);
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  };
  useEffect(() => {
    const cookie = document.cookie;
    const cookieArray = cookie.split("; ");
    const desiredCookie = cookieArray.find((item) =>
      item.startsWith("access_token=")
    );
    if (desiredCookie) {
      const cookieValue = desiredCookie.split("=")[1];
      setEmail(cookieValue);
    }
  }, 3000);

  const yearOptions = [];
  for (let i = 0; i < 71; i++) {
    const year = 1940 + i;
    yearOptions.push(
      <option key={year} value={year}>
        {year}
      </option>
    );
  }

  const allOptions = Array.from({ length: 1000 }, (_, i) =>
    String(i).padStart(3, "0")
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (value === "") {
      setFilteredOptions([]);
      setIsOptionSelected(false);
    } else {
      const matchingOptions = allOptions.filter((option) =>
        option.startsWith(value)
      );
      setFilteredOptions(matchingOptions);
      setIsOptionSelected(matchingOptions.includes(value));
    }
  };

  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const [isStrictActionChecked, setIsStrictActionChecked] = useState(false);

  const handleOptionSelect = (option) => {
    setInputValue(option);
    setFilteredOptions([]);
  };

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    honorific: "",
    gender: "",
    birthYear: "",
    primaryAffiliation: "",
    country: "",
    email: "",
    contactNumberCode: "",
    contactNumber: "",
    whatsappNumberCode: "",
    whatsappNumber: "",
    paperCount: "",
    paper1Id: "",
    paper2Id: "",
    profile: "",
    accompanyingPersons: "",
    isIshmtMember: "No",
    ishmtIDFile: null,
    ishmtIDno: "",
    paymentReceipt: null,
    paymentReferenceNumber: "",
    comment: "",
    userID: "",
    category: "",
    fee: "",
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  formData.email = emailid;

  const Buttons = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
      window.localStorage.clear();
      navigate("/");
      toast.success("Logged out successfully");
    };

    const handleGoBack = () => {
      navigate(-1);
    };

    return (
      <div className="buttons-container">
        {!registrationSuccess && (
          <button className="back-button" onClick={handleGoBack}>
            Back
          </button>
        )}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value; // Create a variable to store the modified value

    switch (name) {
      case "firstName":
      case "middleName":
      case "lastName":
        updatedValue = value
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");
        break;
      case "email":
        updatedValue = value.toLowerCase();
        break;
      case "paper1Id":
        setIsPaper1IdValid(/^\d{3}$/.test(value));
        break;
      case "paper2Id":
        setInputValue(value);
        setIsPaper2IdValid(/^\d{3}$/.test(value));
        break;
      case "paperCount":
        if (value === "1") {
          setFormData((prevData) => ({
            ...prevData,
            paper2Id: "",
          }));
        } else if (value === "0") {
          setFormData((prevData) => ({
            ...prevData,
            paper1Id: "",
            paper2Id: "",
          }));
        }
        break;
      default:
        break;
    }

    // Update the form data with the modified value
    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      ishmtIDFile: file,
    }));
  };

  const isNumeric = (value) => {
    return /^\d+$/.test(value);
  };

  const handleFileUpload2 = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      paymentReceipt: file,
    }));
  };
  const handleSubmit = async (e) => {
    setLoadingf(true);
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      ["userID"]: window.localStorage.getItem("userID"),
    }));
    const response = await axios
      .post("https://regportal.onrender.com/form/fee", {
        country: formData.country,
        profile: formData.profile,
        isIshmtMember: formData.isIshmtMember,
        paperCount: formData.paperCount,
        accompanyingPersons: formData.accompanyingPersons,
      })
      .then((response) => {
        setRes(response.data.updatedFormData);
        setFormData((prevData) => ({
          ...prevData,
          category: response.data.updatedFormData.category,
          fee: response.data.updatedFormData.fee,
        }));
        setStep(2);
      })
      .catch((error) => {
        console.error("Error fetching registration data:", error);
      })
      .finally(() => {
        setLoadingf(false);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
  };

  const [earlybird, setEarlybird] = useState(false);
  const [loadingf, setLoadingf] = useState(false);

  useEffect(() => {
    const currentDate = DateTime.now().setZone(IST);
    const targetDate = DateTime.fromISO("2023-10-31", { zone: IST });

    if (currentDate <= targetDate) {
      setEarlybird(true);
    } else {
      setEarlybird(false);
    }
  }, step);

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        "https://regportal.onrender.com/form/submit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success === "false") toast.error(response.data.message);
      else {
        setRegistrationSuccess(true);
        toast.success("Form Submitted Successfully");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {step === 1 && <Buttons />}
      {loading ? (
        <Loading />
      ) : (
        <div
          className="form-container"
          style={{ marginBottom: "20px", opacity: loadingf ? 0.5 : 1 }}
        >
          {step === 1 && (
            <div className="registrationContainer">
              <h1>Conference Registration</h1>
              <p style={{ color: "red", textAlign: "right" }}>
                * -&gt; required fields
              </p>
              <form encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="labelText" htmlFor="firstName">
                    1a. Enter your first name as you would like it to appear on
                    the conference badge.{" "}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="labelText2" htmlFor="middleName">
                    1b. Enter your middle name as you would like it to appear on
                    the conference badge or leave blank.
                  </label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="labelText" htmlFor="lastName">
                    1c. Enter your last name as you would like it to appear on
                    the conference badge else if you don't have any last name,
                    then fill your first name again in this field.{" "}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  <p></p>
                </div>

                <div className="form-group">
                  <label className="labelText" htmlFor="honorific">
                    2. Please select the appropriate honorific (prefix) that
                    suits your profile.
                  </label>
                  <select
                    id="honorific"
                    name="honorific"
                    value={formData.honorific}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="labelText" htmlFor="gender">
                    3. Gender:{" "}
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="labelText" htmlFor="birthYear">
                    4. Year of Birth:{" "}
                  </label>
                  <select
                    id="birthYear"
                    name="birthYear"
                    value={formData.birthYear}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    {Array.from({ length: 71 }, (_, i) => 1940 + i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label className="labelText" htmlFor="primaryAffiliation">
                    5. Please enter your primary affiliation as you would like
                    it to appear on the conference badge.
                  </label>
                  <input
                    type="text"
                    id="primaryAffiliation"
                    name="primaryAffiliation"
                    value={formData.primaryAffiliation}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="labelText" htmlFor="country">
                    6. Please choose the country of your primary affiliation.
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    {/* List of all countries */}
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="labelText" htmlFor="email">
                    7. Please enter your email address.
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={emailid}
                    readOnly
                    style={{ backgroundColor: "#e5e5e5" }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="labelText" htmlFor="contactNumber">
                    8. Please enter your contact number.
                  </label>
                  <div className="phone-input">
                    <select
                      id="contactNumberCode"
                      name="contactNumberCode"
                      value={formData.contactNumberCode}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a country code</option>
                      {updatedCountryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name} {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      pattern="[0-9]*"
                      required
                    />
                    <div>
                      <div className="infoIcon1">
                        <InfoOutlined />
                      </div>
                      <div className="tooltip1">
                        {
                          "It should be without any dashes (-) or without 0 at start. Suppose your contact number is +91-123-456-7890, then you should write it as 1234567890"
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="labelText2" htmlFor="whatsappNumber">
                    9. Please enter your WhatsApp contact number.
                  </label>
                  <div className="phone-input">
                    <select
                      id="whatsappNumberCode"
                      name="whatsappNumberCode"
                      value={formData.whatsappNumberCode}
                      onChange={handleChange}
                    >
                      <option value="">Select a country code</option>
                      {updatedCountryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name} ({country.code})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      id="whatsappNumber"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      pattern="[0-9]*"
                    />
                    <div>
                      <div className="infoIcon">
                        <InfoOutlined />
                      </div>
                      <div className="tooltip">
                        {
                          "It should be without any dashes (-) or without 0 at start. Suppose your contact number is +91-123-456-7890, then you should write it as 1234567890"
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="labelText" htmlFor="paperCount">
                    10. How many papers are you presenting in this conference?
                  </label>
                  <select
                    id="paperCount"
                    name="paperCount"
                    value={formData.paperCount}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="0">
                      0 (I am an Attendee or an Invited Speaker)
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
                {formData.paperCount && formData.paperCount !== "0" && (
                  <div className="form-group">
                    <label className="labelText" htmlFor="paper1Id">
                      Please enter the IHMTC paper # (last three digits of the
                      manuscript ID, in case the manuscript ID has two digits,
                      add a "0" before the manuscript ID) against which this
                      registration should be counted.
                      <br></br>
                      <br></br>10a. ID of Paper # 1
                    </label>
                    <DropdownTextInput
                      inputValue={formData.paper1Id}
                      handleInputChange={(value) =>
                        handleChange({ target: { name: "paper1Id", value } })
                      }
                    />
                  </div>
                )}
                {formData.paperCount === "2" && (
                  <div className="form-group">
                    <label className="labelText" htmlFor="paper2Id">
                      10b. ID of paper # 2{" "}
                    </label>
                    <DropdownTextInput
                      inputValue={formData.paper2Id}
                      handleInputChange={(value) =>
                        handleChange({ target: { name: "paper2Id", value } })
                      }
                    />
                  </div>
                )}
                <div className="form-group">
                  <label className="labelText" htmlFor="profile">
                    11. Choose from amongst the following:
                  </label>
                  <select
                    id="profile"
                    name="profile"
                    value={formData.profile}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="student">I am a Student</option>
                    <option value="faculty">I am a Faculty</option>
                    <option value="industry researcher">
                      I am affiliated with Industry/Research labs/others
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="labelText" htmlFor="accompanyingPersons">
                    12. How many other (don’t include yourself) persons (not
                    attending technical sessions) are accompanying you?
                  </label>
                  <select
                    id="accompanyingPersons"
                    name="accompanyingPersons"
                    value={formData.accompanyingPersons}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
                {Saarc.includes(formData.country) && (
                  <div className="form-group">
                    <label className="labelText" htmlFor="isIshmtMember">
                      13. Are you an ISHMT member?
                    </label>
                    <select
                      id="isIshmtMember"
                      name="isIshmtMember"
                      value={formData.isIshmtMember}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      {Saarc.includes(formData.country) && (
                        <option value="Yes">Yes</option>
                      )}
                      <option value="No">No</option>
                    </select>
                  </div>
                )}
                {formData.isIshmtMember === "Yes" && (
                  <div className="form-group">
                    <label className="labelText" htmlFor="ishmtIDFile">
                      13.a Upload a copy of your current/updated (valid only)
                      ISHMT ID (PDF or image file) :
                    </label>
                    <input
                      type="file"
                      id="ishmtIDFile"
                      name="ishmtIDFile"
                      accept="application/pdf, image/*"
                      onChange={handleFileUpload}
                      required
                      style={{
                        margin: "auto", // Center-align the input
                        display: "block", // Ensure the input takes up full width
                        width: "100%",
                      }}
                    />
                    <p className="disclaimer">
                      Note: The file you upload will be considered valid as per
                      your input. Make sure it contains the necessary
                      information.
                    </p>
                    <label className="labelText" htmlFor="ishmtIDFile">
                      13.b ISHMT ID No. :
                    </label>
                    <input
                      type="text"
                      id="ishmtIDno"
                      name="ishmtIDno"
                      onChange={handleChange}
                      required
                      style={{
                        margin: "auto",
                        display: "block",
                        width: "100%",
                      }}
                    />
                  </div>
                )}
                <button
                  type="submit"
                  className={`submit-button ${
                    ((formData.paperCount === "2" &&
                      (!isPaper1IdValid || !isPaper2IdValid)) ||
                      (formData.paperCount === "1" && !isPaper1IdValid)) &&
                    "disabled"
                  }`}
                  disabled={
                    (formData.paperCount === "2" &&
                      (!isPaper1IdValid || !isPaper2IdValid)) ||
                    (formData.paperCount === "1" && !isPaper1IdValid)
                  }
                >
                  Next <span className="next-icon">→</span>
                </button>
              </form>
            </div>
          )}
          {step === 2 && res && (
            <div
              className="registrationContainer"
              style={{ marginBottom: "20px" }}
            >
              {!registrationSuccess && (
                <button
                  className="backbutton"
                  type="button"
                  onClick={() => setStep(1)}
                >
                  <span className="back-icon">←</span> Back
                </button>
              )}

              <h1>
                {earlybird && <span>Early-Bird</span>} Registration Details
              </h1>
              <p>
                Your registration category is <strong>{res.category}</strong>{" "}
              </p>
              <p>
                Your registration amount is{" "}
                <strong>₹ {Math.ceil(res.fee).toFixed(2)}</strong>
              </p>

              <FeeBreakdown
                categoryFees={categoryFees}
                paperFees={paperFees}
                accompanyingFees={accompanyingFees}
                formData={formData}
                res={res}
              />
              <RegistrationDetails formData={formData} earlybird={earlybird} />
              <br></br>
              {!registrationSuccess && (
                <>
                  <p>
                    Please visit the following payment link, provide the
                    relevant information, make the payment for{" "}
                    <strong>₹ {Math.ceil(res.fee).toFixed(2)}</strong> and the
                    category (<strong>{res.category}</strong>), and come back
                    here to complete the remaining questions below.
                    <br />
                    <br />
                    <a
                      href="https://www.onlinesbi.sbi/sbicollect/icollecthome.htm?corpID=1968961&categoryName=IHMTC-2023"
                      target="_blank" // Opens the link in a new tab
                      rel="noopener noreferrer" // Recommended for security when using target="_blank"
                      className="payment-link-button"
                    >
                      Click to go to payment link
                    </a>
                  </p>
                </>
              )}
              <br></br>
              <form encType="multipart/form-data" onSubmit={handleSubmit2}>
                {!registrationSuccess && (
                  <div className="form-group">
                    <label className="labelText" htmlFor="paymentReceipt">
                      Upload the copy (PDF or image) of the payment receipt.
                    </label>
                    <input
                      type="file"
                      id="paymentReceipt"
                      name="paymentReceipt"
                      accept="application/pdf, image/*"
                      onChange={handleFileUpload2}
                      required
                      style={{
                        margin: "auto",
                        display: "block", // Ensure the input takes up full width
                        width: "100%",
                      }}
                    />
                    <p className="disclaimer">
                      Note: The file you upload will be considered valid as per
                      your input. Make sure it contains the necessary
                      information.
                    </p>
                  </div>
                )}
                {!registrationSuccess && (
                  <div className="form-group">
                    <label
                      className="labelText"
                      htmlFor="paymentReferenceNumber"
                    >
                      Enter your SBCollect reference number :
                      <br />
                      <span className="disclaimer">(Format: DUF5316282)</span>
                    </label>
                    <input
                      type="text"
                      id="paymentReferenceNumber"
                      name="paymentReferenceNumber"
                      value={formData.paymentReferenceNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
                {!registrationSuccess && (
                  <div className="form-group">
                    <label className="labelText2" htmlFor="Comment">
                      Any other comments?
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      rows={5}
                      style={{
                        width: "100%",
                        resize: "vertical",
                        border: "1px solid black", // Add the border style
                        padding: "5px",
                      }}
                    />
                  </div>
                )}
                {!registrationSuccess && (
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={isDeclarationChecked}
                        required
                        onChange={() =>
                          setIsDeclarationChecked(!isDeclarationChecked)
                        }
                      />
                      I declare that the information I have provided is correct.
                    </label>
                    <br />
                    {formData.isIshmtMember === "Yes" && (
                      <label>
                        <input
                          type="checkbox"
                          checked={isStrictActionChecked}
                          required
                          onChange={() =>
                            setIsStrictActionChecked(!isStrictActionChecked)
                          }
                        />
                        I understand that in case my ISHMT membership cannot be
                        verified by the ISHMT office, I will have to pay the
                        difference between the non-member and member rates
                        onsite at the conference venue.
                      </label>
                    )}
                    <br />
                    {formData.isIshmtMember === "Yes" && (
                      <button
                        type="submit"
                        className={`submit-button ${
                          (!isDeclarationChecked || !isStrictActionChecked) &&
                          "disabled"
                        }`}
                        disabled={
                          !isDeclarationChecked || !isStrictActionChecked
                        }
                        onClick={(event) => {
                          const confirmation = window.confirm(
                            "Are you sure you want to submit the form? This action can't be undone."
                          );
                          if (!confirmation) {
                            event.preventDefault(); // Prevent the default form submission
                          }
                        }}
                      >
                        Submit
                      </button>
                    )}
                    {formData.isIshmtMember !== "Yes" && (
                      <button
                        type="submit"
                        className={`submit-button ${
                          !isDeclarationChecked && "disabled"
                        }`}
                        disabled={!isDeclarationChecked}
                        onClick={(event) => {
                          const confirmation = window.confirm(
                            "Are you sure you want to submit the form? This action can't be undone."
                          );
                          if (!confirmation) {
                            event.preventDefault();
                          }
                        }}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                )}

                {registrationSuccess && (
                  <div className="success-message">
                    <p className="success-text">
                      Registration successful! You can now{" "}
                      <Link to="/home" className="return-link">
                        return to the homepage
                      </Link>
                      .
                    </p>
                  </div>
                )}
              </form>
            </div>
          )}
          {registrationSuccess && (
            <div className="conf" style={{ top: 0, position: "fixed" }}>
              <Confetti width={width} height={height} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Registration;
