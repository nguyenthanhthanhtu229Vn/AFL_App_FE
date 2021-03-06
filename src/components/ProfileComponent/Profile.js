import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAPI, postAPI, putAPI } from "../../api";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import styles from "./styles/style.module.css";
import firebase from "firebase/compat/app";
import DateTimePicker from "react-datetime-picker";
import useAuthListener from "../../hooks/user_auth";
import "firebase/compat/auth";
import LoadingAction from "../LoadingComponent/LoadingAction";
function Profile() {
  const [value, onChange] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [check, setCheck] = useState(false);
  const [selectStep1, setSelectStep1] = useState(null);
  const [myAccount, setMyAccount] = useState([]);
  const [statusPromote, setStatusPromote] = useState(null);
  const { userGG } = useAuthListener();
  const getMyPromote = () => {
    setLoading(true);
    const afterURL = `PromoteRequest?user-id=${user.userVM.id}&order-by=Id&order-type=DESC&page-offset=1&limit=5`;
    const response = getAPI(afterURL);
    response
      .then((res) => {
        setStatusPromote(res.data.promoteRequests[0].status);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const getMyAccount = () => {
    setLoading(true);
    const afterURL = `users/${user.userVM.id}`;
    const response = getAPI(afterURL);
    response
      .then((res) => {
        let splitdate = dob.value.split("-");
        let day = parseInt(splitdate[2]) + 1;
        setEmail({ value: res.data.email });
        setUsername({ value: res.data.username });
        setGender({ value: res.data.gender });
        setDob({
          value: new Date(res.data.dateOfBirth).toISOString().split("T")[0],
        });
        setAvt({ value: res.data.avatar, img: res.data.avatar });
        setAddress({ value: res.data.address });
        setPhone({ value: res.data.phone });
        setBio({ value: res.data.bio });
        setIdentityCard({ value: res.data.identityCard });
        setNameBussiness({ value: res.data.nameBusiness });
        setPhoneBussiness({ value: res.data.phoneBusiness });
        setDateIdentityCard({ value: res.dateIssuance });
        setTinBussiness({ value: res.data.tinbusiness });
        setRole(res.data.roleId);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getMyPromote();
    getMyAccount();
  }, [check]);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState({ value: "", error: "" });
  const [username, setUsername] = useState({
    value: myAccount.username,
    error: "",
  });
  const [gender, setGender] = useState({
    value: "",
    error: "",
  });
  const [dob, setDob] = useState({ value: "", error: "" });
  const [address, setAddress] = useState({
    value: "",
    error: "",
  });
  const [phone, setPhone] = useState({ value: "", error: "" });
  const [avt, setAvt] = useState({
    value: "",
    error: "",
    img: "",
  });
  const [bio, setBio] = useState({ value: "", error: "" });
  const [identityCard, setIdentityCard] = useState({
    value: "",
    error: "",
  });
  const [dateIdentityCard, setDateIdentityCard] = useState({
    value: "",
    error: "",
  });
  const [phoneBussiness, setPhoneBussiness] = useState({
    value: "",
    error: "",
  });
  const [tinbussiness, setTinBussiness] = useState({
    value: "",
    error: "",
  });
  const [nameBussiness, setNameBussiness] = useState({
    value: "",
    error: "",
  });

  const validateForm = (name, value) => {
    switch (name) {
      case "avt":
        break;
      case "name":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Kh??ng ???????c ????? tr???ng",
          };
        } else if (/\d+/.test(value)) {
          return {
            flag: false,
            content: "*T??n ba??n l?? ch???",
          };
        }
        break;
      case "phone":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Kh??ng ???????c ????? tr???ng",
          };
        } else if (!/^[0-9]+$/.test(value)) {
          return {
            flag: false,
            content: "*S??? ??i???n tho???i kh??ng ???????c l?? ch??? hay k?? t??? kh??c",
          };
        } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(value)) {
          return {
            flag: false,
            content: "*Sai ?????nh d???ng s??? ??i???n tho???i",
          };
        }

        break;
      case "gender":
        break;
      case "address":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Kh??ng ???????c ????? tr???ng",
          };
        }
        break;
      case "dob":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Kh??ng ???????c ????? tr???ng",
          };
        }
        break;
      case "cmnd":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Kh??ng ???????c ????? tr???ng",
          };
        } else if (value.length !== 9 && value.length !== 12) {
          return {
            flag: false,
            content: "CMND/CCCD pha??i co?? 9 ho????c 12 s????",
          };
        }
        break;
      case "nameB":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Kh??ng ???????c ????? tr???ng",
          };
        }
        break;
      case "phoneB":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Kh??ng ???????c ????? tr???ng",
          };
        } else if (!/^[0-9]+$/.test(value)) {
          return {
            flag: false,
            content: "*S??? ??i???n tho???i kh??ng ???????c l?? ch??? hay k?? t??? kh??c",
          };
        } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(value)) {
          return {
            flag: false,
            content: "*Sai ?????nh d???ng s??? ??i???n tho???i",
          };
        }
        break;
      case "codeB":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Kh??ng ???????c ????? tr???ng",
          };
        }
        break;
      case "nc":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Kh??ng ???????c ????? tr???ng",
          };
        }
        break;
      case "bio":
        break;
      default:
        break;
    }

    return { flag: true, content: null };
  };

  const selectMyHost = (e) => {
    let { id } = e.target;
    if (id === "male") {
      setSelectStep1("canhan");
    } else if ((id = "fmale")) {
      setSelectStep1("doanhnghiep");
    }
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    const flagValid = validateForm(name, value);
    switch (name) {
      case "avt":
        const valueImg = URL.createObjectURL(e.target.files[0]);
        setAvt({
          ...avt,
          img: valueImg,
          value: e.target.files[0],
        });
        break;
      case "name":
        let username = null;
        if (flagValid.flag === false) {
          username = {
            value,
            error: flagValid.content,
          };
        } else {
          username = {
            value,
            error: null,
          };
        }
        setUsername({
          ...username,
        });
        break;
      case "phone":
        let phone = null;
        if (flagValid.flag === false) {
          phone = {
            value,
            error: flagValid.content,
          };
        } else {
          phone = {
            value,
            error: null,
          };
        }
        setPhone({
          ...phone,
        });
        break;
      case "gender":
        let gender = null;
        if (flagValid.flag === false) {
          gender = {
            value,
            error: flagValid.content,
          };
        } else {
          gender = {
            value,
            error: null,
          };
        }

        setGender({
          ...gender,
        });
        break;
      case "address":
        let address = null;
        if (flagValid.flag === false) {
          address = {
            value,
            error: flagValid.content,
          };
        } else {
          address = {
            value,
            error: null,
          };
        }
        setAddress({
          ...address,
        });
        break;
      case "dob":
        let dob = null;
        if (flagValid.flag === false) {
          dob = {
            value,
            error: flagValid.content,
          };
        } else {
          dob = {
            value,
            error: null,
          };
        }
        setDob({
          ...dob,
        });
        break;
      case "cmnd":
        let cmnd = null;
        if (flagValid.flag === false) {
          cmnd = {
            value,
            error: flagValid.content,
          };
        } else {
          cmnd = {
            value,
            error: null,
          };
        }
        setIdentityCard({
          ...cmnd,
        });
        break;
      case "nameB":
        let nameB = null;
        if (flagValid.flag === false) {
          nameB = {
            value,
            error: flagValid.content,
          };
        } else {
          nameB = {
            value,
            error: null,
          };
        }
        setNameBussiness({
          ...nameB,
        });
        break;
      case "codeB":
        let codeB = null;
        if (flagValid.flag === false) {
          codeB = {
            value,
            error: flagValid.content,
          };
        } else {
          codeB = {
            value,
            error: null,
          };
        }
        setTinBussiness({
          ...codeB,
        });
        break;
      case "phoneB":
        let phoneB = null;
        if (flagValid.flag === false) {
          phoneB = {
            value,
            error: flagValid.content,
          };
        } else {
          phoneB = {
            value,
            error: null,
          };
        }
        setPhoneBussiness({
          ...phoneB,
        });
        break;
      case "nc":
        let nc = null;
        if (flagValid.flag === false) {
          nc = {
            value,
            error: flagValid.content,
          };
        } else {
          nc = {
            value,
            error: null,
          };
        }
        setDateIdentityCard({
          ...nc,
        });
        break;
      case "bio":
        let bio = null;
        if (flagValid.flag === false) {
          bio = {
            value,
            error: flagValid.content,
          };
        } else {
          bio = {
            value,
            error: null,
          };
        }
        setBio({
          ...bio,
        });
        break;
      default:
        break;
    }
  };

  const onPromoteHandler = async (e) => {
    e.preventDefault();
    console.log(dateIdentityCard.value);
    setLoading(true);
    if (
      identityCard.value === "" ||
      dateIdentityCard.value === "" ||
      dateIdentityCard.value === undefined ||
      identityCard.value === null
    ) {
      toast.error("Vui lo??ng ki????m tra la??i th??ng tin", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
      return;
    } else if (
      identityCard.value.length !== 9 &&
      identityCard.value.length !== 12
    ) {
      toast.error("CMND/CCCD pha??i co?? 9 ho????c 12 s????", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
      return;
    }
    const data = {
      requestContent:
        username.value + " ??a?? g????i y??u c????u th??ng c????p ng??????i ta??o gia??i",
      identityCard: identityCard.value,
      dateIssuance: dateIdentityCard.value,
      userId: user.userVM.id,
    };
    try {
      const response = await axios.post(
        "https://afootballleague.ddns.net/api/v1/PromoteRequest",
        data
      );
      if (response.status === 201) {
        setCheck(!check);
        setLoading(false);
        toast.success(
          "G????i y??u c????u th??ng c????p tha??nh c??ng, vui lo??ng ch???? xe??t duy????t",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
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
  };

  const onPromoteHandlerBusiness = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      nameBussiness.value === "" ||
      phoneBussiness.value === "" ||
      tinbussiness.value === "" ||
      nameBussiness.value === null ||
      phoneBussiness.value === null ||
      tinbussiness.value === null
    ) {
      toast.error("Vui lo??ng ki????m tra la??i th??ng tin", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
      return;
    }
    const data = {
      requestContent:
        username.value + " ??a?? g????i y??u c????u th??ng c????p ng??????i ta??o gia??i",
      phoneBusiness: phoneBussiness.value,
      nameBusiness: nameBussiness.value,
      tinbusiness: tinbussiness.value,
      userId: user.userVM.id,
    };
    try {
      // const response = await axios.get(
      //   "https://thongtindoanhnghiep.co/api/company/3901212654",
      //   {headers: {"Access-Control-Allow-Origin": "*"}}
      // );
      //     console.log(response)
      const response = await axios.post(
        "https://afootballleague.ddns.net/api/v1/PromoteRequest",
        data
      );
      if (response.status === 201) {
        setLoading(false);
        setCheck(!check);
        toast.success(
          "G????i y??u c????u th??ng c????p tha??nh c??ng, vui lo??ng ch???? xe??t duy????t",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
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
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (
      username.value.trim() === "" ||
      phone.value.trim() === "" ||
      dob.value === undefined ||
      dob.value === ""
    ) {
      toast.error("Vui lo??ng ki????m tra la??i th??ng tin", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    const data = {
      id: user.userVM.id,
      username: username.value,
      gender: gender.value,
      dateOfBirth: new Date(dob.value),
      address: address.value,
      phone: phone.value,
      avatar: avt.value,
      bio: bio.value,
      identityCard: identityCard.value,
      phoneBusiness: phoneBussiness.value,
      nameBusiness: nameBussiness.value,
      tinbusiness: tinbussiness.value,
    };
    try {
      const response = await axios.put(
        "https://afootballleague.ddns.net/api/v1/users",
        data,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );
      if (response.status === 201) {
        toast.success("C????p nh????t tha??nh c??ng", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        window.location.reload();
      }
    } catch (error) {
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
  };
  return (
    <>
      <ScrollToTop />
      {loading ? <LoadingAction /> : null}
      <Header />
      <div className={styles.profile}>
        <h2 className={styles.profile__title}>Th??ng tin ca?? nh??n</h2>
        <form onSubmit={onSubmitHandler} className={styles.profile__wrap}>
          <div className={styles.profile__img}>
            <label htmlFor="avt">
              <img src={avt.img} alt={username.value} />
              <h5>Thay ??????i hi??nh ??a??i di????n</h5>
            </label>
            <input
              type="file"
              id="avt"
              accept="image/*"
              name="avt"
              onChange={onChangeHandler}
            />
            <div className={styles.email}>{email.value}</div>
            {userGG ? null : (
              <Link to="/changePassword" className={styles.changePass}>
                ??????i m????t kh????u
              </Link>
            )}
          </div>
          <div className={styles.profile__text}>
            <div className={styles.text}>
              <label htmlFor="name">Ho?? va?? t??n</label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="off"
                value={username.value}
                onChange={onChangeHandler}
              />
              {username.error != null ? (
                <p className={styles.error}>{username.error}</p>
              ) : null}
            </div>
            <div className={styles.text}>
              <label htmlFor="phone">S???? ??i????n thoa??i</label>
              <input
                type="number"
                id="phone"
                name="phone"
                autoComplete="off"
                value={phone.value}
                onChange={onChangeHandler}
              />
              {phone.error != null ? (
                <p className={styles.error}>{phone.error}</p>
              ) : null}
            </div>
            <div className={styles.text}>
              <label htmlFor="gender" autoComplete="off">
                Gi????i ti??nh
              </label>
              <select id="gender" onChange={onChangeHandler} name="gender">
                <option
                  selected={gender.value === "Male" ? true : false}
                  value="Male"
                >
                  Nam
                </option>
                <option
                  selected={gender.value === "Female" ? true : false}
                  value="Female"
                >
                  N????
                </option>
              </select>
            </div>
            <div className={styles.text}>
              <label htmlFor="address">??i??a chi??</label>
              <input
                type="text"
                id="address"
                autoComplete="off"
                value={address.value}
                onChange={onChangeHandler}
                name="address"
              />
            </div>
            <div className={styles.text}>
              <label htmlFor="dob" autoComplete="off">
                Nga??y sinh
              </label> 
               <input
                type="date"
                id="dob"
                value={dob.value}
                onChange={onChangeHandler}
                min="1990-01-01"
                placeholder="dd-mm-yyyy"
                max={date}
                name="dob"
                
              />
                {/* <DateTimePicker onChange={onChange} value={value} className={styles.datetimepicker} calendarClassName={styles.calendar}/> */}
            </div>
            <div className={styles.text}>
              <label htmlFor="bio">M?? ta?? </label>
              <textarea
                id="bio"
                value={bio.value}
                onChange={onChangeHandler}
                name="bio"
              />
            </div>
            <input type="submit" value="L??u" className={styles.btnSave} />
          </div>
        </form>
        <h2 className={styles.profile__title2}>N??ng c????p ta??i khoa??n</h2>
        {statusPromote === null || statusPromote === "T???? ch????i" ? (
          <>
            <span className={styles.note}>
              *Th??ng tin n????u ba??n mu????n tr???? tha??nh ng??????i ta??o gia??i
            </span>
            <p className={styles.step}>B??????c 1:</p>
            <span className={styles.textChoose}>Ba??n la?? m????t</span>
            <input
              type="radio"
              id="male"
              className={styles.radio__input}
              name="gender"
              onChange={selectMyHost}
            />
            <label
              for="male"
              className={`${styles.radio__label} ${styles.r1}`}
            ></label>
            <input
              type="radio"
              id="fmale"
              className={styles.radio__input}
              name="gender"
              onChange={selectMyHost}
            />
            <label
              for="fmale"
              className={`${styles.radio__label} ${styles.r2}`}
            ></label>
            {selectStep1 !== null ? (
              <>
                <p className={styles.step2}>B??????c 2:</p>
                {selectStep1 === "canhan" ? (
                  <form
                    onSubmit={onPromoteHandler}
                    className={`${styles.profile__wrap} ${styles.update}`}
                  >
                    <div className={styles.profile__text}>
                      <div className={styles.text}>
                        <label htmlFor="cmnd">CMND</label>
                        <input
                          type="number"
                          id="cmnd"
                          autoComplete="off"
                          value={identityCard.value}
                          onChange={onChangeHandler}
                          name="cmnd"
                        />
                        {identityCard.error != null ? (
                          <p className={styles.error}>{identityCard.error}</p>
                        ) : null}
                      </div>
                      <div className={styles.text}>
                        <label htmlFor="nc">Nga??y c????p</label>
                        <input
                          type="date"
                          id="nc"
                          autoComplete="off"
                          value={dateIdentityCard.value}
                          onChange={onChangeHandler}
                          name="nc"
                          min="1990-01-01"
                          placeholder="dd-mm-yyyy"
                          max={date}
                        />
                        {dateIdentityCard.error != null ? (
                          <p className={styles.error}>
                            {dateIdentityCard.error}
                          </p>
                        ) : null}
                      </div>
                      <input
                        type="submit"
                        value="N??ng c????p"
                        className={styles.btnSave}
                      />
                    </div>
                  </form>
                ) : null}

                {selectStep1 === "doanhnghiep" ? (
                  <form
                    onSubmit={onPromoteHandlerBusiness}
                    className={`${styles.profile__wrap} ${styles.update}`}
                  >
                    <div className={styles.profile__text}>
                      <div className={styles.text}>
                        <label htmlFor="nameB">T??n doanh nghi????p</label>
                        <input
                          type="text"
                          id="nameB"
                          autoComplete="off"
                          value={nameBussiness.value}
                          onChange={onChangeHandler}
                          name="nameB"
                        />
                        {nameBussiness.error != null ? (
                          <p className={styles.error}>{nameBussiness.error}</p>
                        ) : null}
                      </div>
                      <div className={styles.text}>
                        <label htmlFor="codeB">Ma?? doanh nghi????p</label>{" "}
                        <input
                          type="text"
                          id="codeB"
                          autoComplete="off"
                          value={tinbussiness.value}
                          onChange={onChangeHandler}
                          name="codeB"
                        />
                        {tinbussiness.error != null ? (
                          <p className={styles.error}>{tinbussiness.error}</p>
                        ) : null}
                      </div>
                      <div className={styles.text}>
                        <label htmlFor="phoneB">
                          S???? ??i????n thoa??i doanh nghi????p
                        </label>
                        <input
                          type="number"
                          id="phoneB"
                          autoComplete="off"
                          value={phoneBussiness.value}
                          onChange={onChangeHandler}
                          name="phoneB"
                        />
                        {phoneBussiness.error != null ? (
                          <p className={styles.error}>{phoneBussiness.error}</p>
                        ) : null}
                      </div>
                      <input
                        type="submit"
                        value="N??ng c????p"
                        className={styles.btnSave}
                      />
                    </div>
                  </form>
                ) : null}
              </>
            ) : null}
          </>
        ) : null}
        {statusPromote === "??a?? duy????t" ? (
          <p className={styles.acer}>
            <i class="fa-solid fa-trophy"></i> Ba??n ??a?? la?? m????t ng??????i ta??o gia??i{" "}
          </p>
        ) : null}
        {statusPromote === "Ch??a duy???t" ? (
          <p className={styles.acer}>
            {" "}
            <i className="fa-solid fa-circle-check"></i> Y??u c????u ??a?? g????i vui lo??ng
            ch???? duy????t
          </p>
        ) : null}
        {/* <div className={styles.profile__delete}> */}
          {/* <div className={styles.delete__title}>Xo??a ta??i khoa??n</div>
          <div className={styles.delete__wrap}>
            <p>
              H??y nh??? r???ng khi x??a t??i kho???n th?? t???t c??? th??ng tin v??? t??i kho???n,
              gi???i ?????u v?? ?????i thi ?????u c???a b???n s??? b??? x??a m?? kh??ng th??? kh??i ph???c
              l???i ???????c.
            </p>
            <button>Xo??a ta??i khoa??n</button>
          </div> */}
        {/* </div> */}
      </div>
      <Footer />
    </>
  );
}

export default Profile;
