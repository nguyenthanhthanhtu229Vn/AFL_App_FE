import React, { useState, useEffect } from "react";
import styles from "./styles/style.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import gsap from "gsap";
import AOS from "aos";
import Transitions from "../Transitions/Transitions";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import CompetitionFormat from "./CompetitionFormat";
import Description from "./Description";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import { createSchedule } from "../../api/MatchAPI";
import LoadingAction from "../LoadingComponent/LoadingAction";
import { useNavigate } from "react-router-dom";
import myData from "../../provice.json";
const CreateTournament = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(-1);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const descriptionText = draftToHtml(
    convertToRaw(editorState.getCurrentContent())
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [imgTournament, setImgTournament] = useState({
    value: "",
    img: null,
    error: null,
  });

  const [nameTournament, setNameTournament] = useState({
    value: "",
    error: null,
  });
  const [teamPaticipate, setTeamPaticipate] = useState({
    value: "",
    error: null,
  });
  const [typeFootballField, setTypeFootballField] = useState({
    value: "Field5",
    error: null,
  });
  const [closeRegister, setCloseRegister] = useState({
    value: null,
    error: null,
  });
  const [startTime, setStartTime] = useState({
    value: null,
    error: null,
  });

  //new Date().toISOString().split(".")[0]
  const [endTime, setEndTime] = useState({
    value: null,
    error: null,
  });
  const [competitionFormat, setCompetitionFormat] = useState({
    value: "CircleStage",
    error: null,
  });
  const [minimunPlayerInTournament, setMinimunPlayerInTournament] = useState({
    value: null,
    error: null,
  });
  const [phoneContact, setPhoneContact] = useState({
    value: null,
    error: null,
  });
  const [footballField, setFootballField] = useState({
    value: "",
    error: null,
  });
  const [gender, setGender] = useState({
    value: "Male",
    error: null,
  });
  const [timeDuration, setTimeDuration] = useState({
    value: "15",
    error: null,
  });
  const [groupNumber, setGroupNumber] = useState({
    value: "-1",
    error: null,
  });
  const [minDate, setMinDate] = useState(
    new Date().toISOString().split(".")[0]
  );
  const [loading, setLoading] = useState(false);
  const [btnActive, setBtnActive] = useState(false);
  const [resetProvice, setResetProvice] = useState(-1);
  const [provice, setProvice] = useState(null);
  const [districts, setDistricts] = useState(null);
  const [wards, setWards] = useState(null);
  const [addressField, setAddressField] = useState(null);
  const [proviceSearch, setProviceSearch] = useState(null);
  const [districSearch, setDistricSearch] = useState(null);
  const [wardSearch, setWardSearch] = useState(null);
  AOS.init();
  const tour = gsap.timeline();
  useEffect(() => {
    setResetProvice(-1);
    getAllCity();
  }, [resetProvice]);
  const getAllCity = async () => {
    setProvice(myData);
  };

  const createGenerateTable = (id) => {
    const response = createSchedule(id);
    response
      .then((res) => {
        if (res.status === 200) {
          navigate(`/tournamentDetail/${id}/inforTournamentDetail`);
          setLoading(false);
          toast.success("Tạo giải đấu và lịch thi đấu thành công", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          const intitalState = {
            value: "",
            error: "",
          };
          setImgTournament(intitalState);
          setNameTournament(intitalState);
          setTeamPaticipate(intitalState);
          setTypeFootballField({
            value: 1,
            error: "",
          });

          setCloseRegister({
            value: null,
            error: "",
          });
          setStartTime(intitalState);
          setEndTime(intitalState);
          setCompetitionFormat({
            value: 1,
            error: "",
          });
          setMinimunPlayerInTournament(intitalState);
          setPhoneContact(intitalState);
          setFootballField(intitalState);
          setGender({
            value: "Male",
            error: "",
          });
          setTimeDuration({
            value: 15,
            error: "",
          });
          setEditorState(EditorState.createEmpty());
          setProvice(null);
          setDistricts(null);
          setWards(null);
          setResetProvice(0);
          setGroupNumber({
            value: "-1",
            error: null,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const onSubmitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    const flag = checkValidateAdd();
    if (flag !== null) {
      setLoading(false);
      toast.error(flag, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      try {
        const data = {
          tournamentName: nameTournament.value,
          mode: status === -1 ? "PRIVATE" : "PUBLIC",
          tournamentPhone: phoneContact.value,
          tournamentGender: gender.value,
          registerEndDate: closeRegister.value,
          tournamentStartDate: startTime.value,
          tournamentEndDate: endTime.value,
          footballFieldAddress: footballField.value + addressField,
          tournamentAvatar: imgTournament.value,
          description: descriptionText,
          matchMinutes: +timeDuration.value,
          footballTeamNumber: teamPaticipate.value,
          footballPlayerMaxNumber: minimunPlayerInTournament.value,
          status: true,
          userId: user.userVM.id,
          groupNumber: +groupNumber.value,
          TournamentTypeEnum: competitionFormat.value,
          TournamentFootballFieldTypeEnum: typeFootballField.value,
        };

        const response = await axios.post(
          "https://afootballleague.ddns.net/api/v1/tournaments",
          data,
          {
            headers: { "content-type": "multipart/form-data" },
          }
        );
        if (response.status === 201) {
          createGenerateTable(response.data.id);
        }
      } catch (error) {
        setLoading(false);
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error(error.response);
      }
    }
  };
  const validateForm = (name, value) => {
    switch (name) {
      case "imgTournament":
        break;
      case "nameTournament":
        if (/\d+/.test(value)) {
          return {
            flag: false,
            content: "Tên đội bóng là chữ",
          };
        }
        break;
      case "groupNumber":
        if (value.length === 0) {
          return {
            flag: false,
            content: "Không được để trống",
          };
        } else if (!/^[0-9]+$/.test(value)) {
          return {
            flag: false,
            content: "Đội tham gia là số",
          };
        } else if (value === 2 || value === 4) {
          return {
            flag: false,
            content: "Nhập 2 hoặc 4 bảng đấu",
          };
        }
        break;

      case "teamPaticipate":
        if (!/^[0-9]+$/.test(value)) {
          return {
            flag: false,
            content: "Đội tham gia là số",
          };
        }
        break;
      case "typeFootballField":
        break;
      case "closeRegister":
        break;
      case "startTime":
        break;
      case "endTime":
        break;
      case "competitionFormat":
        break;
      case "minimunPlayerInTournament":
        if (!/^[0-9]+$/.test(value)) {
          return {
            flag: false,
            content: "Đội tham gia là số",
          };
        }

        break;
      case "phoneContact":
        if (!/^[0-9]+$/.test(value)) {
          return {
            flag: false,
            content: "Số điện thoại không được là chữ hay kí tự khác",
          };
        }
        break;

      case "footballField":
        break;
      default:
        break;
    }
    return { flag: true, content: null };
  };
  const checkValidateAdd = () => {
    if (
      closeRegister.value !== null &&
      new Date(closeRegister.value).getTime() >=
        new Date(startTime.value).getTime()
    ) {
      return "Ngày đăng ký phải trước ngày bắt đầu";
    }
    //nameTournament phoneContact minimunPlayerInTournament  teamPaticipate  closeRegister startTime endTime
    if (nameTournament.value === null || nameTournament.value.length === 0) {
      return "Tên giải đấu không được để trống";
    }
    if (phoneContact.value === null || phoneContact.value.length === 0) {
      return "Số điện thoại không được để trống";
    } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(phoneContact.value)) {
      return "Sai định dạng số điện thoại";
    }
    if (status === 0 && closeRegister.value === null) {
      return "Ngày đóng đăng ký tham gia không được để trống";
    }
    // +
    //       new Date().getTime() -
    //       new Date(startTime.value).getTime() >
    //       0
    //       ? new Date().getTime() - new Date(startTime.value).getTime()
    //       : new Date().getTime() -
    //           new Date().getTime() -
    //           new Date().getHours() * 60 * 60 * 1000
    if (startTime.value === null) {
      return "Ngày bắt đầu không được để trống";
    }
    // else if (
    //   status === -1 &&
    //   Math.abs(
    //     new Date().getTime() -
    //       new Date(startTime.value).getTime()
    //   ) <
    //     24 * 60 * 60 * 1000
    // ) {
    //   return "Không thể bắt đầu ngày hôm nay vì chưa đủ đội";
    // }
    if (endTime.value === null) {
      return "Ngày kết thúc không được để trống";
    }
    if (teamPaticipate.value === null || teamPaticipate.value.length === 0) {
      return "Số đội tham gia không được để trống";
    } else if (
      competitionFormat.value === "CircleStage" &&
      (teamPaticipate.value < 3 || teamPaticipate.value > 8)
    ) {
      return "Số đội tham gia hình thức thi đấu vòng tròn nằm trong khoảng từ 3-8 đội";
    } else if (
      competitionFormat.value === "KnockoutStage" &&
      (teamPaticipate.value < 3 || teamPaticipate.value > 16)
    ) {
      return "Số đội tham gia hình thức thi đấu trực tiếp nằm trong khoảng từ 3-16 đội";
    } else if (
      competitionFormat.value === "GroupStage" &&
      (teamPaticipate.value < 6 || teamPaticipate.value > 16)
    ) {
      return "Số đội tham gia hình thức thi đấu chia bảng nằm trong khoảng từ 6-16 đội";
    }
    if (
      minimunPlayerInTournament.value === null ||
      minimunPlayerInTournament.value.length === 0
    ) {
      return "Số cầu thủ tối thiểu mỗi đội không được để trống";
    } else if (
      minimunPlayerInTournament.value <
      (typeFootballField.value == "Field5"
        ? 5
        : typeFootballField.value == "Field7"
        ? 7
        : 11)
    ) {
      return "Số cầu thủ ít hơn quy định loại sân";
    }
    if (
      proviceSearch === null ||
      districSearch === null ||
      wardSearch === null || wardSearch.length <= 0 ||
      footballField.value === null || footballField.value.length <= 0
    ) {
      return "Thông tin về địa điểm sân thi đấu không được để trống";
    }
    return null;
  };
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    //console.log(name,value);
    const validate = validateForm(name, value);
    if (validate.flag) {
      setBtnActive(true);
    } else {
      setBtnActive(false);
    }
    switch (name) {
      case "imgTournament":
        setImgTournament({
          ...imgTournament,
          value: e.target.files[0],
          img: URL.createObjectURL(e.target.files[0]),
          error: validate.content,
        });
        break;
      case "nameTournament":
        setNameTournament({
          ...nameTournament,
          value,
          error: validate.content,
        });
        break;
      case "teamPaticipate":
        setTeamPaticipate({
          ...teamPaticipate,
          value,
          error: validate.content,
        });
        break;
      case "groupNumber":
        setGroupNumber({
          ...teamPaticipate,
          value,
          error: validate.content,
        });
        break;
      case "typeFootballField":
        setTypeFootballField({
          ...typeFootballField,
          value,
          error: validate.content,
        });
        break;
      case "closeRegister":
        setCloseRegister({
          ...closeRegister,
          value,
          error: validate.content,
        });
        break;
      case "startTime":
        setStartTime({
          ...startTime,
          value,
          error: validate.content,
        });
        break;
      case "endTime":
        setEndTime({
          ...endTime,
          value,
          error: validate.content,
        });
        break;
      case "competitionFormat":
        console.log(value);
        setTeamPaticipate({
          value: "",
          error: null,
        });
        if (value !== "GroupStage") {
          setGroupNumber({
            value: "-1",
            error: null,
          });
        } else {
          setGroupNumber({
            value: "2",
            error: null,
          });
        }

        setCompetitionFormat({
          ...competitionFormat,
          value,
        });
        break;
      case "minimunPlayerInTournament":
        setMinimunPlayerInTournament({
          ...minimunPlayerInTournament,
          value,
          error: validate.content,
        });
        break;
      case "phoneContact":
        setPhoneContact({
          ...phoneContact,
          value,
          error: validate.content,
        });
        break;
      case "footballField":
        setFootballField({
          ...footballField,
          value,
          error: validate.content,
        });
        break;
      case "gender":
        setGender({
          ...gender,
          value,
          error: validate.content,
        });
        break;
      case "timeDuration":
        setTimeDuration({
          ...timeDuration,
          value,
          error: validate.content,
        });
        break;
      case "provice":
        let dataProvice = provice;
        const proviceFind = dataProvice.find((item) => item.name === value);
        setProviceSearch(value);
        setDistricSearch("default");
        setDistricts(proviceFind.districts);
        setWards(null);
        setAddressField(", " + value);
        break;
      case "districts":
        let dataDis = districts;

        const disFind = dataDis.find((item) => item.name === value);
        setDistricSearch(value);
        setWardSearch("default");
        setWards(disFind.wards);
        const oldAddress = addressField;
        setAddressField(", " + value + oldAddress);
        break;
      case "wards":
        setWardSearch(value);
        {
          const oldAddress = addressField;
          setAddressField(", " + value + oldAddress);
        }
        break;
      default:
        break;
    }
  };
  const addDays = (data, numDay) => {
    if (data !== undefined || data !== null) {
      const addDay = data;
      addDay.setTime(addDay.getTime() + numDay * 24 * 60 * 60 * 1000);
      return addDay.toJSON().split("T")[0];
    }
  };
  return (
    <>
      <ScrollToTop />
      <Transitions timeline={tour} />
      <Header />
      <div className={styles.createTournament}>
        <div className={styles.createTournament_info}>
          <div>
            <div>
              <h1 className={styles.createTournament_title}>Tạo giải đấu</h1>
              <hr width={100} size={10} className={styles.hr} />
            </div>
            <div
              style={{
                marginTop: 30,
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                id="switch"
                className={styles.switch__input}
              />
              <label
                htmlFor="switch"
                className={styles.switch}
                onClick={() => {
                  setStartTime({
                    value: null,
                    error: null,
                  });
                  setEndTime({
                    value: null,
                    error: null,
                  });
                  if (status === 0) {
                    setCloseRegister({
                      value: null,
                      error: null,
                    });
                    setStartTime({
                      value: null,
                      error: null,
                    });
                    setEndTime({
                      value: null,
                      error: null,
                    });
                    setStatus(-1);
                  } else {
                    setStartTime({
                      value: null,
                      error: null,
                    });
                    setEndTime({
                      value: null,
                      error: null,
                    });
                    setStatus(0);
                  }
                }}
              />
              <p
                style={{
                  marginLeft: 10,
                }}
              >
                Chế độ {status === 0 ? "công khai" : "riêng tư"}
              </p>
            </div>
          </div>
          <form onSubmit={onSubmitHandler}>
            <div className={styles.createTournament_row1}>
              <div className={styles.createTournament_img}>
                <h1 className={styles.createTournament_img_title}>
                  Hình giải đấu
                </h1>
                <div className={styles.wrapAvt}>
                  <input
                    type="file"
                    id="file_imgCreateTournament"
                    accept="image/*"
                    name="imgTournament"
                    onChange={onChangeHandler}
                    className={styles.file_imgCreateTournament}
                  />
                  <label
                    htmlFor="file_imgCreateTournament"
                    className={styles.createTournament_img_detail}
                  >
                    <img
                      src={
                        imgTournament.value === ""
                          ? "assets/img/createteam/camera.png"
                          : imgTournament.img
                      }
                      alt="camera"
                      className={
                        imgTournament.value === "" ? styles.cmr : styles.cmrb
                      }
                    />

                    <p className={styles.btnUploadImg_createTournament}>
                      Tải ảnh lên{" "}
                      <i
                        style={{
                          marginLeft: 10,
                        }}
                        className="fa-solid fa-upload"
                      ></i>
                    </p>
                  </label>

                  {/* <input type="file" /> */}
                </div>
              </div>
              <div className={styles.createTournament_row1_col2}>
                <div className={styles.nameTournament}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <label
                      htmlFor="createTour"
                      className={styles.createTournament_img_title}
                    >
                      Tên giải đấu (*)
                    </label>
                    {nameTournament.error != null ? (
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        {nameTournament.error}
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>

                  <input
                    id="createTour"
                    placeholder="Tên giải đấu"
                    onChange={onChangeHandler}
                    name="nameTournament"
                    value={nameTournament.value}
                  />
                </div>
                <div className={styles.contactPhone}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <label
                      htmlFor="phoneContact"
                      className={styles.createTournament_img_title}
                    >
                      Số điện thoại liên lạc (*)
                    </label>
                    {phoneContact.error != null ? (
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        {phoneContact.error}
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>

                  <input
                    type="text"
                    id="phoneContact"
                    className={styles.phoneContact}
                    placeholder="Số điện thoại"
                    name="phoneContact"
                    value={phoneContact.value}
                    onChange={onChangeHandler}
                  />
                </div>
                <div>
                  <label
                    className={styles.createTournament_img_title}
                    htmlFor="genderteam"
                  >
                    Giới tính đội (*)
                  </label>
                  <select
                    name="gender"
                    value={gender.value}
                    onChange={onChangeHandler}
                    id="genderteam"
                    className={styles.timeCloseRegister_input}
                    required
                  >
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                  </select>
                </div>
              </div>

              <div className={styles.createTournament_row1_col3}>
                <div className={styles.timeCloseRegister}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <label
                      htmlFor="timeCloseRegister"
                      className={styles.createTournament_img_title}
                    >
                      Ngày đóng đăng ký tham gia {status === 0 && "(*)"}
                    </label>
                    {closeRegister.error != null ? (
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        {closeRegister.error}
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>
                  <input
                    className={styles.timeCloseRegister_input}
                    id="timeCloseRegister"
                    type="date"
                    name="closeRegister"
                    value={
                      closeRegister.value == null ? "" : closeRegister.value
                    }
                    onChange={onChangeHandler}
                    disabled={status === 0 ? "" : "disable"}
                    min={addDays(new Date(), 3)}
                  />
                </div>

                <div className={styles.timeStart}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <label
                      className={styles.createTournament_img_title}
                      htmlFor="startTime"
                    >
                      Ngày bắt đầu (*)
                    </label>
                    {startTime.error != null ? (
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        {startTime.error}
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>
                  <input
                    className={styles.timeStart_input}
                    id="startTime"
                    type="date"
                    min={
                      status === 0 &&
                      (closeRegister.value !== null ||
                        closeRegister.value !== "")
                        ? addDays(new Date(closeRegister.value), 1)
                        : addDays(new Date(), 3)
                    }
                    name="startTime"
                    value={startTime.value === null ? "" : startTime.value}
                    disabled={
                      status === 0 && closeRegister.value != null
                        ? ""
                        : status === -1
                        ? ""
                        : "disable"
                    }
                    onChange={onChangeHandler}
                  />
                </div>

                <div className={styles.timeEnd}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <label
                      htmlFor="endTime"
                      className={styles.createTournament_img_title}
                    >
                      Ngày kết thúc (*)
                    </label>
                    {endTime.error != null ? (
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        {endTime.error}
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>

                  <input
                    className={styles.timeEnd_input}
                    id="endTime"
                    min={
                      startTime.value !== null || startTime.value !== ""
                        ? addDays(new Date(startTime.value), 1)
                        : null
                    }
                    max={
                      startTime.value !== null || startTime.value !== ""
                        ? addDays(new Date(startTime.value), 31)
                        : null
                    }
                    type="date"
                    name="endTime"
                    value={endTime.value === null ? "" : endTime.value}
                    disabled={startTime.value != null ? "" : "disable"}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>
            </div>
            <CompetitionFormat
              teamPaticipate={teamPaticipate}
              competitionFormat={competitionFormat}
              onChangeHandler={onChangeHandler}
              groupNumber={groupNumber}
              lengthTeamPaticipate={0}
            />

            <div className={styles.createTournament_row4}>
              <div className={styles.createTournament_row4_col1}>
                <div className={styles.mininum_member}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <label
                      htmlFor="mininum_member"
                      className={styles.createTournament_img_title}
                    >
                      Số cầu thủ tối thiểu mỗi đội (*)
                    </label>
                    {minimunPlayerInTournament.error != null ? (
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        {minimunPlayerInTournament.error}
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>
                  <input
                    id="mininum_member"
                    className={styles.mininum_member_input}
                    name="minimunPlayerInTournament"
                    value={minimunPlayerInTournament.value}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className={styles.description_tournament}>
                  <label
                    htmlFor="description"
                    className={styles.createTournament_img_title}
                  >
                    Mô tả (*)
                  </label>
                  {/* <textarea
                  placeholder="Mô tả về giải đấu"
                  
                /> */}
                  <div className={styles.descTeam}>
                    <Description
                      editorState={editorState}
                      setEditorState={setEditorState}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.createTournament_row4_col2}>
                <div className={styles.typeFootballField}>
                  <label className={styles.createTournament_img_title}>
                    Loại sân thi đấu
                  </label>
                  <select
                    className={styles.select_typeFootballField}
                    onChange={onChangeHandler}
                    value={typeFootballField.value}
                    name="typeFootballField"
                  >
                    <option value="Field5">Sân thi đấu bóng đá 5</option>
                    <option value="Field7">Sân thi đấu bóng đá 7</option>
                    <option value="Field11">Sân thi đấu bóng đá 11</option>
                  </select>
                </div>
                <div className={styles.timeDuration}>
                  <label
                    className={styles.createTournament_img_title}
                    htmlFor="timeDuration"
                  >
                    Thời gian thi đấu mỗi trận
                  </label>
                  <select
                    className={styles.select_typeFootballField}
                    id="timeDuration"
                    onChange={onChangeHandler}
                    value={timeDuration.value}
                    name="timeDuration"
                  >
                    <option value="15">15p</option>
                    <option value="30">30p</option>
                    <option value="45">45p</option>
                  </select>
                </div>
                <div className={styles.fieldSoccer}>
                  <div className={styles.location}>
                    <label
                      className={styles.createTournament_img_title}
                      htmlFor="provice"
                    >
                      Thành phố/Tỉnh (*)
                    </label>
                    <select
                      style={{
                        padding: "10px 5px",
                      }}
                      name="provice"
                      onChange={onChangeHandler}
                      value={proviceSearch}
                    >
                      <option selected disabled>
                        Chọn thành phố
                      </option>
                      {provice != null
                        ? provice.map((item, index) => {
                            return (
                              <option value={item.name} key={index}>
                                {item.name}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  </div>

                  <div className={styles.location}>
                    <label
                      className={styles.createTournament_img_title}
                      htmlFor="districts"
                    >
                      Quận/Huyện (*)
                    </label>
                    <select
                      style={{
                        padding: "10px 5px",
                      }}
                      name="districts"
                      onChange={onChangeHandler}
                      value={districSearch}
                    >
                      <option value="default" selected disabled>
                        Chọn quận
                      </option>
                      {districts != null
                        ? districts.map((item, index) => {
                            return (
                              <option value={item.name} key={index}>
                                {item.name}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  </div>

                  <div className={styles.location}>
                    <label
                      className={styles.createTournament_img_title}
                      htmlFor="wards"
                    >
                      Phường/Xã (*)
                    </label>
                    <select
                      style={{
                        padding: "10px 5px",
                      }}
                      name="wards"
                      onChange={onChangeHandler}
                      value={wardSearch}
                    >
                      <option value="default" selected disabled>
                        Chọn phường
                      </option>
                      {wards != null
                        ? wards.map((item, index) => {
                            return (
                              <option value={item.name} key={index}>
                                {item.name}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                      }}
                    >
                      <label
                        className={styles.createTournament_img_title}
                        htmlFor="fieldSoccer"
                      >
                        Địa điểm (*)
                      </label>
                      {footballField.error != null ? (
                        <p
                          style={{
                            color: "red",
                          }}
                        >
                          {footballField.error}
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>

                    <input
                      id="fieldSoccer"
                      className={styles.fieldSoccer_input}
                      placeholder="Nhập địa chỉ"
                      name="footballField"
                      value={footballField.value}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.optionBtn}>
              <input
                type="button"
                className={styles.cancleCreate}
                onClick={() => {
                  navigate(-1);
                }}
                value="Hủy tạo"
              />
              {btnActive ? (
                <input
                  type="submit"
                  className={styles.createTeam_btn}
                  value="Tạo giải"
                />
              ) : null}
            </div>
          </form>
        </div>
      </div>
      {loading ? <LoadingAction /> : null}
      <ToastContainer />
      <Footer />
    </>
  );
};

export default CreateTournament;
